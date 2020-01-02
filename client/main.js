import React from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";

import App from "./components/App";
import "./i18n";

import "semantic-ui-css/semantic.min.css";
import { dom, library } from "@fortawesome/fontawesome-svg-core";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

import "./main.html";

Meteor.startup(() => {
  // Add only required symbols from fontawesome
  //https://forums.meteor.com/t/fontawesome-5-in-meteor-project/46456/6
  library.add(faCog);
  library.add(faTimes);
  dom.watch();

  ReactDOM.render(<App />, document.querySelector("#root"));
});
