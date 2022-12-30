import React from "react";
import { Typography, Form, Input } from "@alifd/next";

const { H2 } = Typography;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};
type IProps = {
  field: any;
};

const Other: React.FC<IProps> = ({ field }) => {
  const { init } = field;

  return (
    <Typography>
      <H2>其他信息</H2>
      <Form labelAlign="left" labelTextAlign="left" field={field} {...layout}>
        <Form.Item label="代码仓库信息">
          <Input {...init("codeUrl")} />
        </Form.Item>
        <Form.Item label="项目预览地址">
          <Input {...init("previewUrl")} />
        </Form.Item>
        <Form.Item label="项目注意事项">
          <Input.TextArea {...init("remark")} />
        </Form.Item>
        <Form.Item label="项目免责信息">
          <Input.TextArea {...init("disclaimers")} />
        </Form.Item>
      </Form>
    </Typography>
  );
};

export default Other;
