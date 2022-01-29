#! /bin/bash
ROOT_PATH=/home/zyxianzi/Warlock
JS_PATH=${ROOT_PATH}/game/static/js
JS_PATH_DIST=${JS_PATH}/dist
JS_PATH_BUILD=${JS_PATH}/build
TS_PATH=${JS_PATH}/src
JS_STATIC_PATH=${ROOT_PATH}/static/js

rm -rf ${JS_PATH_BUILD}/  # 清空build文件夹

tsc -p ${JS_PATH}/  # 编译ts文件

find ${JS_PATH_BUILD}/ -type f -name '*.js' | sort -r | xargs cat > ${JS_PATH_DIST}/game.js  # 合成js文件

sed -i "s/import/\/\/import/g" ${JS_PATH_DIST}/game.js  # 注释import行

uglifyjs ${JS_PATH_DIST}/game.js -c -m -o ${JS_PATH_DIST}/game.js  # 压缩js文件

echo yes | python3 manage.py collectstatic  # django collectstatic

rm -rf ${JS_STATIC_PATH}/node_modules/ ${JS_STATIC_PATH}/build/ ${JS_STATIC_PATH}/src/ ${JS_STATIC_PATH}/package-lock.json ${JS_STATIC_PATH}/tsconfig.json  # 删除多余文件