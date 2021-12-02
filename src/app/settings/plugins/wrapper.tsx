import React from "react";
import fs from "fs";
import path from "path";
import {DoolsPlugin} from "../../../types/common";
import installedPlugin from "./screens/installed";

interface Page {
    Id       : string
    Component: React.ComponentClass
}

interface State {
    pages          : Page[]
    activePageIndex: number
}

export default class PluginSettingsWrapper extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)

        this.state = {
            activePageIndex: 0,
            pages: [
                {Id: "installed", Component: installedPlugin}
            ]
        }
    }

    render() {
        let ActivePluginScreen = this.state.pages[this.state.activePageIndex].Component;
        return (
            <div className="pluginSettings">
                <div className="titleBar">
                    <div className="title">
                        Plugins
                    </div>
                    <div className="tabs">
                        <ul>
                            <li><button className={this.state.activePageIndex==0 ? "active": ""}>Installed</button></li>
                            <li><button>Search</button></li>
                        </ul>
                    </div>
                </div>
                
                <ActivePluginScreen />
            </div>
        )
    }
}
