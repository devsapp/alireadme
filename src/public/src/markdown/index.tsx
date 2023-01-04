import React, { Component } from "react";
import _ from "lodash";
import MarkdownIt from "markdown-it";
import { Input, Message } from "@alifd/next";

const md = MarkdownIt();
const insertStr = (source: string, appendStr: string, start: number) =>
  `${source.slice(0, start) || ""}${appendStr || ""}${
    source.slice(start) || ""
  }`;
const replaceInsertStr = (
  source: string,
  appendStr: string,
  start: number,
  end: number
) => {
  const startStr = source.slice(0, start) || "";
  const endStr = source.slice(end) || "";
  return `${startStr}${appendStr}${endStr}`;
};
const randomString = (len = 32) => {
  const $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const maxPos = $chars.length;
  let randomText = "";
  for (let i = 0; i < len; i++) {
    randomText += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return randomText;
};

class Markdown extends Component<
  { change: (data: string) => void; initdata?: string },
  { data: string; showHtml: string }
> {
  constructor(props) {
    super(props);
    this.state = {
      data: props.initdata || "",
      showHtml: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onPaste = this.onPaste.bind(this);
    this.uploadPhoto = this.uploadPhoto.bind(this);
  }

  onChange(d) {
    this.setState({
      data: d,
      showHtml: md.render(d),
    });
    this.props.change(d);
  }

  syncChange(str: string, needReplace: boolean) {
    let d = str;
    if (needReplace) {
      // @ts-ignore
      const { selectionStart, selectionEnd } =
        document.getElementById("textarea");
      const { data } = this.state;
      if (selectionStart === selectionEnd) {
        d = insertStr(data, str, selectionStart);
      } else {
        d = replaceInsertStr(data, str, selectionStart, selectionEnd);
      }
    }
    this.setState(() => ({
      data: d,
      showHtml: md.render(d),
    }));
    this.props.change(d);
  }

  uploadPhoto(file: string, randomText: string) {
    fetch("/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({ file }),
    })
      .then((response) => response.json())
      .then(({ url, msg }) => {
        if (msg) {
          Message.error(msg);
          throw new Error(msg);
        }
        const d = this.state.data.replace(
          `!()[uploading?${randomText}]`,
          `![](${url})`
        );
        this.syncChange(d, false);
      })
      .catch((ex) => {
        console.error("上传文件错误: ", ex);
        const d = this.state.data.replace(
          `!()[uploading?${randomText}]`,
          `![上传文件失败]()`
        );
        this.syncChange(d, false);
      });
  }

  onPaste(e) {
    e.preventDefault();

    const { items } = e.clipboardData;
    const images: any = [];
    _.each(items, (item) => {
      if (item.type === "text/plain") {
        item.getAsString((d) => {
          this.syncChange(d, true);
        });
      } else if (item.type.includes("image")) {
        images.push(item.getAsFile());
      }
    });

    if (!_.isEmpty(images)) {
      // 上传文件
      images.forEach((blob) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          const base64_str = (event.target as any).result;
          const randomText = randomString(10);
          this.syncChange(`!()[uploading?${randomText}]`, true);
          this.uploadPhoto(base64_str, randomText);
        };

        reader.readAsDataURL(blob);
      });
    }
  }

  render() {
    const { data, showHtml } = this.state;

    return (
      <>
        <div style={{ height: "100%", display: "flex" }}>
          <div style={{ height: "100%", flex: 1, padding: "0 8px" }}>
            <Input.TextArea
              id="textarea"
              className="textarea"
              value={data}
              onChange={this.onChange}
              onPaste={this.onPaste}
            />
          </div>
          <div
            style={{
              width: "50%",
              border: "1px solid #f5f5f5",
              padding: 4,
              overflowY: "scroll",
            }}
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: showHtml }}
          />
        </div>
      </>
    );
  }
}

export default Markdown;
