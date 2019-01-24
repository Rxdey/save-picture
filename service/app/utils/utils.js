const crypto = require('crypto');
/**
 *@param   str 字符串
 *@param   key 秘钥
 **/
const md5 = (str, key = '') => {
  var decipher = crypto.createHash('md5', key);
  if (key) {
    return decipher.update(str).digest();
  }
  return decipher.update(str).digest('hex').toUpperCase();
};

module.exports = {
  md5,
};
