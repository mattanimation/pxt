/// <reference path="../../built/pxtsim.d.ts" />

import * as React from "react";
import * as sui from "./sui";
import * as data from "./data";
import { fireClickOnEnter } from "./util";

export interface SerialIndicatorProps {
    isSim: boolean,
    onClick: () => any
    parent: pxt.editor.IProjectView;
}

export interface SerialIndicatorState {
    active?: boolean
}

export class SerialIndicator extends data.Component<SerialIndicatorProps, SerialIndicatorState> {

    constructor(props: any) {
        super(props)
        this.state = { active: false }
    }

    componentDidMount() {
        window.addEventListener("message", this.setActive.bind(this))
    }

    componentWillUnmount() {
        window.addEventListener("message", this.setActive.bind(this))
    }

    setActive(ev: MessageEvent) {
        let msg = ev.data
        if (!this.state.active && (msg.type === "serial" || msg.type === "bulkserial")) {
            const sim = !!msg.sim
            if (sim === this.props.isSim) {
                this.setState({ active: true })

                const parent = this.props.parent;
                if (this.props.isSim) {
                    parent.setState({ simSerialActive: true });
                } else {
                    parent.setState({ deviceSerialActive: true });
                }
            }
        }
    }

    active() {
        return !!this.state.active;
    }

    clear() {
        this.setState({ active: false })
    }

    renderCore() {
        if (!this.active()) return <div />;
        return (
            <div role="button" title={lf("Open console")} className="ui label circular" tabIndex={0} onClick={this.props.onClick} onKeyDown={fireClickOnEnter}>
                <div className="detail">
                    <img alt={lf("Animated bar chart")} className="barcharticon" src={pxt.Util.pathJoin(pxt.webConfig.commitCdnUrl, `images/Bars_black.gif`)}></img>
                </div>
                <span>{lf("Show console")}</span>
                <div className="detail">
                    {this.props.isSim ? lf("Simulator") : lf("Device")}
                </div>
            </div>)
    }
}