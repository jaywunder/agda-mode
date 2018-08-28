import * as React from 'react';
import { EventEmitter } from 'events';

import { Agda } from '../../../../type';
import { EVENT } from '../../../actions';

// Atom shits
import { CompositeDisposable } from 'atom';
import * as Atom from 'atom';

type Props = React.HTMLProps<HTMLElement> & {
    emitter: EventEmitter;
    range: Agda.Syntax.Range;
    abbr?: boolean;
}

function toString(range: Agda.Syntax.Range): string {
    const lineNums = range.intervals.map((interval) => {
        if (interval.start[0] === interval.end[0])
            return `${interval.start[0]},${interval.start[1]}-${interval.end[1]}`
        else
            return `${interval.start[0]},${interval.start[1]}-${interval.end[0]},${interval.end[1]}`
    }).join(' ');

    if (range.source && lineNums) {
        return `${range.source}:${lineNums}`;
    }

    if (range.source && lineNums === '') {
        return `${range.source}`;
    }

    if (range.source === null) {
        return `${lineNums}`;
    }
}

export default class Range extends React.Component<Props, {}> {
    private subscriptions: Atom.CompositeDisposable;
    private link: HTMLElement;

    constructor(props: Props) {
        super(props)
        this.subscriptions = new CompositeDisposable;
    }

    componentDidMount() {
        if (this.props.abbr) {
            this.subscriptions.add(atom.tooltips.add(this.link, {
                title: JSON.stringify(this.props.range),
                delay: {
                    show: 0,
                    hide: 1000
                }
            }));
        }
    }

    componentWillUnmount() {
        this.subscriptions.dispose();
    }


    render() {
        const { emitter, range, abbr } = this.props;

        if (abbr) {
            return (
                <span
                    className="text-subtle location icon icon-link"
                    onClick={() => {
                        emitter.emit(EVENT.JUMP_TO_RANGE, range);
                    }}
                    ref={(ref) => {
                        this.link = ref;
                    }}
                ></span>
            )
        } else {
            return (
                <span
                    className="text-subtle location icon icon-link"
                    onClick={() => {
                        emitter.emit(EVENT.JUMP_TO_RANGE, range);
                    }}
                > {toString(range)}</span>
            )
        }
    }
}