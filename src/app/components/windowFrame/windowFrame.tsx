import React from "react";
import {remote} from "electron";

interface State {
    
}

export default class WindowFrame extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {
            
        }
    }

    closeWindow = () => {
        remote.getCurrentWindow().close();
    }

    toggleMaximizeWindow = () => {
        const window = remote.getCurrentWindow();

        if (!window.isMaximized()) {
            window.maximize();          
        } else {
            window.unmaximize();
        }
    }

    minimizeWindow = () => {
        remote.getCurrentWindow().minimize();
    }

    render() {
        return (
            <div className="windowFrame">
                <div className="windowTitleBar">
                    <div className="titleActions">
                        <button className="close" onClick={this.closeWindow} />
                        <button className="minimize" onClick={this.minimizeWindow} />
                        <button className="maximize" onClick={this.toggleMaximizeWindow} />
                    </div>
                </div>
                <div className="windowContent">
                    {this.props.children}
                </div>
            </div>
        )
    }
}
