import path from "path";
import { fse } from '@serverless-devs/core';
import logger from '../common/logger';

const stencil = `
> 注：当前项目为 Serverless Devs 应用，由于应用中会存在需要初始化才可运行的变量（例如应用部署地区、服务名、函数名等等），所以**不推荐**直接 Clone 本仓库到本地进行部署或直接复制 s.yaml 使用，**强烈推荐**通过 \`s init \` 的方法或应用中心进行初始化，详情可参考[部署 & 体验](#部署--体验) 。

# {{appName}} 帮助文档
<p align="center" class="flex justify-center">
    <a href="https://www.serverless-devs.com" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package={{appName}}&type=packageType">
  </a>
  <a href="http://www.devsapp.cn/details.html?name={{appName}}" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package={{appName}}&type=packageVersion">
  </a>
  <a href="http://www.devsapp.cn/details.html?name={{appName}}" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package={{appName}}&type=packageDownload">
  </a>
</p>

<description>
</description>

<codeUrl>
</codeUrl>
<preview>
</preview>


## 前期准备

使用该项目，您需要有开通以下服务：

<service>
</service>

推荐您拥有以下的产品权限 / 策略：
<auth>
</auth>

<remark>
</remark>

<disclaimers>
</disclaimers>

## 部署 & 体验

<appcenter>

- :fire: 通过 [Serverless 应用中心](https://fcnext.console.aliyun.com/applications/create?template={{appName}}) ，
  [![Deploy with Severless Devs](https://img.alicdn.com/imgextra/i1/O1CN01w5RFbX1v45s8TIXPz_!!6000000006118-55-tps-95-28.svg)](https://fcnext.console.aliyun.com/applications/create?template={{appName}}) 该应用。
</appcenter>
<deploy>
- 通过 [Serverless Devs Cli](https://www.serverless-devs.com/serverless-devs/install) 进行部署：
  - [安装 Serverless Devs Cli 开发者工具](https://www.serverless-devs.com/serverless-devs/install) ，并进行[授权信息配置](https://docs.serverless-devs.com/fc/config) ；
  - 初始化项目：\`s init {{appName}} -d {{appName}} \`
  - 进入项目，并进行项目部署：\`cd {{appName}} && s deploy - y\`
</deploy>

## 应用详情

<appdetail id="flushContent">
</appdetail>

## 使用文档

<usedetail id="flushContent">
</usedetail>


<devgroup>
## 开发者社区

您如果有关于错误的反馈或者未来的期待，您可以在 [Serverless Devs repo Issues](https://github.com/serverless-devs/serverless-devs/issues) 中进行反馈和交流。如果您想要加入我们的讨论组或者了解 FC 组件的最新动态，您可以通过以下渠道进行：

<p align="center">  

| <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407298906_20211028074819117230.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407044136_20211028074404326599.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407252200_20211028074732517533.png" width="130px" > |
| --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| <center>微信公众号：\`serverless\`</center>                                                                                         | <center>微信小助手：\`xiaojiangwh\`</center>                                                                                        | <center>钉钉交流群：\`33947367\`</center>                                                                                           |
</p>
</devgroup>
`;

const replaceTag = (source: string, appendStr: string, tagName: string) => {
  const startTag = `<${tagName}>`;
  const endTag = `</${tagName}>`;
  const start = source.indexOf(startTag);
  const end = source.indexOf(endTag);
  if (start === -1 && end === -1) {
    logger.debug(`没有找到 tag: ${tagName}`);
    return source;
  }
  if (start === -1) {
    const startStr = source.slice(0, end) || "";
    const endStr = source.slice(end) || "";
    return `${startStr}\n\n${startTag}\n\n${appendStr}\n${endStr}`;
  } else if (end === -1) {
    const startStr = source.slice(0, start + startTag.length) || "";
    const endStr = source.slice(start + startTag.length) || "";
    return `${startStr}\n\n${appendStr}\n\n${endTag}\n${endStr}`;
  }

  const startStr = source.slice(0, start + startTag.length) || "";
  const endStr = source.slice(end) || "";
  return `${startStr}\n\n${appendStr}\n\n${endStr}`;
}

const trimTag = (source: string, tagName: string) => {
  const startTag = `<${tagName}>`;
  const endTag = `</${tagName}>`;
  const start = source.indexOf(startTag);
  const end = source.indexOf(endTag);
  if (start === -1 || end === -1) {
    logger.debug(`没有找到 tag: ${tagName}`);
    return '';
  }

  return source.slice(start + startTag.length, end).trim();
}

export const getReadmePath = () => path.join(process.cwd(), 'readme.md');

const getStencil = () => {
  const filePath = getReadmePath();
  if (!fse.existsSync(filePath)) {
    return '';
  }

  return fse.readFileSync(filePath, 'utf8');
}

export const genReadmeStr = (data: Record<string, any>) => {
  logger.info(`genReadmeStr data: ${JSON.stringify(data)}`);
  const {
    appName,
    appDescription,
    codeUrl,
    previewUrl,
    service,
    auth,
    remark,
    disclaimers,
    appdetail,
    usedetail,
  } = data;
  let endData = stencil; // 获取模版

  // 应用名称
  if (appName) {
    endData = endData.replace(/{{appName}}/g, appName);
  }

  // 应用描述
  if (appDescription) {
    endData = replaceTag(endData, appDescription, 'description');
  }

  // 所需要的前置服务
  if (service) {
    const str = `\n\n| 服务 |  备注  |
| --- |  --- |
${service.filter(item => item?.name).map(item => `| ${item.name} |  ${item.description} |`).join('\n')}`;

    endData = replaceTag(endData, str, 'service');
  }

  // 当前应用所需权限
  if (auth) {
    const str = `\n\n| 服务/业务 |  权限 |  备注  |
| --- |  --- |   --- |
${auth.map(item => `| ${item.service} | ${item.name} |  ${item.description} |`).join('\n')}`;

    endData = replaceTag(endData, str, 'auth');
  }

  // 帮助文档
  if (appdetail) {
    endData = replaceTag(endData, appdetail, 'appdetail');
  }

  // 使用文档/后续操作
  if (usedetail) {
    endData = replaceTag(endData, usedetail, 'usedetail');
  }

  // 项目注意事项
  if (remark) {
    endData = replaceTag(endData, `您还需要注意：   \n${remark}`, 'remark');
  } else {
    endData = replaceTag(endData, '', 'remark');
  }
  // 项目免责信息
  if (disclaimers) {
    endData = replaceTag(endData, `免责声明：   \n${disclaimers}`, 'disclaimers');
  } else {
    endData = replaceTag(endData, '', 'disclaimers');
  }
  // 代码仓库信息
  if (codeUrl) {
    endData = replaceTag(endData, `- [:smiley_cat: 代码](${codeUrl})`, 'codeUrl');
  } else {
    endData = replaceTag(endData, '', 'codeUrl');
  }
  // 项目预览地址
  if (previewUrl) {
    endData = replaceTag(endData, `- [:eyes: 预览](${previewUrl})`, 'preview');
  } else {
    endData = replaceTag(endData, '', 'preview');
  }

  return endData;
}

export const parseReadme = () => {
  const readmeStr = getStencil();
  if (!readmeStr) {
    return {};
  }
  const data: any = {};

  // 所需要的前置服务
  const serviceStr = trimTag(readmeStr, 'service');
  if (serviceStr) {
    const d = serviceStr.split('\n').map(item => {
      const str = item.trim();
      // 必须保证 | ** | ** |  才允许处理
      if (str.startsWith('| ') && str.endsWith(' |')) {
        const [, name, description] = str.split('|');
        return { name: name.trim(), description: description.trim() };
      }
      return;
    }).filter(item => item);
    d.shift();
    d.shift();
    data.service = d;
  }

  // 当前应用所需权限
  const authStr = trimTag(readmeStr, 'auth');
  if (authStr) {
    const d = authStr.split('\n').map(item => {
      const str = item.trim();
      if (str.startsWith('| ') && str.endsWith(' |')) {
        const [, service, name, description] = str.split('|');
        return { service: service.trim(), name: name.trim(), description: description.trim() };
      }
      return;
    }).filter(item => item);
    d.shift();
    d.shift();
    data.auth = d;
  }

  // 帮助文档
  const appdetailStr = trimTag(readmeStr, 'appdetail');
  if (appdetailStr) {
    data.appdetail = appdetailStr;
  }

  // 使用文档/后续操作
  const usedetailStr = trimTag(readmeStr, 'usedetail');
  if (usedetailStr) {
    data.usedetail = usedetailStr;
  }

  // 项目注意事项
  const remarkStr = trimTag(readmeStr, 'remark');
  if (remarkStr) {
    data.remark = remarkStr.replace('您还需要注意：   \n', '');
  }

  // 项目免责信息
  const disclaimersStr = trimTag(readmeStr, 'disclaimers');
  if (disclaimersStr) {
    data.disclaimers = disclaimersStr.replace('免责声明：   \n', '');
  }

  // 代码仓库信息
  const codeUrlStr = trimTag(readmeStr, 'codeUrl');
  if (codeUrlStr) {
    const codeUrlMatch = codeUrlStr.match(/- \[:smiley_cat: 代码\]\((.+)\)/);
    if (codeUrlMatch && codeUrlMatch[1]) {
      data.codeUrl = codeUrlMatch[1];
    }
  }
  // 项目预览地址
  const previewUrlStr = trimTag(readmeStr, 'preview');
  if (previewUrlStr) {
    const previewUrlMatch = previewUrlStr.match(/- \[:eyes: 预览\]\((.+)\)/);
    if (previewUrlMatch && previewUrlMatch[1]) {
      data.previewUrl = previewUrlMatch[1];
    }
  }
  logger.info(`parse readme: ${JSON.stringify(data)}`);
  return data;
}
