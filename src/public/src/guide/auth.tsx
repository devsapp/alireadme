import React from "react";
import _ from "lodash";
import { Typography, Grid, Input, Form } from "@alifd/next";

const { H2, Text } = Typography;
const { Row, Col } = Grid;
type IProps = {
  field: any;
};

const Authorities: React.FC<IProps> = ({ field }) => {
  const authorities = field.getValue("auth");
  if (_.isEmpty(authorities)) {
    return <></>;
  }

  return (
    <Typography>
      <H2>当前应用所需权限</H2>
      <Text>可以在publish.yaml中修改具体所需权限</Text>
      <Form field={field}>
        <Row
          gutter={16}
          style={{
            padding: "8px 16px",
            backgroundColor: "#eaebef",
            margin: "16px 0",
          }}
        >
          <Col span="10">权限名称</Col>
          <Col span="10">为什么需要该权限</Col>
        </Row>
        {authorities.map((item, index) => {
          return (
            <Row
              gutter={16}
              style={{
                borderBottom: "1px solid #eaebef",
                margin: "0 0 16px 0",
              }}
            >
              <Col span="10">
                <Form.Item>
                  <Text style={{ marginLeft: 16 }}>{item.name}</Text>
                </Form.Item>
              </Col>
              <Col span="10">
                <Form.Item>
                  <Input
                    style={{ width: "100%" }}
                    {...field.init(`auth.${index}.description`, {
                      initValue: item.description,
                      rules: [{ required: true }],
                    })}
                  />
                </Form.Item>
              </Col>
            </Row>
          );
        })}
      </Form>
    </Typography>
  );
};

export default Authorities;
