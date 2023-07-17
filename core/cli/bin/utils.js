import pathExists from 'path-exists'

// module.exports = function (){
//   console.log('hello utils');
// }

export function exists(p) {
  return pathExists.sync(p);
}