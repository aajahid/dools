import React from "react";
import * as ReactDOM from "react-dom";
import NewScriptScreen from "./index"

window.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        React.createElement(NewScriptScreen, null),
        document.getElementById('content')
    )
});