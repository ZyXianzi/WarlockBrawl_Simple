#! /bin/bash

JS_PATH=/home/zyxianzi/Warlock/game/static/js/
JS_PATH_DIST=${JS_PATH}dist/
JS_PATH_SRC=${JS_PATH}src/

find ${JS_PATH_SRC} -type f -name '*.js' | sort -r | xargs cat > ${JS_PATH_DIST}game.js