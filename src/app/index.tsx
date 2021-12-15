import { shell, remote, screen, BrowserWindow } from "electron";

import React, { ChangeEvent } from "react";
import { ProgramIcon, Programs, DoolsPlugin } from "../types/common";
import path from "path";
import fs from "fs";
import child from "child_process";

type State = {
    programs           : Programs[];
    plugins            : DoolsPlugin[];
    activePlugin       : DoolsPlugin | null;
    results            : Programs[];
    resultIcons        : ProgramIcon[];
    searchQuery        : string;
    selectedResultIndex: number;
}

export default class dools extends React.Component<{}, State> {

    private settingsWindow : null | BrowserWindow = null;

    constructor(props: {}) {
        super(props);
        this.state = {
            programs           : this.fetchPrograms(),
            plugins            : this.fetchPluginsByPath(),
            activePlugin       : null,
            results            : [],
            resultIcons        : [],
            searchQuery        : "",
            selectedResultIndex: 0
        }
    }

    private fetchPrograms() {
        const windowsStartMenuPath: string = "/Microsoft/Windows/Start Menu/Programs"
        const userPrograms: Programs[]     = this.fetchProgramsByPath(path.normalize(process.env.APPDATA + windowsStartMenuPath));
        const systemPrograms: Programs[]   = this.fetchProgramsByPath(path.normalize(process.env.ALLUSERSPROFILE + windowsStartMenuPath));
    
        return userPrograms.concat(systemPrograms);
    }

    private fetchPluginsByPath() : DoolsPlugin[] {
        const fullPath                 = path.join(__dirname, '../plugins/')
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
    
    private fetchProgramsByPath(fullPath: string) : Programs[] {
        const windowsShortcutFileExt   = ".lnk";
        const fileAndFolders: string[] = fs.readdirSync(fullPath);

        return fileAndFolders.flatMap( item => {
            const fullItemPath = path.normalize(fullPath + "/" + item);
            const itemStats    = fs.statSync(fullItemPath);
    
            if(itemStats.isFile() && path.extname(item) === windowsShortcutFileExt) {
                try {
                    return {
                        filename       : path.parse(item).name,
                        shortcutDetails: shell.readShortcutLink(fullItemPath)
                    }
                } catch (e) {
                    console.log(e);
                    return [];
                }
            } else if(itemStats.isDirectory()) {
                return this.fetchProgramsByPath(fullPath + "/" + item);
            }
            return [];
        });
    }

    searchPrograms(query: string) {
        const numberOfResults = 10;
        const results         = this.state.programs.filter(program => 
            program.filename.toLowerCase().indexOf(query) >= 0)
            .slice(0, numberOfResults);

        results.forEach((result, resultIndex) => {
            try {
                const iconTarget = result.shortcutDetails.icon ? result.shortcutDetails.icon : result.shortcutDetails.target;
                remote.app.getFileIcon(iconTarget, { size: 'large' }).then(nativeImageIcon => {
                    const resultIcons = 
                        this.state.resultIcons.map((icon, key) =>
                            key==resultIndex ? nativeImageIcon.toDataURL() : icon);
                    this.setState({resultIcons})
                })
            } catch(e) {
               
            }
        })

        this.setState({
            results: results, 
            activePlugin: null, 
            resultIcons: results.map(i=>null)})
    }

    private isPluginQuery(query: string): boolean {
        return query.indexOf(":") > 0
    }

    private tryGetPlugin(query: string): DoolsPlugin | undefined {
        return this.state.plugins.find(plugin =>
            plugin.key.indexOf(query.split(":")[0]) >= 0
        )
    }

    setSearchText(event: ChangeEvent<HTMLInputElement>) {
        const rawQuery = event.target.value;
        const query    = rawQuery.toLowerCase().trim();
        this.setState({searchQuery: rawQuery})

        if( this.isPluginQuery(query) ) {
            const maybePlugin = this.tryGetPlugin(query);
            if( maybePlugin ) {
                this.setState({activePlugin: maybePlugin});
            }
        } else {
            this.searchPrograms(query);
        }
    }

    runApp(appPath: string, args: string | undefined) {
        this.setState({searchQuery: ""});
        remote.getCurrentWindow().hide();
        child.execFile(appPath, args? [args] : null,function(err, data) {
            if(err){
               console.error(err);
               return;
            } 
        });
    }

    
    openSettings = () => {
        //let display = screen.getPrimaryDisplay();
        this.settingsWindow = this.settingsWindow || new remote.BrowserWindow({
            width      : 1000,
            height     : 550,
            frame      : false,
            alwaysOnTop: true,
            webPreferences: {
                enableRemoteModule: true,
                nativeWindowOpen  : true,
                nodeIntegration   : true,
                preload           : path.join(__dirname, 'settings/initializeWindow.js'),
            }
        })
        this.settingsWindow.focus();
        //this.settingsWindow.setMenu(null);
        this.settingsWindow.loadFile('index.html');
        
        this.settingsWindow.on("close", ()=>{
            this.settingsWindow = null;
        })
        return this.settingsWindow;
    }

    componentDidMount() {
        document.getElementsByTagName("body")[0].addEventListener('keydown', (e) => {
            if (!e.repeat)
                if (e.code === "Enter")  {
                    const shortCutDetails = this.state.results[this.state.selectedResultIndex].shortcutDetails;
                    this.runApp(shortCutDetails.target, shortCutDetails.args);
                } else if (e.code === "ArrowDown" || e.code === "ArrowUp") {
                    e.preventDefault();
                    const resultCount = this.state.results.length;
                    const selectedIndex = this.state.selectedResultIndex;
                     
                    const nextIndex = e.code === "ArrowDown" ? 
                        (resultCount > selectedIndex + 1 ? selectedIndex + 1 : 0) : 
                        (selectedIndex == 0 ? resultCount - 1 : selectedIndex - 1)
                        
                    this.setState({selectedResultIndex: nextIndex});
                }
          });
    }

    render() {
        const files = this.state.results.map( (result, key) => {
            const programIcon     = this.state.resultIcons[key];
            const programIconHtml = programIcon ? <img src={ programIcon } /> : null;

            return (
                <li 
                 key={key} 
                 className={this.state.selectedResultIndex == key ? "selected" : ""} 
                 onClick={()=>{
                    this.runApp(result.shortcutDetails.target, result.shortcutDetails.args)}
                }>
                    {programIconHtml}
                    <div className="resultItemDetails">
                        <div className="name">{result.filename}</div>
                        <div className="description">{result.shortcutDetails.description}</div>
                    </div>
                </li>
            )
        });

        var results = this.state.searchQuery.length > 0 ? 
            (<div className="results">
                <ul>
                    {files}
                </ul>
            </div>) : null;
        
        var Plugin = this.state.activePlugin ? require("../plugins/" + this.state.activePlugin.key + "/index").default : null;

        return (
        <>
            <div id="search">
                <div className="icon" onClick={this.openSettings}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512.005 512.005">
                        <path d="M505.749 475.587l-145.6-145.6c28.203-34.837 45.184-79.104 45.184-127.317C405.333 90.926 314.41.003 202.666.003S0 90.925 0 202.669s90.923 202.667 202.667 202.667c48.213 0 92.48-16.981 127.317-45.184l145.6 145.6c4.16 4.16 9.621 6.251 15.083 6.251s10.923-2.091 15.083-6.251c8.341-8.341 8.341-21.824-.001-30.165zM202.667 362.669c-88.235 0-160-71.765-160-160s71.765-160 160-160 160 71.765 160 160-71.766 160-160 160z" />
                    </svg>
                </div>
                <input id="searchInput" value={this.state.searchQuery} onChange={this.setSearchText.bind(this)} type="text" placeholder="Search" autoFocus={true} />    
            </div>
            {results}
            {this.state.activePlugin ? <Plugin query={this.state.searchQuery.split(":")[1]} /> : null}
        </>
        )
    }
}