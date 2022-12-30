import React from "react";
import { Form } from "@alifd/next";
import Authorities from "./auth";
import Service from "./service";
import Other from "./other";

const Guide: React.FC<{ field: any }> = ({ field }) => {
  return (
    <Form field={field} name="guide">
      <Authorities field={field} />
      <Service field={field} />
      <Other field={field} />
    </Form>
  );
};

export default Guide;
