import { BrowserWindow } from "electron";
import React from "react";
import WinndowFrame from "../../../../components/windowFrame/windowFrame"; 


type State = {
}

export default class NewScriptScreen extends React.Component<{}, State> {

    private settingsWindow : null | BrowserWindow = null;

    constructor(props: {}) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <WinndowFrame>
                <h1>Hello</h1>
            </WinndowFrame>
        )
    }
}