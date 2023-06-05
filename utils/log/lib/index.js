'use strict';

const log = require('npmlog');

log.heading = 'test'; // 自定义命令前缀
log.headingStyle = { fg: 'red', bg: 'white' } // 修改前缀样式
log.level = process.env.LOG_LEVEL ?? 'info'; // 修改打印命令的等级
log.addLevel('success', 2000, { fg: 'green', blod: 'true' }); // 添加自定义命令

module.exports = log;