'use strict';

module.exports = core;
// require支持加载资源有 .js .json .node
// js => module.exports/exports
// json => json.parse解析文件输出介js对象
// node => process.dlopen处理c++插件
// any => 统一默认使用处理js文件的方式进行处理

const path = require('path')
const pkg = require('../package.json')
const log = require('@gerhardt-test-cli-dev/log')
const constant = require('./const')
const semver = require('semver')
const colors = require('colors/safe')
const rootCheck = require('root-check');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;

let args;

async function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    checkInputArgs();
    checkEnv();
    await checkGlobalUpdate();
    log.verbose('debug', 'test bug log');
  } catch (e) {
    log.error(e.message);
  }
}

async function checkGlobalUpdate() {
  // 1.获取当前版本号和模块名
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  // 2.调用npmAPI，获取所有版本号
  const { getNpmVersions, getNpmSemverVersions } = require('@gerhardt-test-cli-dev/get-npm-info');
  // 3.提取所有版本号，对比那些版本号大于用户当前版本号
  const lastVersion = await getNpmSemverVersions('1.0.6', npmName);
  // 4.提取最新版本号，提示用户更新到此版本
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(colors.yellow(`请手动更新${npmName}, 当前版本${currentVersion}, 最新版本${lastVersion}
    更新命令 npm install -g ${npmName} 请更新至最新版本`))
  }
}

function checkEnv() {
  const dotenv = require('dotenv')
  const dotenvPath = path.resolve(userHome, '.env');
  if (pathExists(dotenvPath)) {
    dotenv.config({ // 会将path的环境变量也能通过process.env直接访问
      path: dotenvPath,
    });
  }
  createDefaultConfig();
  log.verbose('环境变量', process.env.CLI_HOME_PATH);
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome
  }
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
}

function checkInputArgs () { // 判断是否要打印debug日志
  const minimist = require('minimist')
  args = minimist(process.argv.slice(2));
  // console.log(args);
  checkArgs();
};

function checkArgs() {
  if (args.debug) {
    log.level = 'verbose';
    // process.env.LOG_LEVEL = 'verbose';
  }
}

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前用户主目录不存在！'));
  }
  // console.log(userHome); // 拿到用户的主目录（/Users/admin）
};

function checkPkgVersion() {
  log.notice('cli', pkg.version);
};

function checkNodeVersion() {
  const currentVersion = process.version
  const lowestVersion = constant.LOWEST_NODE_VERSION
  // process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;
  if (semver.lt(currentVersion, lowestVersion)) {
    throw new Error(colors.red(`test-cli-dev 需要安装v${lowestVersion} 以上版本的node.js`))
  }
};

function checkRoot() {
  rootCheck() // 调用这个方法即使用sudo管理者权限执行，权限也会被下降
  // console.log(process.geteuid())
};