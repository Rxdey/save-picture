const jwt = require('jsonwebtoken');

const jwtSecret = 'live';
const tokenExpiresTime = 1000 * 60 * 60 * 24 * 3

const getToken = (payload = {}) =>{
  return jwt.sign(payload, jwtSecret, {expiresIn: '720h'});
}

const getJWTPayload = (token) => {
  // 验证并解析JWT
  return jwt.verify(token.split(' ')[1], jwtSecret);
}

module.exports = {
  jwtSecret,
  tokenExpiresTime,
  getToken,
  getJWTPayload
}