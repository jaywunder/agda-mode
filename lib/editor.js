"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Promise = require("bluebird");
const _ = require("lodash");
const type_1 = require("./type");
const parser_1 = require("./parser");
const error_1 = require("./error");
var { Range, Point, CompositeDisposable } = require('atom');
class Editor {
    constructor(core, textEditor) {
        this.core = core;
        this.textEditor = textEditor;
        this.goals = [];
    }
    getTextEditor() {
        return this.textEditor;
    }
    //////////////////
    //  Filesystem  //
    //////////////////
    // issue #48, TextBuffer::save will be async in Atom 1.19
    save() {
        let promise = this.textEditor.save();
        if (promise && promise.then) {
            return promise.then((e) => {
                return Promise.resolve();
            });
        }
        else {
            return Promise.resolve();
        }
    }
    getPath() {
        return parser_1.parseFilepath(this.textEditor.getPath());
    }
    ///////////////////////
    //  Index <=> Point  //
    ///////////////////////
    fromIndex(ind) {
        return this.textEditor.getBuffer().positionForCharacterIndex(ind);
    }
    toIndex(pos) {
        return this.textEditor.getBuffer().characterIndexForPosition(pos);
    }
    translate(pos, n) {
        return this.textEditor.fromIndex((this.textEditor.toIndex(pos)) + n);
    }
    fromIndexRange(range) {
        const start = this.textEditor.fromIndex(range.start);
        const end = this.textEditor.fromIndex(range.end);
        return new Range(start, end);
    }
    /////////////////////////
    //  Cursor Management  //
    /////////////////////////
    // shift cursor if in certain goal
    protectCursor(callback) {
        let position = this.textEditor.getCursorBufferPosition();
        let result = callback();
        return this.getCurrentGoal(position)
            .then((goal) => {
            // reposition the cursor in the goal only if it's a fresh hole (coming from '?')
            let isFreshHole = goal.isEmpty();
            if (isFreshHole) {
                let newPosition = this.textEditor.translate(goal.range.start, 3);
                setTimeout(() => {
                    this.textEditor.setCursorBufferPosition(newPosition);
                });
            }
            else {
                this.textEditor.setCursorBufferPosition(position);
            }
            return result;
        }).catch(error_1.OutOfGoalError, () => {
            this.textEditor.setCursorBufferPosition(position);
            return result;
        });
    }
    focus() {
        let textEditorElement = atom.views.getView(this.textEditor);
        textEditorElement.focus();
    }
    ///////////////////////
    //  Goal Management  //
    ///////////////////////
    removeGoals() {
        this.goals.forEach((goal) => {
            goal.destroy();
        });
        this.goals = [];
    }
    removeGoal(index) {
        this.goals
            .filter((goal) => { return goal.index === index; })
            .forEach((goal) => { goal.destroy(); });
        this.goals = this.goals
            .filter((goal) => { return goal.index !== index; });
    }
    findGoal(index) {
        let goals = this.goals.filter((goal) => { return goal.index === index; });
        return goals[0];
    }
    getCurrentGoal(cursor = this.textEditor.getCursorBufferPosition()) {
        const goals = this.goals.filter((goal) => {
            return goal.range.containsPoint(cursor, false);
        });
        if (_.isEmpty(goals))
            return Promise.reject(new error_1.OutOfGoalError('out of goal'));
        else
            return Promise.resolve(goals[0]);
    }
    warnOutOfGoal() {
        this.core.view.set('Out of goal', ['For this command, please place the cursor in a goal'], 4 /* Warning */);
    }
    warnEmptyGoal(error) {
        this.core.view.set('No content', [error.message], 4 /* Warning */);
    }
    // reject if goal is empty
    guardGoalHasContent(goal) {
        if (goal.getContent()) {
            return Promise.resolve(goal);
        }
        else {
            return Promise.reject(new error_1.EmptyGoalError('goal is empty', goal));
        }
    }
    ////////////////
    //  Commands  //
    ////////////////
    nextGoal() {
        const cursor = this.textEditor.getCursorBufferPosition();
        let nextGoal = null;
        const positions = this.goals.map((goal) => {
            const start = goal.range.start;
            return this.textEditor.translate(start, 3);
        });
        positions.forEach((position) => {
            if (position.isGreaterThan(cursor) && nextGoal === null) {
                nextGoal = position;
            }
        });
        // no goal ahead of cursor, loop back
        if (nextGoal === null)
            nextGoal = _.head(positions);
        // jump only when there are goals
        if (!_.isEmpty(positions))
            this.textEditor.setCursorBufferPosition(nextGoal);
        return Promise.resolve({});
    }
    previousGoal() {
        const cursor = this.textEditor.getCursorBufferPosition();
        let previousGoal = null;
        const positions = this.goals.map((goal) => {
            const start = goal.range.start;
            return this.textEditor.translate(start, 3);
        });
        positions.forEach((position) => {
            if (position.isLessThan(cursor)) {
                previousGoal = position;
            }
        });
        // no goal ahead of cursor, loop back
        if (previousGoal === null)
            previousGoal = _.last(positions);
        // jump only when there are goals
        if (!_.isEmpty(positions))
            this.textEditor.setCursorBufferPosition(previousGoal);
        return Promise.resolve({});
    }
    jumpToGoal(index) {
        let goal = this.goals.filter((goal) => { return goal.index === index; })[0];
        if (goal) {
            let start = goal.range.start;
            let position = this.textEditor.translate(start, 3);
            this.textEditor.setCursorBufferPosition(position);
            this.focus();
        }
    }
    jumpToLocation(location) {
        this.focus();
        if (location.path) {
            atom.workspace.open(location.path)
                .then(editor => {
                editor.setSelectedBufferRange(location.range, true);
            });
        }
        else {
            this.getCurrentGoal()
                .then((goal) => {
                let range;
                if (location.range.start.row === 0) {
                    range = location.range
                        .translate(goal.range.start)
                        .translate([0, 3]); // hole boundary
                }
                else {
                    range = location.range
                        .translate([goal.range.start.row, 0]);
                }
                this.textEditor.setSelectedBufferRange(range, true);
            }).catch(() => this.warnOutOfGoal());
        }
    }
    ////////////////////////
    //  Command Handlers  //
    ////////////////////////
    onInteractionPoints(indices) {
        return this.protectCursor(() => {
            let textRaw = this.textEditor.getText();
            this.removeGoals();
            parser_1.parseHole(textRaw, indices).forEach((hole) => {
                let range = this.textEditor.fromIndexRange(hole.originalRange);
                this.textEditor.setTextInBufferRange(range, hole.content);
                let goal = new type_1.Goal(this.textEditor, hole.index, {
                    start: hole.modifiedRange.start,
                    end: hole.modifiedRange.end,
                });
                this.goals.push(goal);
            });
        });
    }
    onSolveAll(index, content) {
        return this.protectCursor(() => {
            let goal = this.findGoal(index);
            goal.setContent(content);
            return goal;
        });
    }
    // Give_Paren  : ["agda2-give-action", 1, "paren"]
    // Give_NoParen: ["agda2-give-action", 1, "no-paren"]
    // Give_String : ["agda2-give-action", 0, ...]
    onGiveAction(index, giveResult, result) {
        return this.protectCursor(() => {
            let goal = this.findGoal(index);
            switch (giveResult) {
                case 'Paren':
                    result = goal.getContent();
                    goal.setContent(`(${result})`);
                    break;
                case 'NoParen':
                    // do nothing
                    break;
                case 'String':
                    result = result.replace(/\\n/g, '\n');
                    goal.setContent(result);
                    break;
            }
            goal.removeBoundary();
            this.removeGoal(index);
        });
    }
    onMakeCase(variant, result) {
        return this.protectCursor(() => {
            this.getCurrentGoal().then((goal) => {
                switch (variant) {
                    case 'Function':
                        goal.writeLines(result);
                        break;
                    case 'ExtendedLambda':
                        goal.writeLambda(result);
                        break;
                }
            }).catch(() => this.warnOutOfGoal());
        });
    }
    onJumpToError(filepath, charIndex) {
        if (this.getPath() === filepath) {
            let position = this.textEditor.fromIndex(charIndex - 1);
            this.textEditor.setCursorBufferPosition(position);
        }
        return Promise.resolve();
    }
    // Agda generates files with syntax highlighting notations,
    // those files are temporary and should be deleted once used.
    // note: no highlighting yet, we'll just delete them.
    onHighlightLoadAndDelete(filepath) {
        fs.unlink(filepath, () => { });
        return Promise.resolve();
    }
}
exports.default = Editor;
//# sourceMappingURL=editor.js.map