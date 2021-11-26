import React from "react";
import { PluginProps } from "../../types/common";
import crypto from "crypto";

interface State {
    hashResult: string;
}

export default class hashPlugin extends React.Component<PluginProps, State> {
    constructor(props: PluginProps) {
        super(props);
        
        this.state = {
            hashResult: ""
        }
    }

    componentDidUpdate(prevProps: PluginProps) {
        if( prevProps.query != this.props.query ) {
            const regexMatch   = /^(md5|sha1) ("|')(.+)("|')/gm.exec(this.props.query.trim());
            const hashAlgo     = regexMatch && regexMatch[1] ? regexMatch[1] : null;
            const stringToHash = regexMatch && regexMatch[3] ? regexMatch[3] : null;
            
            const hashResult = hashAlgo && stringToHash ? 
                crypto.createHash(hashAlgo).update(stringToHash).digest("hex") : "";

            this.setState({hashResult: hashResult});
        } 
    }

    render() {
        const generalPluginUi = (
        <ul>
            <li>Md4</li>
            <li>Md5</li>
        </ul>
        );

        const hashResult = <div className="hashResult"><p>{this.state.hashResult}</p></div>;
        const content    = this.state.hashResult.length > 0 ? hashResult : generalPluginUi; 

        return (
            <div className="hashContent">
                {content}
            </div>
        )
    }
}