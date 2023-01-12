import React from "react";
import _ from "lodash";
import { Typography, Input, Select, Button, Form, Grid } from "@alifd/next";

const { H2, Text } = Typography;
const { Row, Col } = Grid;

type IProps = {
  field: any;
};

const Service: React.FC<IProps> = ({ field }) => {
  const serverData = field.getValue("service") || [];
  const endIndex = serverData.length - 1;

  const onChange = (index: number) => {
    // 保证后面有一个空行
    if (endIndex === index) {
      field.addArrayValue("service", endIndex + 1, {});
    }
  };

  if (_.isEmpty(serverData)) {
    serverData.push({});
  }

  return (
    <Typography>
      <H2>所需要的前置服务</H2>
      <Text>在应用部署之前给用户的提示信息</Text>
      <Form field={field}>
        <Row
          gutter={16}
          style={{
            padding: "8px 16px",
            backgroundColor: "#eaebef",
            margin: "16px 0",
          }}
        >
          <Col span="10">服务名称</Col>
          <Col span="10">为什么需要该服务</Col>
          <Col span="4">操作</Col>
        </Row>
        {serverData.map((item, index) => {
          return (
            <Row
              gutter={16}
              style={{ borderBottom: "1px solid #eaebef", marginBottom: 16 }}
            >
              <Col span="10">
                <Form.Item>
                  <Select
                    dataSource={_.get(window, "SERVICES")}
                    style={{ width: "100%" }}
                    {...field.init(`service.${index}.name`, {
                      initValue: item.name,
                      rules: [{ required: endIndex !== index }],
                      getValueFormatter: (data) => {
                        onChange(index);
                        return data;
                      },
                    })}
                  />
                </Form.Item>
              </Col>
              <Col span="10">
                <Form.Item>
                  <Input
                    style={{ width: "100%" }}
                    {...field.init(`service.${index}.description`, {
                      initValue: item.description,
                      rules: [{ required: endIndex !== index }],
                      getValueFormatter: (data) => {
                        onChange(index);
                        return data;
                      },
                    })}
                  />
                </Form.Item>
              </Col>
              <Col span="4">
                <Button
                  onClick={() => {
                    field.deleteArrayValue("service", index);
                  }}
                  type="primary"
                  disabled={endIndex === index}
                  text
                >
                  删除
                </Button>
              </Col>
            </Row>
          );
        })}
      </Form>
    </Typography>
  );
};

export default Service;
