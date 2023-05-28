#! /usr/bin/env node
// "@gerhardt-test-cli-dev/utils": "file:../utils"：  本地开发，软链最佳实践，但需要脚本在publish的时候将本地地址替换成线上的
const utils = require("@gerhardt-test-cli-dev/utils")
const yargs = require("yargs/yargs")
const dedent = require("dedent")
const pkg = require("../package.json")

const { hideBin } = require('yargs/helpers')
// const { option, require } = require("yargs")
const arg = hideBin(process.argv)
const cli = yargs(arg)

const context = {
  testCliVersion: pkg.version
}
const argv = process.argv.slice(2)

cli
  .usage('Usage: cli-test [command] <options>')
  .demandCommand(1, "A command is required. Pass --help to see all available commands and options.")
  .strict()
  .recommendCommands() // 命令智能推荐
  .fail((err, msg) => {
    console.log(err, msg)
  })
  .alias("h", "help")
  .alias("v", "version")
  // .alias("d", "debug")
  .wrap(cli.terminalWidth())
  .epilogue(dedent`
  When a command fails, all logs are written to lerna-debug.log in the current working directory.

  For more information, check out the docs at https://lerna.js.org/docs/introduction
`)
  .options({
    debug: {
      type: 'boolean',
      describe: 'bootstrap debug mode',
      alias: 'd'
    }
  })
  .option('registry', {
    type: 'string',
    describe: 'define global registry',
    alias: 'r'
  })
  .group(['debug'], 'Dev options:')
  .group(['registry'], 'Extra options:')
  .command('init [name]', 'Do init a project', (yargs) => {
    yargs
      .option('name', {
        type: 'string',
        describe: 'Name of a project'
      })
  }, (argv) => {
    console.log('commandArgv', argv);
  })
  .command(
    {
      command: 'list',
      alias: ['ls', 'la'],
      describe: 'local packages',
      builder: (yargs) => {},
      handler: (argv) => {
        console.log('list command argv', argv)
      }
    }
  )
  .parse(argv, context); // 该方法可以往argv中注入参数


console.log('hello, kotori2000 rebase 测试2')
console.log('增加commit')
console.log('utils', utils())