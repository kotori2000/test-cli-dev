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

async function getNpmVersions(npmName, registry) {
  const npmInfo = await getNpmInfo(npmName, registry)
  if (npmInfo) {
    return Object.keys(npmInfo.versions);
  } else {
    return [];
  }
}

function getSemverVersions(baseVersion, versions) {
  return versions
    .filter(version => semver.satisfies(version, `^${baseVersion}`))
    .sort((a, b) => semver.gt(b, a));
}

async function getNpmSemverVersions(baseVersion, npmName, registry) {
  const npmVersions = await getNpmVersions(npmName, registry);
  const newVersions = getSemverVersions(baseVersion, npmVersions);
  if (newVersions && newVersions.length > 0) {
    return newVersions[0]
  }
}

module.exports = {
  getNpmInfo,
  getNpmVersions,
  getNpmSemverVersions,
}
