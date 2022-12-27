import Koa from 'koa';
import onError from 'koa-onerror';
import Router from 'koa-router';
import open from 'open';
import path from 'path';
import getRowBody from 'raw-body';
import views from 'koa-views';

const router = Router();

export default class Server {
  PORT = 9000;
  HOST = 'localhost';
  app: Koa;
  authorities: string[];

  constructor(authorities) {
    this.app = new Koa();
    this.authorities = authorities;
  }

  start() {
    onError(this.app);

    this.app.use(views(path.join(__dirname, './view'), {
      extension: 'ejs'
    }))

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
      if (err.code === 'EADDRINUSE') {
        this.PORT = this.PORT + 1;
        this.start();
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
      await ctx.render('index', { authorities: this.authorities });
    });
    router.post('/invoke', async (ctx) => {
      const body = await this.getBody(ctx);
      console.log(body);
      ctx.body = {
        "code": 200,
        "msg": '',
      }
    });
  }
}
