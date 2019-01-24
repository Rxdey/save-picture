const moment = require('moment');
const { md5 } = require('../../utils/utils');
const { liveUser } = require('../../model/model');
const { getToken } = require('../../../conf/jwt');

let msg = { message: '用户名或密码不正确',code: '00000', data: null, state: 0 };

const login = (router) =>{
  router.all('/api/login', async (ctx, next) => {
    let username = ctx.request.body.username;
    if(!username){
      msg.message = '用户名不能为空'
      ctx.body = msg;
      return
    }
    let password = ctx.request.body.password;
    if(!password){
      msg.message = '密码不能为空'
      ctx.body = msg;
      return
    }
    password = md5(password);
    let isUser = await liveUser.findOne({ where: { user_name: username, pass_word: password } });

    if(isUser){
      let token = getToken({user: username,user_id:isUser.user_id});
      msg.message = `欢迎回来，${isUser.nick_name}`;
      msg.data = {user:isUser, token: token};
      msg.state = 1;
    }
    ctx.body = msg;
  });
}
module.exports = login;