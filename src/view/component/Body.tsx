import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import * as classNames from 'classnames';

declare var atom: any;

import { View, Error as E, Location as Loc } from '../../types';
import { updateMaxBodyHeight } from '../actions';
import Expr from './Expr';
import Error from './Error';
import Location from './Location';


interface Props extends React.HTMLAttributes {
    banner: View.BannerItem[];
    body: View.Body;
    error: E;
    plainText: string;
    maxBodyHeight: number;
    onMaxBodyHeightChange: (count: number) => void;
    jumpToGoal: (index: number) => void;
    jumpToLocation: (loc: Loc) => void;
}

const mapStateToProps = (state: View.State) => state.body
const mapDispatchToProps = (dispatch: any) => ({
    onMaxBodyHeightChange: (count: number) => {
        dispatch(updateMaxBodyHeight(count));
    }
})

class Body extends React.Component<Props, void> {
    componentDidMount() {
        atom.config.observe('agda-mode.maxBodyHeight', (newCount) => {
            this.props.onMaxBodyHeightChange(newCount);
        })
    }

    render() {
        const { banner, body, error, plainText, maxBodyHeight } = this.props;
        const { jumpToGoal, jumpToLocation } = this.props;
        const otherProps = _.omit(this.props, ['banner', 'body', 'error', 'plainText', 'maxBodyHeight', 'jumpToGoal', 'jumpToLocation', 'onMaxBodyHeightChange']);
        const classes = classNames(this.props.className, `native-key-bindings`);
        const style = {
            maxHeight: `${maxBodyHeight}px`
        }
        return (
            <section
                id="agda-body"
                className={classes}
                tabIndex="-1"
                style={style}
                {...otherProps}
            >
                <ul className="list-group">{banner.map((item, i) =>
                    <li className="list-item banner-item" key={i}>
                        <span><span className="text-info">{item.label}</span> : </span>
                        <Expr jumpToGoal={jumpToGoal}>{item.type}</Expr>
                    </li>
                )}</ul>
                <ul className="list-group">{body.goal.map((item, i) =>
                    <li className="list-item body-item" key={i}>
                        <div className="item-heading">
                            <button className="no-btn text-info" onClick={() => {
                                const index = parseInt(item.index.substr(1));
                                jumpToGoal(index);
                            }}>{item.index}</button>
                            <span> : </span>
                        </div>
                        <div className="item-body">
                            <Expr jumpToGoal={jumpToGoal}>{item.type}</Expr>
                        </div>
                    </li>
                )}{body.judgement.map((item, i) =>
                    <li className="list-item body-item" key={i}>
                        <div className="item-heading">
                            <span className="text-success">{item.expr}</span>
                            <span> : </span>
                        </div>
                        <div className="item-body">
                            <Expr jumpToGoal={jumpToGoal}>{item.type}</Expr>
                        </div>
                    </li>
                )}{body.term.map((item, i) =>
                    <li className="list-item body-item" key={i}>
                        <div className="item-body">
                            <Expr jumpToGoal={jumpToGoal}>{item.expr}</Expr>
                        </div>
                    </li>
                )}{body.meta.map((item, i) =>
                    <li className="list-item body-item" key={i}>
                        <div className="item-heading">
                            <span className="text-success">{item.index}</span>
                            <span> : </span>
                        </div>
                        <div className="item-body">
                            <Expr jumpToGoal={jumpToGoal}>{item.type}</Expr>
                            <Location jumpToLocation={jumpToLocation}>{item.location}</Location>
                        </div>
                    </li>
                )}{body.sort.map((item, i) =>
                    <li className="list-item body-item" key={i}>
                        <div className="item-heading">
                            <span className="text-highlight">Sort </span>
                            <span className="text-warning">{item.index}</span>
                        </div>
                        <div className="item-body">
                            <Location jumpToLocation={jumpToLocation}>{item.location}</Location>
                        </div>
                    </li>
                )}</ul>
                {error ? <Error
                        jumpToGoal={jumpToGoal}
                        jumpToLocation={jumpToLocation}
                    >{error}</Error> : null}
                {plainText ? <p>{plainText}</p> : null}
            </section>
        )
    }
}

export default connect<any, any, any>(
    mapStateToProps,
    mapDispatchToProps
)(Body);
