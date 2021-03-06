// Generated by BUCKLESCRIPT VERSION 4.0.18, PLEASE EDIT WITH CARE
'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var $$String = require("bs-platform/lib/js/string.js");
var ReactDOMRe = require("reason-react/lib/js/src/ReactDOMRe.js");
var ReasonReact = require("reason-react/lib/js/src/ReasonReact.js");
var Context$AgdaMode = require("./Context.bs.js");

function tempEventToString($$event) {
  switch ($$event) {
    case 0 : 
        return "EVENT.JUMP_TO_RANGE";
    case 1 : 
        return "EVENT.MOUSE_OVER";
    case 2 : 
        return "EVENT.MOUSE_OUT";
    
  }
}

var component = ReasonReact.statelessComponent("Link");

function make($staropt$star, $staropt$star$1, $staropt$star$2, $staropt$star$3, children) {
  var range = $staropt$star !== undefined ? $staropt$star : /* NoRange */0;
  var jump = $staropt$star$1 !== undefined ? $staropt$star$1 : false;
  var hover = $staropt$star$2 !== undefined ? $staropt$star$2 : false;
  var className = $staropt$star$3 !== undefined ? $staropt$star$3 : /* [] */0;
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
            (function (_self) {
                var exit = 0;
                if (range && range[1]) {
                  return ReasonReact.element(undefined, undefined, Curry._1(Context$AgdaMode.Emitter[/* Consumer */2][/* make */0], (function (emit) {
                                    return ReactDOMRe.createElementVariadic("span", {
                                                className: $$String.concat(" ", /* :: */Block.simpleVariant("::", [
                                                        "link",
                                                        className
                                                      ])),
                                                onClick: (function (param) {
                                                    if (jump) {
                                                      return Curry._2(emit, "EVENT.JUMP_TO_RANGE", range);
                                                    } else {
                                                      return 0;
                                                    }
                                                  }),
                                                onMouseOut: (function (param) {
                                                    if (hover) {
                                                      return Curry._2(emit, "EVENT.MOUSE_OUT", range);
                                                    } else {
                                                      return 0;
                                                    }
                                                  }),
                                                onMouseOver: (function (param) {
                                                    if (hover) {
                                                      return Curry._2(emit, "EVENT.MOUSE_OVER", range);
                                                    } else {
                                                      return 0;
                                                    }
                                                  })
                                              }, children);
                                  })));
                } else {
                  exit = 1;
                }
                if (exit === 1) {
                  return ReactDOMRe.createElementVariadic("span", {
                              className: $$String.concat(" ", /* :: */Block.simpleVariant("::", [
                                      "link",
                                      className
                                    ]))
                            }, children);
                }
                
              }),
            component[/* initialState */10],
            component[/* retainedProps */11],
            component[/* reducer */12],
            component[/* jsElementWrapped */13]
          ]);
}

var noRange = /* NoRange */0;

exports.noRange = noRange;
exports.tempEventToString = tempEventToString;
exports.component = component;
exports.make = make;
/* component Not a pure module */
