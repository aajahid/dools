import React from "react";
import * as ReactDOM from "react-dom";
import SettingsPage from "./settings"

window.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        React.createElement(SettingsPage, null),
        document.getElementById('content')
    )
});