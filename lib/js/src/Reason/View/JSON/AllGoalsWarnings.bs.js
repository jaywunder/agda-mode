// Generated by BUCKLESCRIPT VERSION 4.0.5, PLEASE EDIT WITH CARE
'use strict';

var List = require("bs-platform/lib/js/list.js");
var $$Array = require("bs-platform/lib/js/array.js");
var Block = require("bs-platform/lib/js/block.js");
var React = require("react");
var ReactDOMRe = require("reason-react/lib/js/src/ReactDOMRe.js");
var ReasonReact = require("reason-react/lib/js/src/ReasonReact.js");
var OutputConstraint$AgdaMode = require("../Typechecking/OutputConstraint.bs.js");

var component = ReasonReact.statelessComponent("AllGoalsWarnings");

function make(value, _) {
  return /* record */Block.record([
            "debugName",
            "reactClassInternal",
            "handedOffState",
            "willReceiveProps",
            "didMount",
            "didUpdate",
            "willUnmount",
            "willUpdate",
            "shouldUpdate",
            "render",
            "initialState",
            "retainedProps",
            "reducer",
            "jsElementWrapped"
          ], [
            component[/* debugName */0],
            component[/* reactClassInternal */1],
            component[/* handedOffState */2],
            component[/* willReceiveProps */3],
            component[/* didMount */4],
            component[/* didUpdate */5],
            component[/* willUnmount */6],
            component[/* willUpdate */7],
            component[/* shouldUpdate */8],
            (function () {
                var interactionMetas = ReactDOMRe.createElementVariadic("ul", {
                      className: "metas"
                    }, $$Array.of_list(List.map((function (meta) {
                                return ReasonReact.element(undefined, undefined, OutputConstraint$AgdaMode.make(meta, /* array */[]));
                              }), value[/* interactionMetas */0])));
                var hiddenMetas = ReactDOMRe.createElementVariadic("ul", {
                      className: "metas"
                    }, $$Array.of_list(List.map((function (meta) {
                                return ReasonReact.element(undefined, undefined, OutputConstraint$AgdaMode.make(meta, /* array */[]));
                              }), value[/* hiddenMetas */1])));
                var warnings = ReactDOMRe.createElementVariadic("ul", {
                      className: "warnings"
                    }, $$Array.of_list(List.map((function (x) {
                                return React.createElement("li", undefined, x[/* warning' */2]);
                              }), value[/* warnings */2])));
                var match = List.length(value[/* interactionMetas */0]) > 0;
                var match$1 = List.length(value[/* hiddenMetas */1]) > 0;
                var match$2 = List.length(value[/* warnings */2]) > 0;
                return React.createElement(React.Fragment, undefined, match ? interactionMetas : null, match$1 ? hiddenMetas : null, match$2 ? warnings : null);
              }),
            component[/* initialState */10],
            component[/* retainedProps */11],
            component[/* reducer */12],
            component[/* jsElementWrapped */13]
          ]);
}

exports.component = component;
exports.make = make;
/* component Not a pure module */