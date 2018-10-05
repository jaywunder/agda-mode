open ReasonReact;

open Type.Interaction.Emacs;

let component = ReasonReact.statelessComponent("EmacsExpr");

let make = (~expr: expr, _children) => {
  ...component,
  render: _self =>
    expr
    |> Array.map(term => <EmacsTerm term />)
    |> (terms => <span> ...terms </span>),
};
