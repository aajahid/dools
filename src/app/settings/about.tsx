import React from "react";

export default class AboutSettings extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props)
    }

    render() {
        return (
            <div className="pluginSettings">
                <h1>About</h1>
                <p>I always wanted some tools in my way. There are obviously way more polished similar tools.</p>
            </div>
        )
    }
}
