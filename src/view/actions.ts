import { createAction } from 'redux-actions';
import { Agda, View, Conn } from '../type';

export namespace EVENT {
    export const JUMP_TO_GOAL = 'EVENT.JUMP_TO_GOAL';
    export const MOUSE_OVER = 'EVENT.MOUSE_OVER';
    export const MOUSE_OUT = 'EVENT.MOUSE_OUT';
    export const JUMP_TO_RANGE = 'EVENT.JUMP_TO_RANGE';
}

export type VIEW
    = VIEW.ACTIVATE
    | VIEW.DEACTIVATE
    | VIEW.MOUNT
    | VIEW.UNMOUNT
    | VIEW.MOUNT_AT_PANE
    | VIEW.MOUNT_AT_BOTTOM
    | VIEW.TOGGLE_SETTINGS_VIEW
    | VIEW.NAVIGATE
export namespace VIEW {
    export const ACTIVATE = 'VIEW.ACTIVATE';
    export type ACTIVATE = void;
    export const DEACTIVATE = 'VIEW.DEACTIVATE';
    export type DEACTIVATE = void;
    export const MOUNT = 'VIEW.MOUNT';
    export type MOUNT = void;
    export const UNMOUNT = 'VIEW.UNMOUNT';
    export type UNMOUNT = void;
    export const MOUNT_AT_PANE = 'VIEW.MOUNT_AT_PANE';
    export type MOUNT_AT_PANE = void;
    export const MOUNT_AT_BOTTOM = 'VIEW.MOUNT_AT_BOTTOM';
    export type MOUNT_AT_BOTTOM = void;
    export const TOGGLE_SETTINGS_VIEW = 'VIEW.TOGGLE_SETTINGS_VIEW';
    export type TOGGLE_SETTINGS_VIEW = void;
    export const NAVIGATE = 'VIEW.NAVIGATE';
    export type NAVIGATE = View.SettingsURI;

    export const activate = createAction(VIEW.ACTIVATE);
    export const deactivate = createAction(VIEW.DEACTIVATE);
    export const mount = createAction(VIEW.MOUNT);
    export const unmount = createAction(VIEW.UNMOUNT);
    export const mountAtPane = createAction(VIEW.MOUNT_AT_PANE);
    export const mountAtBottom = createAction(VIEW.MOUNT_AT_BOTTOM);
    export const toggleSettings = createAction(VIEW.TOGGLE_SETTINGS_VIEW);
    export const navigate = createAction<VIEW.NAVIGATE>(VIEW.NAVIGATE);
}

export type MODE =
    MODE.DISPLAY |
    MODE.QUERY |
    MODE.QUERY_CONNECTION;
export namespace MODE {
    export const DISPLAY = 'MODE.DISPLAY';
    export type DISPLAY = void;
    export const QUERY = 'MODE.QUERY';
    export type QUERY = void;
    export const QUERY_CONNECTION = 'MODE.QUERY_CONNECTION';
    export type QUERY_CONNECTION = void;

    export const display = createAction(MODE.DISPLAY);
    export const query = createAction(MODE.QUERY);
    export const queryConnection = createAction(MODE.QUERY_CONNECTION);
}

export type CONNECTION
    = CONNECTION.CONNECT_AGDA
    | CONNECTION.DISCONNECT_AGDA
    | CONNECTION.START_QUERYING
    | CONNECTION.STOP_QUERYING
    | CONNECTION.SET_AGDA_MESSAGE

export namespace CONNECTION {
    export const CONNECT_AGDA = 'CONNECTION.CONNECT_AGDA_AGDA';
    export type CONNECT_AGDA = Conn.ValidPath;
    export const DISCONNECT_AGDA = 'CONNECTION.DISCONNECT_AGDA_AGDA';
    export type DISCONNECT_AGDA = void;
    export const START_QUERYING = 'CONNECTION.START_QUERYING';
    export type START_QUERYING = void;
    export const STOP_QUERYING = 'CONNECTION.STOP_QUERYING';
    export type STOP_QUERYING = void;
    export const SET_AGDA_MESSAGE = 'CONNECTION.SET_AGDA_MESSAGE';
    export type SET_AGDA_MESSAGE = string;

    export const connectAgda = createAction<CONNECTION.CONNECT_AGDA>(CONNECTION.CONNECT_AGDA);
    export const disconnectAgda = createAction(CONNECTION.DISCONNECT_AGDA);
    export const startQuerying = createAction(CONNECTION.START_QUERYING);
    export const stopQuerying = createAction(CONNECTION.STOP_QUERYING);
    export const setAgdaMessage = createAction<CONNECTION.SET_AGDA_MESSAGE>(CONNECTION.SET_AGDA_MESSAGE);
}

export type PROTOCOL
    = PROTOCOL.LOG_REQUEST
    | PROTOCOL.LOG_RESPONSES
    | PROTOCOL.PENDING
    | PROTOCOL.LIMIT_LOG

export namespace PROTOCOL {
    export const LOG_REQUEST = 'PROTOCOL.LOG_REQUEST';
    export type LOG_REQUEST = View.Parsed<Agda.Request>;
    export const LOG_RESPONSES = 'PROTOCOL.LOG_RESPONSE';
    export type LOG_RESPONSES = View.Parsed<Agda.Response>[];

    export const LIMIT_LOG = 'PROTOCOL.LIMIT_LOG';
    export type LIMIT_LOG = boolean;

    export const PENDING = 'PROTOCOL.PENDING';
    export type PENDING = boolean;

    export const logRequest = createAction<PROTOCOL.LOG_REQUEST>(PROTOCOL.LOG_REQUEST);
    export const logResponses = createAction<PROTOCOL.LOG_RESPONSES>(PROTOCOL.LOG_RESPONSES);
    export const limitLog = createAction<PROTOCOL.LIMIT_LOG>(PROTOCOL.LIMIT_LOG);
    export const pending = createAction<PROTOCOL.PENDING>(PROTOCOL.PENDING);
}


export type INPUT_METHOD = INPUT_METHOD.ACTIVATE
    | INPUT_METHOD.DEACTIVATE
    | INPUT_METHOD.INSERT
    | INPUT_METHOD.DELETE
    | INPUT_METHOD.REPLACE_SYMBOL

export namespace INPUT_METHOD {
    export const ACTIVATE = 'INPUT_METHOD.ACTIVATE';
    export type ACTIVATE = void;
    export const DEACTIVATE = 'INPUT_METHOD.DEACTIVATE';
    export type DEACTIVATE = void;
    export const INSERT = 'INPUT_METHOD.INSERT';
    export type INSERT = string;
    export const DELETE = 'INPUT_METHOD.DELETE';
    export type DELETE = void;
    export const REPLACE_SYMBOL = 'INPUT_METHOD.REPLACE_SYMBOL';
    export type REPLACE_SYMBOL = string;

    export const activate = createAction(INPUT_METHOD.ACTIVATE);
    export const deactivate = createAction(INPUT_METHOD.DEACTIVATE);
    export const insertChar = createAction<INPUT_METHOD.INSERT>(INPUT_METHOD.INSERT);
    export const deleteChar = createAction(INPUT_METHOD.DELETE);
    export const replaceSymbol = createAction<INPUT_METHOD.REPLACE_SYMBOL>(INPUT_METHOD.REPLACE_SYMBOL);
}


export type HEADER = HEADER.UPDATE;
export namespace HEADER {
    export const UPDATE = 'HEADER.UPDATE';
    export type UPDATE = View.HeaderState;

    export const update = createAction<HEADER.UPDATE>(HEADER.UPDATE);
}

export type QUERY = QUERY.SET_PLACEHOLDER | QUERY.UPDATE_VALUE;
export namespace QUERY {
    export const SET_PLACEHOLDER = 'QUERY.SET_PLACEHOLDER';
    export type SET_PLACEHOLDER = string;
    export const UPDATE_VALUE = 'QUERY.UPDATE_VALUE';
    export type UPDATE_VALUE = string;

    export const updateValue = createAction<QUERY.UPDATE_VALUE>(QUERY.UPDATE_VALUE);
    export const setPlaceholder = createAction<QUERY.SET_PLACEHOLDER>(QUERY.SET_PLACEHOLDER);
}


export type BODY =
     BODY.UPDATE_MAX_BODY_HEIGHT
    | BODY.UPDATE_JSON
    | BODY.UPDATE_EMACS;
export namespace BODY {
    export const UPDATE_MAX_BODY_HEIGHT = 'BODY.UPDATE_MAX_BODY_HEIGHT';
    export type UPDATE_MAX_BODY_HEIGHT = number;
    export const UPDATE_JSON = 'BODY.UPDATE_JSON';
    export type UPDATE_JSON = View.JSONState;
    export const UPDATE_EMACS = 'BODY.UPDATE_EMACS';
    export type UPDATE_EMACS = View.EmacsState;
}

export const updateMaxBodyHeight = createAction<BODY.UPDATE_MAX_BODY_HEIGHT>(BODY.UPDATE_MAX_BODY_HEIGHT);
export const updateJSON = createAction<BODY.UPDATE_JSON>(BODY.UPDATE_JSON);
export const updateEmacs = createAction<BODY.UPDATE_EMACS>(BODY.UPDATE_EMACS);
