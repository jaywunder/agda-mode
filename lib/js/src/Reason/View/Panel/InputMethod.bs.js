// Generated by BUCKLESCRIPT VERSION 4.0.7, PLEASE EDIT WITH CARE
'use strict';

var Atom = require("atom");
var $$Array = require("bs-platform/lib/js/array.js");
var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Rebase = require("@glennsl/rebase/lib/js/src/Rebase.bs.js");
var Js_dict = require("bs-platform/lib/js/js_dict.js");
var ReactDOMRe = require("reason-react/lib/js/src/ReactDOMRe.js");
var ReasonReact = require("reason-react/lib/js/src/ReasonReact.js");
var Util$AgdaMode = require("../../Util.bs.js");
var Caml_primitive = require("bs-platform/lib/js/caml_primitive.js");
var Editors$AgdaMode = require("../Editors.bs.js");
var Keymap = require("./../../../asset/keymap");
var CandidateSymbols$AgdaMode = require("./CandidateSymbols.bs.js");

function toTrie(obj) {
  var symbol = (
  obj[">>"] || ""
);
  var subTrie = Js_dict.fromArray(Rebase.$$Array[/* map */0]((function (key) {
              return /* tuple */[
                      key,
                      toTrie((
    obj[key]
  ))
                    ];
            }), Rebase.$$Array[/* filter */10]((function (key) {
                  return key !== ">>";
                }), Object.keys(obj))));
  return /* record */Block.record([
            "symbol",
            "subTrie"
          ], [
            symbol,
            subTrie
          ]);
}

var keymap = toTrie(Keymap.default);

function toKeySuggestions(trie) {
  return Object.keys(trie[/* subTrie */1]);
}

function toCandidateSymbols(trie) {
  return trie[/* symbol */0];
}

function isInKeymap(input) {
  var _input = input;
  var _trie = keymap;
  while(true) {
    var trie = _trie;
    var input$1 = _input;
    var n = Rebase.$$String[/* length */1](input$1);
    if (n !== 0) {
      var key = Rebase.$$String[/* sub */9](0, 1, input$1);
      var rest = Rebase.$$String[/* sub */9](1, n - 1 | 0, input$1);
      var match = trie[/* subTrie */1][key];
      if (match !== undefined) {
        _trie = match;
        _input = rest;
        continue ;
      } else {
        return undefined;
      }
    } else {
      return trie;
    }
  };
}

function translate(input) {
  var match = isInKeymap(input);
  if (match !== undefined) {
    var trie = match;
    var keySuggestions = Object.keys(trie[/* subTrie */1]);
    var candidateSymbols = trie[/* symbol */0];
    return /* record */Block.record([
              "symbol",
              "further",
              "keySuggestions",
              "candidateSymbols"
            ], [
              Rebase.$$Array[/* get */17](candidateSymbols, 0),
              Rebase.$$Array[/* length */16](keySuggestions) !== 0,
              keySuggestions,
              candidateSymbols
            ]);
  } else {
    return /* record */Block.record([
              "symbol",
              "further",
              "keySuggestions",
              "candidateSymbols"
            ], [
              undefined,
              false,
              [],
              []
            ]);
  }
}

var initialBuffer = /* record */Block.record([
    "surface",
    "underlying"
  ], [
    "",
    ""
  ]);

var initialTranslation = translate("");

function initialState(param) {
  return /* record */Block.record([
            "activated",
            "decorations",
            "markers",
            "markersDisposable",
            "buffer",
            "translation"
          ], [
            false,
            [],
            [],
            undefined,
            initialBuffer,
            initialTranslation
          ]);
}

function markerOnDidChange(editors, $$event, self) {
  var rangeOld = new Atom.Range($$event.oldTailBufferPosition, $$event.oldHeadBufferPosition);
  var rangeNew = new Atom.Range($$event.newTailBufferPosition, $$event.newHeadBufferPosition);
  var comparison = rangeNew.compare(rangeOld);
  var textBuffer = Editors$AgdaMode.getFocusedEditor(editors).getBuffer();
  if (rangeNew.isEmpty()) {
    return Curry._1(self[/* send */3], /* Deactivate */1);
  } else {
    var surfaceBuffer = textBuffer.getTextInRange(rangeNew);
    if (surfaceBuffer !== self[/* state */1][/* buffer */4][/* surface */0]) {
      if (comparison === -1) {
        var insertedChar = textBuffer.getTextInRange(rangeNew).substr(-1);
        Curry._1(self[/* send */3], /* InsertUnderlying */Block.variant("InsertUnderlying", 0, [insertedChar]));
      }
      if (comparison === 1) {
        return Curry._1(self[/* send */3], /* Backspace */2);
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }
}

function insertActualBuffer(editors, $$char, _self) {
  var editor = Editors$AgdaMode.getFocusedEditor(editors);
  var textBuffer = editor.getBuffer();
  var getCharIndex = function (selection) {
    var start = selection.getBufferRange().start;
    return textBuffer.characterIndexForPosition(start);
  };
  var compareSelection = function (a, b) {
    var indexA = getCharIndex(a);
    var indexB = getCharIndex(b);
    return Caml_primitive.caml_int_compare(indexA, indexB);
  };
  var selections = editor.getSelections();
  $$Array.sort(compareSelection, selections);
  return Rebase.$$Array[/* forEach */8]((function (selection) {
                var range = selection.getBufferRange();
                textBuffer.setTextInRange(range, $$char);
                return /* () */0;
              }), selections);
}

function reducer(editors, onActivationChange, action, state) {
  if (typeof action === "number") {
    switch (action) {
      case 0 : 
          Curry._1(onActivationChange, true);
          var match = state[/* activated */0];
          if (match) {
            return /* SideEffects */Block.variant("SideEffects", 1, [(function (self) {
                          if (Rebase.$$String[/* isEmpty */5](state[/* buffer */4][/* underlying */1])) {
                            return Curry._1(self[/* send */3], /* Deactivate */1);
                          } else {
                            return Curry._1(self[/* send */3], /* InsertSurface */Block.variant("InsertSurface", 2, ["\\"]));
                          }
                        })]);
          } else {
            return /* UpdateWithSideEffects */Block.variant("UpdateWithSideEffects", 2, [
                      /* record */Block.record([
                          "activated",
                          "decorations",
                          "markers",
                          "markersDisposable",
                          "buffer",
                          "translation"
                        ], [
                          true,
                          state[/* decorations */1],
                          state[/* markers */2],
                          state[/* markersDisposable */3],
                          state[/* buffer */4],
                          state[/* translation */5]
                        ]),
                      (function (self) {
                          var editor = Editors$AgdaMode.getFocusedEditor(editors);
                          atom.views.getView(editor).classList.add("agda-mode-input-method-activated");
                          var markers = Rebase.$$Array[/* map */0]((function (range) {
                                  return editor.markBufferRange(range.copy());
                                }), editor.getSelectedBufferRanges());
                          var markersDisposable = Rebase.Option[/* map */0]((function (marker) {
                                  return marker.onDidChange(Curry._1(self[/* handle */0], (function (param, param$1) {
                                                    return markerOnDidChange(editors, param, param$1);
                                                  })));
                                }), Rebase.$$Array[/* get */17](markers, 0));
                          var decorations = Rebase.$$Array[/* map */0]((function (marker) {
                                  return editor.decorateMarker(marker, {
                                              type: "highlight",
                                              class: "input-method-decoration"
                                            });
                                }), markers);
                          Curry._1(self[/* send */3], /* UpdateMarkers */Block.variant("UpdateMarkers", 1, [
                                  markers,
                                  decorations,
                                  markersDisposable
                                ]));
                          return Curry._1(self[/* send */3], /* InsertSurface */Block.variant("InsertSurface", 2, ["\\"]));
                        })
                    ]);
          }
      case 1 : 
          Curry._1(onActivationChange, false);
          var match$1 = state[/* activated */0];
          if (match$1) {
            return /* UpdateWithSideEffects */Block.variant("UpdateWithSideEffects", 2, [
                      /* record */Block.record([
                          "activated",
                          "decorations",
                          "markers",
                          "markersDisposable",
                          "buffer",
                          "translation"
                        ], [
                          false,
                          state[/* decorations */1],
                          state[/* markers */2],
                          state[/* markersDisposable */3],
                          initialBuffer,
                          initialTranslation
                        ]),
                      (function (_self) {
                          atom.views.getView(Editors$AgdaMode.getFocusedEditor(editors)).classList.remove("agda-mode-input-method-activated");
                          Rebase.$$Array[/* forEach */8]((function (prim) {
                                  prim.destroy();
                                  return /* () */0;
                                }), state[/* markers */2]);
                          Rebase.$$Array[/* forEach */8]((function (prim) {
                                  prim.destroy();
                                  return /* () */0;
                                }), state[/* decorations */1]);
                          Rebase.Option[/* map */0]((function (prim) {
                                  prim.dispose();
                                  return /* () */0;
                                }), state[/* markersDisposable */3]);
                          return /* () */0;
                        })
                    ]);
          } else {
            return /* NoUpdate */0;
          }
      case 2 : 
          var init = function (s) {
            return s.substring(0, Rebase.$$String[/* length */1](s) - 1 | 0);
          };
          var surface = init(state[/* buffer */4][/* surface */0]);
          var input = init(state[/* buffer */4][/* underlying */1]);
          var translation = translate(input);
          return /* Update */Block.variant("Update", 0, [/* record */Block.record([
                        "activated",
                        "decorations",
                        "markers",
                        "markersDisposable",
                        "buffer",
                        "translation"
                      ], [
                        state[/* activated */0],
                        state[/* decorations */1],
                        state[/* markers */2],
                        state[/* markersDisposable */3],
                        Block.record([
                            "surface",
                            "underlying"
                          ], [
                            surface,
                            input
                          ]),
                        translation
                      ])]);
      
    }
  } else {
    switch (action.tag | 0) {
      case 0 : 
          var input$1 = state[/* buffer */4][/* underlying */1] + action[0];
          var translation$1 = translate(input$1);
          var match$2 = translation$1[/* symbol */0];
          if (match$2 !== undefined) {
            var symbol = match$2;
            return /* UpdateWithSideEffects */Block.variant("UpdateWithSideEffects", 2, [
                      /* record */Block.record([
                          "activated",
                          "decorations",
                          "markers",
                          "markersDisposable",
                          "buffer",
                          "translation"
                        ], [
                          state[/* activated */0],
                          state[/* decorations */1],
                          state[/* markers */2],
                          state[/* markersDisposable */3],
                          Block.record([
                              "surface",
                              "underlying"
                            ], [
                              symbol,
                              input$1
                            ]),
                          translation$1
                        ]),
                      (function (self) {
                          Curry._1(self[/* send */3], /* RewriteSurface */Block.variant("RewriteSurface", 4, [symbol]));
                          if (translation$1[/* further */1]) {
                            return 0;
                          } else {
                            return Curry._1(self[/* send */3], /* Deactivate */1);
                          }
                        })
                    ]);
          } else {
            return /* UpdateWithSideEffects */Block.variant("UpdateWithSideEffects", 2, [
                      /* record */Block.record([
                          "activated",
                          "decorations",
                          "markers",
                          "markersDisposable",
                          "buffer",
                          "translation"
                        ], [
                          state[/* activated */0],
                          state[/* decorations */1],
                          state[/* markers */2],
                          state[/* markersDisposable */3],
                          Block.record([
                              "surface",
                              "underlying"
                            ], [
                              state[/* buffer */4][/* surface */0],
                              input$1
                            ]),
                          translation$1
                        ]),
                      (function (self) {
                          if (translation$1[/* further */1]) {
                            return 0;
                          } else {
                            return Curry._1(self[/* send */3], /* Deactivate */1);
                          }
                        })
                    ]);
          }
      case 1 : 
          return /* Update */Block.variant("Update", 0, [/* record */Block.record([
                        "activated",
                        "decorations",
                        "markers",
                        "markersDisposable",
                        "buffer",
                        "translation"
                      ], [
                        state[/* activated */0],
                        action[1],
                        action[0],
                        action[2],
                        state[/* buffer */4],
                        state[/* translation */5]
                      ])]);
      case 2 : 
          var $$char = action[0];
          var init$1 = state[/* buffer */4];
          return /* UpdateWithSideEffects */Block.variant("UpdateWithSideEffects", 2, [
                    /* record */Block.record([
                        "activated",
                        "decorations",
                        "markers",
                        "markersDisposable",
                        "buffer",
                        "translation"
                      ], [
                        state[/* activated */0],
                        state[/* decorations */1],
                        state[/* markers */2],
                        state[/* markersDisposable */3],
                        Block.record([
                            "surface",
                            "underlying"
                          ], [
                            state[/* buffer */4][/* surface */0] + $$char,
                            init$1[/* underlying */1]
                          ]),
                        state[/* translation */5]
                      ]),
                    (function (param) {
                        return insertActualBuffer(editors, $$char, param);
                      })
                  ]);
      case 3 : 
          var $$char$1 = action[0];
          var init$2 = state[/* buffer */4];
          return /* UpdateWithSideEffects */Block.variant("UpdateWithSideEffects", 2, [
                    /* record */Block.record([
                        "activated",
                        "decorations",
                        "markers",
                        "markersDisposable",
                        "buffer",
                        "translation"
                      ], [
                        state[/* activated */0],
                        state[/* decorations */1],
                        state[/* markers */2],
                        state[/* markersDisposable */3],
                        Block.record([
                            "surface",
                            "underlying"
                          ], [
                            state[/* buffer */4][/* surface */0] + $$char$1,
                            init$2[/* underlying */1]
                          ]),
                        state[/* translation */5]
                      ]),
                    (function (self) {
                        insertActualBuffer(editors, $$char$1, self);
                        return Curry._1(self[/* send */3], /* InsertUnderlying */Block.variant("InsertUnderlying", 0, [$$char$1]));
                      })
                  ]);
      case 4 : 
          var string = action[0];
          var init$3 = state[/* buffer */4];
          return /* UpdateWithSideEffects */Block.variant("UpdateWithSideEffects", 2, [
                    /* record */Block.record([
                        "activated",
                        "decorations",
                        "markers",
                        "markersDisposable",
                        "buffer",
                        "translation"
                      ], [
                        state[/* activated */0],
                        state[/* decorations */1],
                        state[/* markers */2],
                        state[/* markersDisposable */3],
                        Block.record([
                            "surface",
                            "underlying"
                          ], [
                            string,
                            init$3[/* underlying */1]
                          ]),
                        state[/* translation */5]
                      ]),
                    (function (_self) {
                        return Rebase.$$Array[/* forEach */8]((function (marker) {
                                      Editors$AgdaMode.getFocusedEditor(editors).getBuffer().setTextInRange(marker.getBufferRange(), string);
                                      return /* () */0;
                                    }), state[/* markers */2]);
                      })
                  ]);
      
    }
  }
}

var component = ReasonReact.reducerComponent("InputMethod");

function make(editors, interceptAndInsertKey, activate, onActivationChange, _children) {
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
            (function (self) {
                Curry._1(interceptAndInsertKey, (function ($$char) {
                        return Curry._1(self[/* send */3], /* InsertSurfaceAndUnderlying */Block.variant("InsertSurfaceAndUnderlying", 3, [$$char]));
                      }));
                Curry._1(activate, (function (param) {
                        return Curry._1(self[/* send */3], /* Activate */0);
                      }));
                var garbages = new Atom.CompositeDisposable();
                garbages.add(atom.commands.add("atom-text-editor.agda-mode-input-method-activated", "editor:newline", (function ($$event) {
                            if (self[/* state */1][/* activated */0]) {
                              Curry._1(self[/* send */3], /* Deactivate */1);
                              $$event.stopImmediatePropagation();
                              return /* () */0;
                            } else {
                              return 0;
                            }
                          })));
                return Curry._1(self[/* onUnmount */4], (function (param) {
                              garbages.dispose();
                              return /* () */0;
                            }));
              }),
            component[/* didUpdate */5],
            component[/* willUnmount */6],
            component[/* willUpdate */7],
            component[/* shouldUpdate */8],
            (function (self) {
                var match = self[/* state */1];
                var translation = match[/* translation */5];
                var buffer = match[/* buffer */4];
                var className = Curry._1(Util$AgdaMode.React[/* toClassName */3], Util$AgdaMode.React[/* addClass */2]("hidden", !match[/* activated */0], /* :: */Block.simpleVariant("::", [
                            "input-method",
                            /* [] */0
                          ])));
                var bufferClassName = Curry._1(Util$AgdaMode.React[/* toClassName */3], Util$AgdaMode.React[/* addClass */2]("hidden", Rebase.$$String[/* isEmpty */5](buffer[/* underlying */1]), /* :: */Block.simpleVariant("::", [
                            "inline-block",
                            /* :: */Block.simpleVariant("::", [
                                "buffer",
                                /* [] */0
                              ])
                          ])));
                return React.createElement("section", {
                            className: className
                          }, React.createElement("div", {
                                className: "keyboard"
                              }, React.createElement("div", {
                                    className: bufferClassName
                                  }, buffer[/* underlying */1]), ReactDOMRe.createElementVariadic("div", {
                                    className: "keys btn-group btn-group-sm"
                                  }, Rebase.$$Array[/* map */0]((function (key) {
                                          return React.createElement("button", {
                                                      key: key,
                                                      className: "btn",
                                                      onClick: (function (param) {
                                                          return Curry._1(self[/* send */3], /* InsertSurfaceAndUnderlying */Block.variant("InsertSurfaceAndUnderlying", 3, [key]));
                                                        })
                                                    }, key);
                                        }), translation[/* keySuggestions */2]))), ReasonReact.element(undefined, undefined, CandidateSymbols$AgdaMode.make(translation[/* candidateSymbols */3], (function (replace) {
                                      if (replace !== undefined) {
                                        return Curry._1(self[/* send */3], /* RewriteSurface */Block.variant("RewriteSurface", 4, [replace]));
                                      } else {
                                        return /* () */0;
                                      }
                                    }), (function (symbol) {
                                      Curry._1(self[/* send */3], /* InsertSurfaceAndUnderlying */Block.variant("InsertSurfaceAndUnderlying", 3, [symbol]));
                                      return Curry._1(self[/* send */3], /* Deactivate */1);
                                    }), /* array */[])));
              }),
            initialState,
            component[/* retainedProps */11],
            (function (param, param$1) {
                return reducer(editors, onActivationChange, param, param$1);
              }),
            component[/* jsElementWrapped */13]
          ]);
}

var sort = $$Array.sort;

var Garbages = 0;

exports.sort = sort;
exports.toTrie = toTrie;
exports.keymap = keymap;
exports.toKeySuggestions = toKeySuggestions;
exports.toCandidateSymbols = toCandidateSymbols;
exports.isInKeymap = isInKeymap;
exports.translate = translate;
exports.Garbages = Garbages;
exports.initialBuffer = initialBuffer;
exports.initialTranslation = initialTranslation;
exports.initialState = initialState;
exports.markerOnDidChange = markerOnDidChange;
exports.insertActualBuffer = insertActualBuffer;
exports.reducer = reducer;
exports.component = component;
exports.make = make;
/* keymap Not a pure module */