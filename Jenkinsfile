import java.text.SimpleDateFormat

node('Slave') {
    checkout scm
    def branch = env.BRANCH_NAME ?: 'master'
    def curStage = 'Start'
    def emailList = 'thomas.ramirez@osi.ca.gov'
    def pipelineStatus = 'SUCCESS'
    def successColor = '11AB1B'
    def failureColor = '#FF0000'
    SimpleDateFormat dateFormatGmt = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
    def buildDate = dateFormatGmt.format(new Date())

    /* dateFormatGmt.setTimeZone(TimeZone.getTimeZone("GMT")); */

    try {
        emailList = EMAIL_NOTIFICATION_LIST
    } catch (e) {
        // Okay not to perform assignment if EMAIL_NOTIFICATION_LIST is not defined
    }

    try {
        stage('Test') {
            curStage = 'Test'
            sh 'make test'
        }

        if (branch == 'master') {
            int offset = VERSION_STRATEGY.split(':')[1]
            int buildNumber = (BUILD_NUMBER.toInteger() - offset).toString()
            VERSION = sh(
                script: 'git describe --tags $(git rev-list --tags --max-count=1)',
                returnStatus: true
            )
            VCS_REF = sh(
                script: 'git rev-parse --short HEAD',
                returnStatus: true
            )

            stage('Build') {
                curStage = 'Build'
                sh 'make build'
            }

            stage('Release') {
                curStage = 'Release'
                withEnv(["BUILD_DATE=${buildDate}","BUILD_NUMBER=${BUILD_NUMBER}","VERSION=${VERSION}","VCS_REF=${VCS_REF}"]) {
                    sh 'make release'
                }
            }

            stage('Publish') {
                curStage = 'Publish'
                if(VERSION_STRATEGY.startsWith('CALCULATE')) {
                    sh "make tag latest \$(git describe --tags \$(git rev-list --tags --max-count=1)).${buildNumber}"
                } else {
                    sh 'make tag latest $(git describe --tags $(git rev-list --tags --max-count=1))'
                }
                withEnv(["DOCKER_USER=${DOCKER_USER}",
                         "DOCKER_PASSWORD=${DOCKER_PASSWORD}"]) {
                    sh "make login"
                    sh "make publish"
                }
            }
        }
    }
    catch (e) {
        pipelineStatus = 'FAILED'
        throw e
    }
    finally {
        try {
            stage ('Reports') {
                step([$class: 'JUnitResultArchiver', testResults: '**/reports/*.xml'])

                publishHTML (target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: false,
                    keepAll: true,
                    reportDir: 'reports/coverage/js',
                    reportFiles: 'index.html',
                    reportName: 'JS Code Coverage'
                ])

                publishHTML (target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: false,
                    keepAll: true,
                    reportDir: 'reports/coverage/ruby',
                    reportFiles: 'index.html',
                    reportName: 'Ruby Code Coverage'
                ])
            }
        }
        catch(e) {
            pipelineStatus = 'FAILED'
            currentBuild.result = 'FAILURE'
        }

        // disabling slack alerts when using a branch different from master.
        if (branch == 'master') {
          try {
              emailext (
                  to: emailList,
                  subject: "${pipelineStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' in stage ${curStage}",
                  body: """<p>${pipelineStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' in stage '${curStage}' for branch '${branch}':</p>
                  <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>"""
              )

              slackAlertColor = successColor
              slackMessage = "${pipelineStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' completed for branch '${branch}' (${env.BUILD_URL})"

              if(pipelineStatus == 'FAILED') {
                slackAlertColor = failureColor
                slackMessage = "${pipelineStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' in stage '${curStage}' for branch '${branch}' (${env.BUILD_URL})"
              }

              slackSend (color: slackAlertColor, message: slackMessage)
          }
          catch(e) { /* Nothing to do */ }
        }

        stage('Clean') {
            retry(2) {
                sh 'make clean'
            }
            sh 'make logout'
        }
    }
}
