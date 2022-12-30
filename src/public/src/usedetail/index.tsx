import React from "react";
import Markdown from "src/markdown";

const Usedetail = ({ field }) => {
  return (
    <Markdown
      initdata={field.getValue("usedetail")}
      change={(data) => {
        field.setValue("usedetail", data);
      }}
      submit={() => {
        console.log("usedetail: ", field.getValue("usedetail"));
      }}
    />
  );
};

export default Usedetail;
