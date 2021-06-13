import { BrowserWindow, shell, remote } from "electron";

import React, { ChangeEvent } from "react";
import { ProgramIcon, Programs } from "../types/common";
import path from "path";
import fs from "fs";
import child from "child_process";

type State = {
    programs           : Programs[],
    results            : Programs[],
    resultIcons        : ProgramIcon[],
    searchQuery        : string,
    selectedResultIndex: number
}

export default class dools extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);

        this.state = {
            programs           : this.fetchPrograms(),
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

    setSearchText(event: ChangeEvent<HTMLInputElement>) {
        const numberOfResults = 10;
        const query           = event.target.value.toLowerCase();
        const results         = this.state.programs.filter(program => program.filename.toLowerCase().indexOf(query) >= 0).slice(0, numberOfResults);
        
        results.map((result, resultIndex) => {
            try {
                remote.app.getFileIcon(result.shortcutDetails.target, { size: 'normal' }).then(nativeImageIcon => {
                    const resultIcons = 
                        this.state.resultIcons.map((icon, key) =>
                            key==resultIndex ? nativeImageIcon.toDataURL() : icon);
                    this.setState({resultIcons})
                })
            } catch(e) {
                return null;
            }
        })
        this.setState({searchQuery: query, results: results, resultIcons: results.map(i=>null)})
    }

    runApp(appPath: string) {
        this.setState({searchQuery: ""});
        remote.getCurrentWindow().hide();
        child.execFile(appPath, function(err, data) {
            if(err){
               console.error(err);
               return;
            } 
        });
    }

    componentDidMount() {
        document.getElementsByTagName("body")[0].addEventListener('keydown', (e) => {
            console.log(e);

            if (!e.repeat)
                if (e.code === "Enter")  {
                    this.runApp(this.state.results[this.state.selectedResultIndex].shortcutDetails.target);
                } else if (e.code === "ArrowDown" || e.code === "ArrowUp") {
                    const resultCount = this.state.results.length;
                    const selectedIndex = this.state.selectedResultIndex;
                     
                    const nextIndex = e.code === "ArrowDown" ? 
                        (resultCount > selectedIndex ? selectedIndex + 1 : 0) : 
                        (selectedIndex == 0 ? resultCount - 1 : selectedIndex - 1)
                        
                    this.setState({selectedResultIndex: nextIndex});
                }
          });
    }

    render() {
        const files = this.state.results.map( (result, key) => {
            const programIcon = this.state.resultIcons[key] ? 
                <img src={"data:" + this.state.resultIcons[key]} /> : null;

            return (
                <li key={key} className={this.state.selectedResultIndex == key ? "selected" : ""} onClick={()=>{this.runApp(result.shortcutDetails.target)}}>
                    {programIcon}
                    {result.filename}
                </li>
            )
        });

        var results = this.state.searchQuery.length > 0 ? 
            (<div className="results">
                <ul>
                    {files}
                </ul>
            </div>) : null;

        return (
        <>
            <div id="search">
                <div className="icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512.005 512.005">
                        <path d="M505.749 475.587l-145.6-145.6c28.203-34.837 45.184-79.104 45.184-127.317C405.333 90.926 314.41.003 202.666.003S0 90.925 0 202.669s90.923 202.667 202.667 202.667c48.213 0 92.48-16.981 127.317-45.184l145.6 145.6c4.16 4.16 9.621 6.251 15.083 6.251s10.923-2.091 15.083-6.251c8.341-8.341 8.341-21.824-.001-30.165zM202.667 362.669c-88.235 0-160-71.765-160-160s71.765-160 160-160 160 71.765 160 160-71.766 160-160 160z" />
                    </svg>
                </div>
                <input id="searchInput" value={this.state.searchQuery} onChange={this.setSearchText.bind(this)} type="text" placeholder="Search" autoFocus={true} />    
            </div>
            {results}
        </>
        )
    }
}