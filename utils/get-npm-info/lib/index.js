'use strict';

const axios = require('axios')
const semver = require('semver')
const urlJoin = require('url-join')

function getNpmInfo(npmName, registry) {
  if (!npmName) {
    return null
  }
  const registryUrl = registry || getDefaultRegistry();
  const npmInfoUrl = urlJoin(registryUrl, npmName);
  return axios.get(npmInfoUrl).then(res => {
    if (res.status === 200) {
      return res.data;
    }
    return null;
  }).catch (e => {
    return Promise.reject(e);
  })
}

function getDefaultRegistry(isOriginal = false) {
  return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org'
}

module.exports = {
  getNpmInfo,
}
