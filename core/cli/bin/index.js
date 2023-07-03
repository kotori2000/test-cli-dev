#! /usr/bin/env node
// const importLocal = require('import-local')

// // console.log(importLocal(__filename))
// if (importLocal(__filename)) {
//   require('npmlog').info('cli', '正在使用 cli 本地版本')
// } else {
//   require('../lib')(process.argv.slice(2))
// }

const commander = require('commander')

const pkg = require('../package.json')

// 获取commander的单例
// const { program } = commander

// 手动实例化一个Command实例
const program = new commander.Command();

program
  .name(Object.keys(pkg.bin)[0])
  .usage('[commander] [options]')
  .version(pkg.version)
  .option('-d --debug', '是否开启调试模式', false);

// command 注册命令
const clone = program.command('clone <source> [desc]');
clone
  .description('clone a repository')
  .option('-f --force', '是否强制克隆')
  .action((source, desc, cmdObj) => {
    console.log(source, desc, 'do clone', cmdObj);
  });

// addCommand 注册命令
// const service = new commander.Command('service');
// service
//   .command('start [port]')
//   .description('start service by port')
//   .action((port) => {
//     console.log('do service start', port);
//   })

program
  .command('install [name]', 'install package', {
    executableFile: 'test-cli',
    isDefault: true,
    hidden: true,
  })
  .alias('i');

program
  .arguments('<cmd> [options]') // 这里要求command必须输入一个命令
  .description('test command')
  .action((cmd, options) => {
    console.log(cmd, options);
  });

program
  .parse(process.argv);

  // program.outputHelp();