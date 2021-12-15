import React from "react";
import * as ReactDOM from "react-dom";
import App from "./app/index"

window.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        React.createElement(App, null),
        document.getElementById('content')
    )
});