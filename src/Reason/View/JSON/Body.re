open ReasonReact;

let component = ReasonReact.statelessComponent("JSONBody");

let make =
    (
      ~raw,
      ~emacs,
      ~maxBodyHeight,
      ~useJSON,
      ~hidden,
      ~mountAtBottom,
      ~emit,
      _children,
    ) => {
  ...component,
  render: _self => {
    let comp =
      if (useJSON) {
        switch (Decoder.parseBody(raw)) {
        | AllGoalsWarnings(value) => <AllGoalsWarnings value />
        | Error(value, rawString) => <Error value rawString />
        | PlainText(s) => <p> (string(s)) </p>
        };
      } else {
        let parsed = Emacs.Parser.body(emacs);
        let header = parsed.header;
        let body = parsed.body;
        switch (parsed.kind) {
        | AllGoalsWarnings => <EmacsAllGoalsWarnings header body />
        | GoalTypeContext => <EmacsGoalTypeContext body />
        | Constraints => <EmacsConstraints body />
        | PlainText => <p> (string(body)) </p>
        };
      };
    let className =
      hidden ?
        ["agda-body", "native-key-bindings", "hidden"] |> String.concat(" ") :
        ["agda-body", "native-key-bindings"] |> String.concat(" ");
    let style =
      mountAtBottom ?
        Some(
          ReactDOMRe.Style.make(
            ~maxHeight=string_of_int(maxBodyHeight) ++ "px",
            (),
          ),
        ) :
        None;
    <Context.Emitter.Provider value=emit>
      <section className ?style tabIndex=(-1)> comp </section>
    </Context.Emitter.Provider>;
  },
};

[@bs.deriving abstract]
type jsProps = {
  raw: Type.Interaction.bodyRaw,
  emacs: Type.Interaction.Emacs.bodyRaw,
  maxBodyHeight: int,
  hidden: bool,
  useJSON: bool,
  mountAtBottom: bool,
  emit: (string, Type.Syntax.Position.range) => unit,
};

let jsComponent =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(
      ~raw=rawGet(jsProps),
      ~emacs=emacsGet(jsProps),
      ~maxBodyHeight=maxBodyHeightGet(jsProps),
      ~hidden=hiddenGet(jsProps),
      ~useJSON=useJSONGet(jsProps),
      ~mountAtBottom=mountAtBottomGet(jsProps),
      ~emit=emitGet(jsProps),
      [||],
    )
  );