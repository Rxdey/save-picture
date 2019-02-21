const Router = require('koa-router');
const router = new Router();
const { findUser, insertUser, findPassword, insertImage, findImage, deleteImage } = require('../model/model');
// const login = require('./user/login');
const { getToken, getJWTPayload } = require('../../conf/jwt');
const { md5 } = require('../utils/utils');
// let msg = { message: '', code: '00000', data: null, state: 1 };

router.get('/', async (ctx, next) => {
  let title = 'api';
  await ctx.render('index', {
    title
  });
});
router.post('/api/allpic', async (ctx, next) => {
  const user = getJWTPayload(ctx.header.authorization);
  if(!user.userId){
    ctx.body = {message:'未登录',code: '0000', state: 0};
    return false
  }
  const list = await findImage(user.userId);
  console.log(list)
  ctx.body = {message:'查询成功',code: '0000', state: 1, data: list[0] };
});

router.post('/api/del', async (ctx, next) => {
  const {id} = ctx.request.body;
  if(!id){
    ctx.body = {message:'字段不存在',code: '0000', state: 0};
    return 
  }
  const user = getJWTPayload(ctx.header.authorization);
  if(!user.userId){
    ctx.body = {message:'未登录',code: '0000', state: 0};
    return false
  }
  const list = await deleteImage(id);
  ctx.body = {message:'删除成功',code: '0000', state: 1};
});

router.post('/api/login', async (ctx, next) => {
  let { username, password } = ctx.request.body;
  password = md5(password);
  const isReg = await findUser(username);
  if (isReg <= 0) {
    ctx.body = {message:'用户不存在', code: '0000', state: 0};
    return false
  }
  const isUser = await findPassword(username, password);
  if (!isUser) {
    ctx.body = {message:'密码错误',code: '0000', state: 0};
    return false
  }
  const token = getToken({userId: isUser.id, user_id: isUser.user_id});
  ctx.body = {message:'登陆成功', code: '0000', state: 1, data: {
    token: token,
    userId: isUser.id
  }};
});

router.post('/api/reg', async (ctx, next) => {
  let { username, password } = ctx.request.body;
  password = md5(password);
  const isReg = await findUser(username);
  if(isReg > 0){
    ctx.body = {message:'用户已存在',code: '0000', state: 0};
    return false
  }
  const res = await insertUser(username,password)

  ctx.body = {message:'注册成功',code: '0000', state: 1};
});

router.post('/api/saveImage', async (ctx, next) => {
  
  const user = getJWTPayload(ctx.header.authorization);
  if(!user.userId){
    ctx.body = {message:'未登录',code: '0000', state: 0};
    return false
  }
  const { imgSrc, from_path } = ctx.request.body;
  const res = await insertImage(user.userId, imgSrc, from_path)
  
  ctx.body = {message:'已保存',code: '0000', state: 1};
});

router.all('/findpassword', async (ctx, next) => {
  let title = '找回密码';
  await ctx.render('findpassword', {
    title
  });
});
router.all('/registered', async (ctx, next) => {
  let title = '注册';
  await ctx.render('registered', {
    title
  });
});

module.exports = router;
