import React from "react";
import fs from "fs";
import path from "path";
import {DoolsPlugin} from "../../../../types/common";
import electron from "electron";
const remote = electron.remote;

interface State {
}

export default class scripts extends React.Component<{}, State> {
    NewScriptWindow: any;
    constructor(props: {}) {
        super(props)
        this.state = {
        }
    }

    

    render() {
        return (
            <div className="pluginListContainer">
                Script list here
            </div>
        )
    }
}
