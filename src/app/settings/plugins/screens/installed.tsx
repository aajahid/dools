import React from "react";
import fs from "fs";
import path from "path";
import {DoolsPlugin} from "../../../../types/common";
import electron from "electron";
const remote = electron.remote;

interface State {
    plugins: DoolsPlugin[]
    windowHeight: number
}

export default class installedPlugin extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)
        const plugin = this.fetchPluginsByPath()
        this.state = {
            plugins: plugin,
            windowHeight: 0
        }
    }

    componentDidMount() {
        this.watchWindowSize();
        window.addEventListener('resize', this.watchWindowSize, false);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.watchWindowSize, false);
    }

    private watchWindowSize = () => {
        var size   = remote.getCurrentWindow().getBounds();
        this.setState({windowHeight: size.height});
    }

    private fetchPluginsByPath() : DoolsPlugin[] {
        const fullPath                 = path.join(__dirname, '../../../../plugins/')
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
        let plugins = this.state.plugins.map((plugin,key) => 
            <li key={key}>
                <div>{plugin.name}</div>
                <div>{plugin.author}</div>
                <div>{plugin.description}</div>
            </li>)
        return (
            <div className="pluginListContainer" style={{"height": this.state.windowHeight-200}}>
                <div className="scrollView">
                    <ul>
                        {plugins}
                    </ul>
                </div>
            </div>
        )
    }
}
