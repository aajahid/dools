import React from "react";
import WinndowFrame from "../components/windowFrame/windowFrame"; 
import PluginSettings from "./plugins";
import AboutSettings from "./about";

type Pages = {
    Name     : string;
    Component: React.ComponentClass
}

interface State {
    pages     : Pages[];
    activePage: number;
}

export default class Settings extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {
            activePage: 0,
            pages: [
                {
                    Name     : "Plugins",
                    Component: PluginSettings
                },
                {
                    Name     : "About",
                    Component: AboutSettings
                }
            ]
        }
    }

    navigate(pageKey: number) {
        this.setState({activePage: pageKey});
    }

    render() {

        let menu = this.state.pages.map((page, key)=><li className={this.state.activePage == key ? "active" : ""}><button onClick={()=>this.navigate(key)}>{page.Name}</button></li>)
        let ActivePage = this.state.pages[this.state.activePage].Component
        return (
            <WinndowFrame>
                <div className="settings">
                    <div className="settingsMenu">
                        <ul>
                            {menu}
                        </ul>
                    </div>
                    <div className="settingsContent">
                        <ActivePage />
                    </div>
                </div>
            </WinndowFrame>
        )
    }
}
