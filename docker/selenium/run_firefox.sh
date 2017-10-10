#!/bin/bash
xvfb-run -a --server-args="-screen 0 1360x1020x24 -ac +extension RANDR" /usr/bin/firefox "$@"
