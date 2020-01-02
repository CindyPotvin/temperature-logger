import React from "react";
import { withTranslation } from "react-i18next";
import SettingsPopup from "./SettingsPopup";
import Weathers from "./Weathers/Weathers";

const App = ({ t, i18n }) => {
  return (
    <div className="App">
      <div className="Banner">
        <h1>{t("App.title")}</h1>
        <SettingsPopup />
        <div className="LanguageBar">
          <a href="#" onClick={() => i18n.changeLanguage("fr")}>
            Français
          </a>
          {"  "}
          <a href="#" onClick={() => i18n.changeLanguage("en")}>
            English
          </a>
        </div>
      </div>
      <Weathers />
    </div>
  );
};

export default withTranslation()(App);
