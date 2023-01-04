import React from "react";
import Markdown from "src/markdown";

const Appdetail = ({ field }) => {
  return (
    <Markdown
      initdata={field.getValue("appdetail")}
      change={(data) => {
        field.setValue("appdetail", data);
      }}
    />
  );
};

export default Appdetail;
