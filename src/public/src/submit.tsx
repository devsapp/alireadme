import React from "react";
import _ from "lodash";
import { Button, Message } from "@alifd/next";

type IProps = {
  field: any;
  selectedKey: string;
};

const Other: React.FC<IProps> = ({ field, selectedKey }) => {
  const onSubmit = () => {
    field.validate((error, values) => {
      const payload: any = {};
      if (selectedKey === "appdetail") {
        payload.appdetail = values.appdetail;
      } else if (selectedKey === "usedetail") {
        payload.usedetail = values.usedetail;
      } else {
        if (error) {
          return;
        }
        delete values.appdetail;
        delete values.usedetail;
        _.merge(payload, values);
      }
      fetch("/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then(({ msg }) => {
          Message.show(msg);
        })
        .catch((ex) => {
          Message.error(ex);
        });
    });
  };

  return (
    <div className="submit">
      <Button onClick={onSubmit} type="primary">
        提交
      </Button>
    </div>
  );
};

export default Other;
