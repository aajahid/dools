import React from "react";
import fs from "fs";
import path from "path";
import {DoolsPlugin} from "../../types/common";

interface State {
    plugins: DoolsPlugin[]
}

export default class PluginSettings extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)
        const plugin = this.fetchPluginsByPath()
        this.state = {
            plugins: plugin
        }
    }

    private fetchPluginsByPath() : DoolsPlugin[] {
        const fullPath                 = path.join(__dirname, '../../plugins/')
        const fileAndFolders: string[] = fs.readdirSync(fullPath);

        return fileAndFolders.map( item => {
            const fullItemPath         = path.normalize(fullPath + "/" + item);
            const itemStats            = fs.statSync(fullItemPath);
            const pluginConfigFilePath = path.normalize(fullItemPath + "/plugin.json");
    
            if(itemStats.isDirectory() && fs.existsSync(pluginConfigFilePath)) {
                return require(pluginConfigFilePath)
            }
            return {};
        });
    }

    render() {
        const plugins = this.state.plugins.map((plugin,key) => 
            <li key={key}>
                <div>{plugin.name}</div>
                <div>{plugin.author}</div>
                <div>{plugin.description}</div>
            </li>)
        return (
            <div className="pluginSettings">
                <h1>Plugins</h1>
                <ul>
                    {plugins}
                </ul>
            </div>
        )
    }
}
