import React from 'react';
import fs from './fscreen';

export default class FullScreen extends React.Component {
    componentDidMount() {
        fs.addEventListener("fullscreenchange", this.change);
    }
    
    componentWillUnmount() {
        fs.removeEventListener("fullscreenchange", this.change);
    }

    componentDidUpdate(prevProps) {
        if(this.props.enabled !== prevProps.enabled) {
            let enabled = fs.fullscreenElement === this.node;
            if(!enabled && this.props.enabled) {
                fs.requestFullscreen(this.node)
            }
            if (enabled && !this.props.enabled) {
                fs.exitFullscreen();
            }
        }
    }

    change = () => {
        this.props.onChange(fs.fullscreenElement === this.node)
    }

    render() {
        return (
            <div
                ref={node => (this.node = node)}
                style={
                    this.props.enabled ? { height: "100%", width: "100%" } : undefined
                }
            >
                {this.props.children}
            </div>
        )
    }
}

FullScreen.defaultProps = {
    onChange: () => {},
    children: [],
    enabled: false
}