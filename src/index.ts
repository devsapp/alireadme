import { lodash as _ } from '@serverless-devs/core';
import Server from './server';
export default class ComponentDemo {
  public run() {
    const server = new Server();
    server.start();
  }

  public index() {
    this.run();
  }
}
