import React, { useState } from "react";
import { Box, Nav, Field } from "@alifd/next";
import Guide from "./guide";
import Appdetail from "./appdetail";
import Usedetail from "./usedetail";
import Submit from "./submit";

const menus = [
  {
    key: "guide",
    label: "引导配置",
  },
  {
    key: "appdetail",
    label: "帮助文档",
  },
  {
    key: "usedetail",
    label: "使用文档/后续操作",
  },
];

const App = () => {
  const [selectedKey, setSelectedKey] = useState(menus[0].key);
  const field = Field.useField({
    parseName: true,
    autoUnmount: false,
    // @ts-ignore
    values: window.values || [],
  });

  const nodes = {
    [menus[0].key]: <Guide field={field} />,
    [menus[1].key]: <Appdetail field={field} />,
    [menus[2].key]: <Usedetail field={field} />,
  };

  return (
    <Box direction="row" style={{ height: "100vh" }}>
      <div style={{ width: 188, padding: "0 6px" }}>
        <Nav
          style={{ height: "100%" }}
          mode="inline"
          defaultSelectedKeys={[menus[0].key]}
          onItemClick={(key) => setSelectedKey(key)}
        >
          {menus.map((item) => (
            <Nav.Item key={item.key}>{item.label}</Nav.Item>
          ))}
        </Nav>
      </div>
      <div
        style={{
          flex: 1,
          padding: "16px 12px 64px",
          overflowY: "scroll",
          position: "relative",
        }}
      >
        {nodes[selectedKey]}
        <Submit field={field} selectedKey={selectedKey} />
      </div>
    </Box>
  );
};

export default App;
