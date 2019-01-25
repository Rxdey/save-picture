const Koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const router = require('./app/router/index.js');
const cors = require('koa2-cors');
const static = require('koa-static');
const session = require('koa-session-minimal');
const views = require('koa-views');
const multer = require('koa-multer');
const koaJwt = require('koa-jwt');
const color = require('colors');

// const colors = require('colors');
const { jwtSecret } = require('./conf/jwt');
const app = new Koa();

const staticPath = './app/static'; // 静态资源目录

const upload = multer({ dest: path.join(__dirname, './app/static/upload/') });

app
  .use(bodyParser())
  .use(
    views(path.join(__dirname, './app/view/page'), {
      extension: 'ejs'
    })
  )
  .use(
    cors({
      origin: function(ctx) {
        return '*'; //允许
      },
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
      maxAge: 5,
      credentials: true,
      allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Authorization']
    })
  )
  .use(static(path.join(__dirname, staticPath)))
  .use(
    session({
      key: 'SESSION-ID', // cookie 中存储 session-id 时的键名, 默认为 koa:sess
      cookie: {
        maxAge: '', // cookie有效时长
        expires: '', // cookie失效时间
        path: '', // 写cookie所在的路径
        domain: '', // 写cookie所在的域名
        httpOnly: '', // 是否只用于http请求中获取
        overwrite: '', // 是否允许重写
        secure: '',
        sameSite: '',
        signed: ''
      }
    })
  )
  // jwt
  .use((ctx, next) => {
    return next().catch(err => {
      if (err.status === 401) {
        ctx.status = 401;
        ctx.body = {
          message: '身份验证失败或已过期,请重新登录',
          data: null,
          code: '88888',
          state: 0
        };
      } else {
        throw err;
      }
    });
  })
  .use(
    koaJwt({ secret: jwtSecret }).unless({
      path: [/registered/, /findpassword/, /login/, '/']
    })
  )
  .use(router.routes())
  .use(router.allowedMethods());

// websocket

console.log(`server start at http://localhost:3000/`.green);
app.listen(3000);
