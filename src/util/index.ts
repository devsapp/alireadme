import { lodash as _, fse, jsyaml } from '@serverless-devs/core';
import path from 'path';
import { parseReadme } from './stencil';

const getPublishFilePath = (baseDir: string): string => {
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

export const getPublishValue = () => {
  const publishFilePath = getPublishFilePath(process.cwd());
  console.log('publish file path: ', publishFilePath);
  return jsyaml.load(fse.readFileSync(publishFilePath, 'utf8'))
}


export const getInitValues = (): Record<string, any> => {
  const values = _.defaults(parseReadme(), {
    codeUrl: '',
    previewUrl: '',
    service: [],
    auth: [],
    remark: '',
    disclaimers: '',
    appdetail: '',
    usedetail: '',
  });
  const readmeAuth = values.auth;

  const payload = getPublishValue();
  const auth = [];
  const service = _.get(payload, 'Service', {});
  _.each(service, (element, key) => {
    const authorities = _.get(element, 'Authorities');
    if (!_.isEmpty(authorities)) {
      auth.push(...authorities.map(name => {
        const description = _.get(_.findLast(readmeAuth, (item) => item.name === name), 'description', '');

        return ({
          service: key,
          name,
          description,
        });
      }));
    }
  });

  values.auth = auth;
  console.log(values);
  return values;
}





