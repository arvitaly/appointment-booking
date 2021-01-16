import ReactDOM from "react-dom";
import React from "react";
import App from "./App";
import { IDtoPageData } from "./dto";
import { readDataFromElement } from "./util/dto";

const data: IDtoPageData = readDataFromElement("__PAGE__DATA__");

ReactDOM.render(<App data={data} />, document.getElementById("root"));
