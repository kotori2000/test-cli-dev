import { exists } from './utils';
const path = require('path');


console.log(path.resolve('.'));
console.log(exists(path.resolve('.')));

(async function() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('async ok!');
})();
