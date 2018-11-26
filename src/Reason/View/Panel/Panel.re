open ReasonReact;

type state = {
  header: Type.Interaction.header,
  hidden: bool,
  isPending: bool,
  settingsViewOn: bool,
  mountAt: string,
};

type jsState = {
  .
  "text": string,
  "style": string,
  "hidden": bool,
  "isPending": bool,
  "settingsViewOn": bool,
  "mountAt": string,
};

type action =
  | UpdateHeader(Type.Interaction.header)
  | UpdateIsPending(bool);

let initialState = () => {
  header: {
    text: "",
    style: "",
  },
  hidden: false,
  isPending: false,
  settingsViewOn: false,
  mountAt: "bottom",
};

let reducer = (action, state) =>
  switch (action) {
  | UpdateHeader(header) => Update({...state, header})
  | UpdateIsPending(isPending) => Update({...state, isPending})
  };

let component = reducerComponent("Panel");

let make =
    /* <Dashboard> */
    (
      ~updateHeader: (jsState => unit) => unit,
      ~updateIsPending: (jsState => unit) => unit,
      ~onMountChange: string => unit,
      ~onSettingsViewToggle: bool => unit,
      _children,
    ) => {
  ...component,
  initialState,
  reducer,
  render: self => {
    let {header, hidden, isPending, mountAt, settingsViewOn} = self.state;
    updateHeader(state =>
      self.send(UpdateHeader({text: state##text, style: state##style}))
    );
    updateIsPending(state => self.send(UpdateIsPending(state##isPending)));
    <section>
      <section className="panel-heading agda-header-container">
        <Dashboard
          header
          hidden
          isPending
          mountAt
          onMountChange
          settingsViewOn
          onSettingsViewToggle
        />
      </section>
    </section>;
  },
};

[@bs.deriving abstract]
type jsProps = {
  updateHeader: (jsState => unit) => unit,
  updateIsPending: (jsState => unit) => unit,
  onMountChange: string => unit,
  onSettingsViewToggle: bool => unit,
};

let jsComponent =
  wrapReasonForJs(~component, jsProps =>
    make(
      ~updateHeader=updateHeaderGet(jsProps),
      ~updateIsPending=updateIsPendingGet(jsProps),
      ~onMountChange=onMountChangeGet(jsProps),
      ~onSettingsViewToggle=onSettingsViewToggleGet(jsProps),
      [||],
    )
  );
