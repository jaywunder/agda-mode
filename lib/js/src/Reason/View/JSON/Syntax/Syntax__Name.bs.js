// Generated by BUCKLESCRIPT VERSION 4.0.6, PLEASE EDIT WITH CARE
'use strict';

var List = require("bs-platform/lib/js/list.js");
var Block = require("bs-platform/lib/js/block.js");
var React = require("react");
var $$String = require("bs-platform/lib/js/string.js");
var ReasonReact = require("reason-react/lib/js/src/ReasonReact.js");
var Link$AgdaMode = require("../../Link.bs.js");
var Util$AgdaMode = require("../../../Util.bs.js");
var Range$AgdaMode = require("../../Range.bs.js");

function toString(part) {
  if (part) {
    return part[0];
  } else {
    return "_";
  }
}

var NamePart = /* module */Block.localModule(["toString"], [toString]);

function toString$1(name) {
  if (name.tag) {
    return "_";
  } else {
    return $$String.concat("", List.map(toString, name[1]));
  }
}

function isUnderscore(name) {
  if (name.tag) {
    return true;
  } else {
    var match = name[1];
    if (match) {
      var match$1 = match[0];
      if (match$1 && !match[1]) {
        return match$1[0] === "_";
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

function getRange(name) {
  return name[0];
}

var component = ReasonReact.statelessComponent("Name");

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
                return ReasonReact.element(undefined, undefined, Link$AgdaMode.make(getRange(value), true, true, undefined, /* array */[toString$1(value)]));
              }),
            component[/* initialState */10],
            component[/* retainedProps */11],
            component[/* reducer */12],
            component[/* jsElementWrapped */13]
          ]);
}

var Name = /* module */Block.localModule([
    "toString",
    "isUnderscore",
    "getRange",
    "component",
    "make"
  ], [
    toString$1,
    isUnderscore,
    getRange,
    component,
    make
  ]);

function toString$2(name) {
  return $$String.concat(".", List.map(toString$1, List.filter((function (x) {
                          return !isUnderscore(x);
                        }))(List.append(name[0], /* :: */Block.simpleVariant("::", [
                            name[1],
                            /* [] */0
                          ])))));
}

function getRange$1(name) {
  var match = name[0];
  if (match) {
    return Range$AgdaMode.fuse(getRange$1(/* QName */Block.simpleVariant("QName", [
                      match[1],
                      match[0]
                    ])), getRange(name[1]));
  } else {
    return getRange(name[1]);
  }
}

function unqualify(param) {
  var x = param[1];
  var range = getRange$1(/* QName */Block.simpleVariant("QName", [
          param[0],
          x
        ]));
  if (x.tag) {
    return /* NoName */Block.variant("NoName", 1, [
              range,
              x[1]
            ]);
  } else {
    return /* Name */Block.variant("Name", 0, [
              range,
              x[1]
            ]);
  }
}

function moduleParts(param) {
  return param[0];
}

var component$1 = ReasonReact.statelessComponent("QName");

function make$1(value, _) {
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
            component$1[/* debugName */0],
            component$1[/* reactClassInternal */1],
            component$1[/* handedOffState */2],
            component$1[/* willReceiveProps */3],
            component$1[/* didMount */4],
            component$1[/* didUpdate */5],
            component$1[/* willUnmount */6],
            component$1[/* willUpdate */7],
            component$1[/* shouldUpdate */8],
            (function () {
                var xs = value[0];
                if (xs) {
                  return Util$AgdaMode.sepBy(".", List.map((function (n) {
                                    return ReasonReact.element(undefined, undefined, make(n, /* array */[]));
                                  }), List.filter((function (x) {
                                          return !isUnderscore(x);
                                        }))(List.append(xs, /* :: */Block.simpleVariant("::", [
                                            value[1],
                                            /* [] */0
                                          ])))));
                } else {
                  return ReasonReact.element(undefined, undefined, make(value[1], /* array */[]));
                }
              }),
            component$1[/* initialState */10],
            component$1[/* retainedProps */11],
            component$1[/* reducer */12],
            component$1[/* jsElementWrapped */13]
          ]);
}

var QName = /* module */Block.localModule([
    "toString",
    "getRange",
    "unqualify",
    "moduleParts",
    "component",
    "make"
  ], [
    toString$2,
    getRange$1,
    unqualify,
    moduleParts,
    component$1,
    make$1
  ]);

var component$2 = ReasonReact.statelessComponent("BoundName");

function isUnderscore$1(value) {
  if (toString$1(value[/* name */0]) === toString$1(value[/* label */1])) {
    return isUnderscore(value[/* name */0]);
  } else {
    return false;
  }
}

function make$2(value, _) {
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
            component$2[/* debugName */0],
            component$2[/* reactClassInternal */1],
            component$2[/* handedOffState */2],
            component$2[/* willReceiveProps */3],
            component$2[/* didMount */4],
            component$2[/* didUpdate */5],
            component$2[/* willUnmount */6],
            component$2[/* willUpdate */7],
            component$2[/* shouldUpdate */8],
            (function () {
                if (toString$1(value[/* name */0]) === toString$1(value[/* label */1])) {
                  return ReasonReact.element(undefined, undefined, make(value[/* name */0], /* array */[]));
                } else {
                  return React.createElement("span", undefined, ReasonReact.element(undefined, undefined, make(value[/* label */1], /* array */[])), "=", ReasonReact.element(undefined, undefined, make(value[/* name */0], /* array */[])));
                }
              }),
            component$2[/* initialState */10],
            component$2[/* retainedProps */11],
            component$2[/* reducer */12],
            component$2[/* jsElementWrapped */13]
          ]);
}

var BoundName = /* module */Block.localModule([
    "component",
    "isUnderscore",
    "make"
  ], [
    component$2,
    isUnderscore$1,
    make$2
  ]);

exports.NamePart = NamePart;
exports.Name = Name;
exports.QName = QName;
exports.BoundName = BoundName;
/* component Not a pure module */