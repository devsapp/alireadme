import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@alifd/next/dist/next.css";
import "github-markdown-css/github-markdown.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as Element);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
