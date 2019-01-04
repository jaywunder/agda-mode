import * as Promise from 'bluebird';
import * as React from 'react';
import * as Redux from 'redux';
import * as ReactDOM from 'react-dom';
import * as path from 'path';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { EventEmitter } from 'events';
import ReduxThunk from 'redux-thunk'

import { Resource } from './util';
import { Core } from './core';
// import Panel from './view/component/Panel';
import Settings from './view/component/Settings';
import reducer from './view/reducers';
import { View as V } from './type';
import { EVENT } from './view/actions';
import * as Action from './view/actions';
import Tab from './view/tab';
import { TelePromise } from './util';
import { QueryCancelled } from './error';


import { CompositeDisposable } from 'atom';
import * as Atom from 'atom';

var { errorToHeader } = require('./Reason/View/JSON/JSON__Error.bs');
var { parseWhyInScope } = require('./Reason/View/Emacs/Emacs__Parser.bs');
var Panel = require('./Reason/View/Panel/Panel.bs').jsComponent;
var Reason = require('./Reason/Decoder.bs');

const ViewRE = require('./Reason/View.bs');

class EditorViewManager {
    main: Atom.TextEditor;
    general: Resource<Atom.TextEditor>;
    connection: Resource<Atom.TextEditor>;

    private focus: 'general' | 'connection' | 'main';

    private queryGeneralTP: TelePromise<string>;
    private queryConnectionTP: TelePromise<string>;

    constructor(main: Atom.TextEditor) {
        this.main = main;
        this.connection = new Resource;
        this.general = new Resource;
        this.focus = 'main';

        this.queryGeneralTP = new TelePromise;
        this.queryConnectionTP = new TelePromise;
    }

    focusMain() {
        atom.views.getView(this.main).focus();
        this.focus = 'main';
    }

    setFocus(focus: 'general' | 'connection' | 'main') {
        this.focus = focus;
    }

    generalIsFocused(): boolean { return this.focus === 'general' }
    connectionIsFocused(): boolean { return this.focus === 'connection' }

    // get the focused editor
    getFocusedEditor(): Promise<Atom.TextEditor> {
        if (this.general.isAvailable()) {
            return this.general.access().then(editor => {
                if (this.generalIsFocused())
                    return atom.views.getView(editor).getModel();
                else
                    return this.main;
            });
        }
        if (this.connection.isAvailable()) {
            return this.connection.access().then(editor => {
                if (this.connectionIsFocused())
                    return atom.views.getView(editor).getModel();
                else
                    return this.main;
            });
        } else {
            return Promise.resolve(this.main);
        }
    }

    //
    answerGeneral(payload :string) {
        this.queryGeneralTP.resolve(payload);
    }
    rejectGeneral() {
        this.queryGeneralTP.reject(new QueryCancelled);
    }

    answerConnection(payload :string) {
        this.queryConnectionTP.resolve(payload);
    }
    rejectConnection() {
        this.queryConnectionTP.reject(new QueryCancelled);
    }

    queryGeneral(): Promise<string> {
        return new Promise(this.queryGeneralTP.wire());
    }

    queryConnection(): Promise<string> {
        return new Promise(this.queryConnectionTP.wire());
    }
}

class TabManager {
    private panel: Tab;
    private settings: Tab;

    constructor(
        private core: Core,
        private store: Redux.Store<V.State>,
        mainEditor: Atom.TextEditor
    ) {
        // Tab for <Panel>
        this.panel = new Tab(mainEditor, 'panel');
        this.panel.onOpen((tab, panes) => {
            // activate the previous pane (which opened this pane item)
            panes.previous.activate();
            // render
            ViewRE.renderPanel(tab.getElement());
            // this.core.view.renderPanel(tab.getElement());
        });

        // open <Panel> at the bottom when this tab got destroyed
        this.panel.onKill(tab => {
            this.store.dispatch(Action.VIEW.mountAtBottom());
            // this.core.view.unmountPanel(V.MountingPosition.Pane);
            // this.core.view.mountPanel(V.MountingPosition.Bottom);
            ViewRE.jsMountPanel("bottom");
        });

        // Tab for <Settings>
        this.settings = new Tab(mainEditor, 'settings', () => {
            const { name } = path.parse(mainEditor.getPath());
            return `[Settings] ${name}`
        });
        this.settings.onOpen((_, panes) => {
            // activate the previous pane (which opened this pane item)
            panes.previous.activate();
            // render the view
            ReactDOM.render(
                <Provider store={this.store}>
                    <Settings
                        core={this.core}
                    />
                </Provider>,
                this.settings.getElement()
            );
        });

        this.settings.onKill(() => {
            this.store.dispatch(Action.VIEW.toggleSettings());
        });

    }

    open(tab: 'panel' | 'settings'): Promise<Tab> {
        switch(tab) {
            case 'panel':
                if (!this.panel.isActive()) {
                    return this.panel.open();
                } else {
                    return Promise.resolve(this.panel);
                }
            case 'settings':
                if (!this.settings.isActive()) {
                    return this.settings.open();
                } else {
                    return Promise.resolve(this.settings);
                }
        }
    }

    close(tab: 'panel' | 'settings') {
        switch(tab) {
            case 'panel':
                if (this.panel.isActive()) {
                    ReactDOM.unmountComponentAtNode(this.panel.getElement());
                    this.panel.close();
                }
                break;
            case 'settings':
                if (this.settings.isActive()) {
                    ReactDOM.unmountComponentAtNode(this.settings.getElement());
                    this.settings.close();
                }
                break;
        }
    }
    activate(tab: 'panel' | 'settings') {
        switch(tab) {
            case 'panel':
                this.panel.activate();
                break;
            case 'settings':
                this.settings.activate();
                break;
        }
    }
    destroyAll() {
        this.panel.destroy();
        this.settings.destroy();
    }
}


type Style = "plain-text" | "error" | "info" | "success" | "warning";

export default class View {
    public static EventContext = React.createContext(new EventEmitter);
    public static CoreContext = React.createContext(undefined);
     // = React.createContext(new EventEmitter);
    private emitter: EventEmitter;
    private subscriptions: Atom.CompositeDisposable;
    public store: Redux.Store<V.State>;
    public editors: EditorViewManager;
    private bottomPanel: Atom.Panel;
    public tabs: TabManager;

    private updateHeader: (state: {text: string; style: string}) => void;
    private updateJSONBody: (state: {kind: string; rawJSON: object; rawString: string}) => void;
    private updateEmacsBody: (state: {kind: string; header: string; body: string}) => void;
    private updateIsPending: (state: {isPending: boolean}) => void;
    private updateMountAt: (state: string) => void;

    isPending(isPending: boolean) {
        if (this.updateIsPending)
            this.updateIsPending({isPending: isPending});
    }

    constructor(private core: Core) {
        this.store = createStore(
            reducer,
            applyMiddleware(ReduxThunk)
        );

        // global events
        this.emitter = new EventEmitter;
        this.emitter.on(EVENT.JUMP_TO_GOAL, (index: number) => {
            this.core.editor.jumpToGoal(index);
        });
        this.emitter.on(EVENT.JUMP_TO_RANGE, (range: Atom.Range, source: string) => {
            this.core.editor.jumpToRange(range, source);
        });
        this.emitter.on(EVENT.MOUSE_OVER, (range: Atom.Range, source: string) => {
            this.core.editor.mouseOver(range);
        });
        this.emitter.on(EVENT.MOUSE_OUT, (range: Atom.Range, source: string) => {
            this.core.editor.mouseOut();
        });

        // the event emitter garbage collector
        this.subscriptions = new CompositeDisposable;

        // views of editors
        this.editors = new EditorViewManager(core.editor.getTextEditor());

        // the tab manager
        this.tabs = new TabManager(this.core, this.store, core.editor.getTextEditor());

    }

    private state() {
        return this.store.getState().view;
    }


    // destructor
    destroy() {
        // this.unmountPanel(this.state().mountAt.current);
        this.subscriptions.dispose();
        this.tabs.destroyAll();
    }

    // for JSON
    setJSONError(rawJSON: object, rawString: string) {
        console.log(rawJSON)
        ViewRE.jsUpdateMode("display");
        this.editors.focusMain()

        ViewRE.jsUpdateHeader({
            text: errorToHeader(Reason.parseError(rawJSON)),
            style: 'error',
        });

        ViewRE.jsUpdateHeader({
            kind: 'Error',
            rawJSON: rawJSON,
            rawString: rawString
        });
    }

    setJSONAllGoalsWarnings(rawJSON: object, rawString: string) {
        ViewRE.jsUpdateMode("display");
        this.editors.focusMain()


        ViewRE.jsUpdateHeader({
            text: 'All Goals, Warnings, and Errors',
            style: 'info'
        });

        ViewRE.jsUpdateJSONBody({
            kind: 'AllGoalsWarnings',
            rawJSON: rawJSON,
            rawString: rawString,
        });
    }

    // for Emacs
    setEmacsPanel(header, kind, payload, style: Style ="info") {
        ViewRE.jsUpdateMode("display");
        this.editors.focusMain()

        ViewRE.jsUpdateHeader({
            text: header,
            style: style
        });

        ViewRE.jsUpdateEmacsBody({
            kind: kind,
            header: header,
            body: payload
        });
    }

    setEmacsGoalTypeContext(header: string = 'Judgements', goalTypeContext: string) {
        ViewRE.jsUpdateMode("display");
        this.editors.focusMain()

        ViewRE.jsUpdateHeader({
            text: header,
            style: 'info'
        });

        ViewRE.jsUpdateEmacsBody({
            kind: 'GoalTypeContext',
            header: header,
            body: goalTypeContext
        });
    }

    setEmacsGoToDefinition(raw: string) {
        const result = parseWhyInScope(raw);
        if (result) {
            const [range, source] = result;
            this.core.editor.jumpToRange(range, source);
        }
    }

    setPlainText(header: string, body: string, style: Style ="plain-text") {
        ViewRE.jsUpdateMode("display");

        ViewRE.jsUpdateMode("display");
        this.editors.focusMain()


        ViewRE.jsUpdateHeader({
            text: header,
            style: style
        });

        ViewRE.jsUpdateEmacsBody({
            kind: 'PlainText',
            header: header,
            body: body
        });
    }

    query(header: string = '', _: string[] = [], placeholder: string = ''): Promise<string> {

        ViewRE.jsUpdateMode("query");
        ViewRE.jsUpdateHeader({
            text: header,
            style: 'plain-text',
        });
        return ViewRE.jsQueryGeneral(placeholder, '');
    }

    queryConnection(): Promise<string> {
        return this.tabs.open('settings').then(() => {
            this.store.dispatch(Action.VIEW.navigate({path: '/Connection'}));
            return this.editors.connection.access()
                .then(editor => {
                    if (!this.editors.connectionIsFocused()) {
                        let element = atom.views.getView(editor);
                        element.focus();
                        element.getModel().selectAll();
                    }
                    return this.editors.queryConnection();
                });
        });
    }

    toggleDocking(): Promise<{}> {
        switch (this.state().mountAt.current) {
            case V.MountingPosition.Bottom:
                this.store.dispatch(Action.VIEW.mountAtPane());
                ViewRE.jsMountPanel("pane");
                break;
            case V.MountingPosition.Pane:
                this.store.dispatch(Action.VIEW.mountAtBottom());
                ViewRE.jsMountPanel("bottom");
                break;
            default:
                // do nothing
                break;
        }
        return Promise.resolve({});
    }
}
