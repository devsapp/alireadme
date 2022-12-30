import Koa from 'koa';
import { getRootHome, fse, request, lodash as _ } from '@serverless-devs/core';
import onError from 'koa-onerror';
import Router from 'koa-router';
import cors from '@koa/cors';
import open from 'open';
import path from 'path';
import getRowBody from 'raw-body';
import views from 'koa-views';
import serve from 'koa-static';
import { getInitValues, getPublishValue } from './util';
import { genReadmeStr, getReadmePath } from './util/stencil';

const router = Router();

export default class Server {
  PORT = 9000;
  HOST = 'localhost';
  app: Koa;

  constructor() {
    this.app = new Koa();
  }

  start() {
    onError(this.app);

    this.app.use(cors());
    this.app.use(views(path.join(__dirname, 'view'), {
      extension: 'ejs'
    }));
    this.app.use(serve(path.join(__dirname, 'view')));
    // @ts-ignore
    this.app.use(router.routes(), router.allowedMethods());
    // error-handling
    this.app.on("error", (err, ctx) => {
      console.error("server error", err, ctx);
      ctx.body = {
        "code": 400,
        "msg": err.message,
      }
    });

    const server = this.app.listen(this.PORT, this.HOST);
    server.on('error', (err) => {
      // @ts-ignore
      if (err.code === 'EADDRINUSE') {
        this.PORT = this.PORT + 1;
        this.start();
      } else {
        throw err;
      }
    });
    server.on('listening', () => {
      const addr = `http://${this.HOST}:${this.PORT}`;
      open(addr);
    })
    server.timeout = 0;
    server.setTimeout(0);
    server.keepAliveTimeout = 0;

    this.handleRouter();
  }

  async getBody(ctx: any): Promise<any> {
    return await new Promise(r => getRowBody(ctx.req, (_err, body) => r(body)));
  }

  handleRouter() {
    router.get('/', async (ctx) => {
      const values = getInitValues();
      await ctx.render('index', { ...values });
    });

    router.post('/image', async (ctx) => {
      let token;
      try {
        token = fse.readFileSync(`${getRootHome()}/serverless-devs-platform.dat`, 'utf-8');
        if (!token) {
          ctx.body = {
            "code": 422,
            "msg": 'you need to login to registry: s cli registry login',
          };
          return;
        }
      } catch (ex) {
        ctx.body = {
          "code": 422,
          "msg": 'you need to login to registry: s cli registry login',
        }
      }

      try {
        const resData = await request('http://editor.devsapp.cn/images', {
          method: 'POST',
          form: true,
          body: {
            'safety_code': token
          }
        });
        console.log('resData: ', resData);
        if (resData.error) {
          ctx.body = {
            "code": 422,
            "msg": resData.error,
          };
        } else if (resData.Response?.Error) {
          ctx.body = {
            "code": 422,
            "msg": 'login failed',
          };
        } else {
          const body = JSON.parse((await this.getBody(ctx)).toString());
          const base64 = (body.file || '').replace(/^data:image\/\w+;base64,/, "");
          const res = await request(resData.upload, {
            'method': 'PUT',
            json: false,
            body: Buffer.from(base64, 'base64'),
          });
          console.log('上传 res: ', res);
          if (res?.body?.includes?.("Error")) {
            ctx.body = {
              "code": 422,
              "msg": 'unknown error, please try again later',
            };
          } else {
            ctx.body = {
              "code": 200,
              url: resData.url,
            };
          }
        }
      } catch (ex) {
        console.log('出现了异常：', ex);
        ctx.body = {
          "code": 422,
          "msg": ex.message,
        };
      }
    });

    router.post('/save', async (ctx) => {
      const body = JSON.parse((await this.getBody(ctx)).toString());
      const values = getInitValues();

      const { Description, Name } = getPublishValue();
      body.appName = Name;
      body.appDescription = Description;

      const str = genReadmeStr(_.defaults(body, values));
      // console.log(str);
      fse.writeFileSync(getReadmePath(), str);

      ctx.body = {
        "code": 200,
        "msg": 'success',
      };
    })
  }
}
