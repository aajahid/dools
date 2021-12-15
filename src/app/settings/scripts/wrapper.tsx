import React from "react";
import fs from "fs";
import path from "path";
import {DoolsPlugin} from "../../../types/common";
import scripts from "./screens/scripts";
import { remote } from "electron";

interface Page {
    Id       : string
    Component: React.ComponentClass
}

interface State {
    pages          : Page[]
    activePageIndex: number
}

export default class ScriptsSettingsWrapper extends React.Component<{}, State> {
    NewScriptWindow: any;
    constructor(props: {}) {
        super(props)

        this.state = {
            activePageIndex: 0,
            pages: [
                {Id: "installed", Component: scripts}
            ]
        }
    }

    openNewScriptWindow = () => {
        //let display = screen.getPrimaryDisplay();
        this.NewScriptWindow = this.NewScriptWindow || new remote.BrowserWindow({
            width      : 1000,
            height     : 550,
            frame      : false,
            alwaysOnTop: false,
            webPreferences: {
                enableRemoteModule: true,
                nativeWindowOpen  : true,
                nodeIntegration   : true,
                preload           : path.join(__dirname, 'screens/newScriptWindow/initializeWindow.js'),
            }
        })
        this.NewScriptWindow.focus();
        //this.settingsWindow.setMenu(null);
        this.NewScriptWindow.loadFile('index.html');
        
        this.NewScriptWindow.on("close", ()=>{
            this.NewScriptWindow = null;
        })
        return this.NewScriptWindow;
    }

    render() {
        let ActivePluginScreen = this.state.pages[this.state.activePageIndex].Component;
        return (
            <div className="pluginSettings">
                <div className="titleBar">
                    <div className="title">
                        Scripts
                    </div>
                    <div className="tabs">
                        <ul>
                            <li><button onClick={()=>{this.openNewScriptWindow()}} className="active">New Script</button></li>
                        </ul>
                    </div>
                </div>
                
                <ActivePluginScreen />
            </div>
        )
    }
}
