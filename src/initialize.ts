import * as ReactDOM from "react-dom";
import App from "./app/index"

window.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        App,
        document.getElementById('content')
    )
});