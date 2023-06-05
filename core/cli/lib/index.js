'use strict';

module.exports = core;
// require支持加载资源有 .js .json .node
// js => module.exports/exports
// json => json.parse解析文件输出介js对象
// node => process.dlopen处理c++插件
// any => 统一默认使用处理js文件的方式进行处理

const pkg = require('../package.json')
const log = require('@gerhardt-test-cli-dev/log')
const constant = require('./const')
const semver = require('semver')
const colors = require('colors/safe')

function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
  } catch (e) {
    log.error(e.message)
  }
}

function checkPkgVersion() {
  log.notice('cli', pkg.version)
}

function checkNodeVersion() {
  const currentVersion = process.version
  const lowestVersion = constant.LOWEST_NODE_VERSION
  // process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;
  if (!semver(currentVersion, lowestVersion)) {
    throw new Error(colors.red(`test-cli-dev 需要安装v${lowestVersion} 以上版本的node.js`))
  }
}