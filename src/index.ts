import { lodash as _, fse, jsyaml } from '@serverless-devs/core';
import path from 'path';
import Server from './server';
import logger from "./common/logger";

export default class ComponentDemo {
  /**
   * demo 实例
   * @param inputs
   * @returns
   */
  public async run() {
    const baseDir = process.cwd();
    logger.debug(`base dir: ${baseDir}`);
    const filePath = this.getFilePath(baseDir);
    logger.debug(`file path: ${filePath}`);

    const payload = jsyaml.load(fse.readFileSync(filePath));
    const authorities = this.getAuthorities(payload);
    logger.debug(`authorities is: ${authorities}`);

    const server = new Server(authorities);
    server.start();
  }

  private getFilePath(baseDir: string): string {
    const yamlFilePath = path.join(baseDir, 'publish.yaml');
    if (fse.pathExistsSync(yamlFilePath)) {
      return yamlFilePath;
    }
    const ymlFilePath = path.join(baseDir, 'publish.yml');
    if (fse.pathExistsSync(ymlFilePath)) {
      return ymlFilePath;
    }

    throw new Error(`${yamlFilePath} is not a valid yaml file`);
  }

  private getAuthorities(payload: Record<string, any>): string[] {
    const authorities = [];
    const service = _.get(payload, 'Service', {});
    _.each(service, element => {
      const auth = _.get(element, 'Authorities');
      if (!_.isEmpty(auth)) {
        authorities.push(...auth);
      }
    });
    return authorities;
  }
}
