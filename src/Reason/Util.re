open ReasonReact;

open Rebase;

let sepBy = (sep: reactElement, item: list(reactElement)) =>
  switch (item) {
  | [] => <> </>
  | [x] => x
  | [x, ...xs] =>
    <span>
      ...(Array.fromList([x, ...List.map(i => <> sep i </>, xs)]))
    </span>
  };

let enclosedBy = (front: reactElement, back: reactElement, item: reactElement) =>
  <> front (string(" ")) item (string(" ")) back </>;

let addClass = (x: string, p: bool, xs: list(string)) : list(string) =>
  p ? [x, ...xs] : xs;

let toClassName = String.joinWith(" ");

module Array_ = {
  let catMaybes = xs =>
    Array.reduceRight(
      (acc, x) =>
        switch (x) {
        | Some(v) => [v, ...acc]
        | None => acc
        },
      [],
      xs,
    )
    |> Array.fromList;
  let partite = (p: 'a => bool, xs: array('a)) : array(array('a)) => {
    let indices: array(int) =
      xs
      |> Array.mapi((x, i) => (x, i))  /* zip with index */
      |> Array.filter(((x, _)) => p(x))  /* filter bad indices out */
      |> Array.map(snd); /* leave only the indices */
    /* prepend 0 as the first index */
    let indicesWF: array(int) =
      switch (indices[0]) {
      | Some(n) => n === 0 ? indices : Array.concat(indices, [|0|])
      | None => Array.length(indices) === 0 ? [|0|] : indices
      };
    let intervals: array((int, int)) =
      indicesWF
      |> Array.mapi((index, n) =>
           switch (indicesWF[n + 1]) {
           | Some(next) => (index, next)
           | None => (index, Array.length(xs))
           }
         );
    intervals |> Array.map(((from, to_)) => xs |> Array.slice(~from, ~to_));
  };
  let mergeWithNext:
    (array('a) => bool, array(array('a))) => array(array('a)) =
    p =>
      Array.reduce(
        (acc, x) => {
          let last = acc[Array.length(acc) - 1];
          switch (last) {
          | None => [|x|]
          | Some(l) =>
            if (p(l)) {
              acc[Array.length(acc) - 1] = Array.concat(x, l);
              acc;
            } else {
              Array.concat([|x|], acc);
            }
          };
        },
        [||],
      );
};

module Dict = {
  open Js.Dict;
  let partite =
      (tagEntry: (('a, int)) => option(string), xs: array('a))
      : t(array('a)) => {
    let keys: array((key, int)) =
      xs
      |> Array.mapi((x, i) => (x, i))  /* zip with index */
      |> Array.filterMap(((x, i)) =>
           tagEntry((x, i)) |> Option.map(key => (key, i))
         );
    let intervals: array((key, int, int)) =
      keys
      |> Array.mapi(((key, index), n) =>
           switch (keys[n + 1]) {
           | Some((_, next)) => (key, index, next)
           | None => (key, index, Array.length(xs))
           }
         );
    intervals
    |> Array.map(((key, from, to_)) =>
         (key, xs |> Array.slice(~from, ~to_))
       )
    |> fromArray;
  };
  /* split an entry */
  let split =
      (key: key, splitter: 'a => t('a), dict: t('a))
      : t(array(string)) =>
    switch (get(dict, key)) {
    | Some(value) =>
      /* insert new entries */
      entries(splitter(value))
      |> Array.forEach(((k, v)) => set(dict, k, v));
      dict;
    | None => dict
    };
  let update = (key: key, f: 'a => 'a, dict: t('a)) : t('a) =>
    switch (get(dict, key)) {
    | Some(value) =>
      set(dict, key, f(value));
      dict;
    | None => dict
    };
};

module Parser = {
  /* open Option; */
  let captures = (re: Js.Re.t, x: string) : option(array(option(string))) =>
    Js.Re.exec(x, re)
    |> Option.map(result =>
         result |> Js.Re.captures |> Array.map(Js.Nullable.toOption)
       );
  type parser('a) =
    | Regex(Js.Re.t, array(option(string)) => option('a))
    | String(string => option('a));
  let parse = (parser: parser('a), raw: string) : option('a) =>
    switch (parser) {
    | Regex(re, handler) => captures(re, raw) |> Option.flatMap(handler)
    | String(handler) => handler(raw)
    };
  let parseArray = (parser: parser('a), xs: array(string)) : array('a) =>
    xs |> Array.map(raw => raw |> parse(parser)) |> Array_.catMaybes;
  let at =
      (i: int, parser: parser('a), captured: array(option(string)))
      : option('a) =>
    if (i >= Array.length(captured)) {
      None;
    } else {
      Option.flatten(captured[i]) |> Option.flatMap(parse(parser));
    };
  let choice = (res: array(parser('a))) =>
    String(
      raw =>
        Array.reduce(
          (result, parser) =>
            switch (result) {
            /* Done, pass it on */
            | Some(value) => Some(value)
            /* Failed, try this one */
            | None => parse(parser, raw)
            },
          None,
          res,
        ),
    );
};

module List_ = {
  let sepBy = (sep: 'a, item: list('a)) : list('a) =>
    switch (item) {
    | [] => []
    | [x, ...xs] => [x, ...xs |> List.flatMap(i => [sep, i])]
    };
  let rec init = xs =>
    switch (xs) {
    | [] => failwith("init on empty list")
    | [_] => []
    | [x, ...xs] => [x, ...init(xs)]
    };
  let rec last = xs =>
    switch (xs) {
    | [] => failwith("last on empty list")
    | [x] => x
    | [_, ...xs] => last(xs)
    };
  let rec span = (p, xs) =>
    switch (xs) {
    | [] => ([], [])
    | [x, ...xs] =>
      if (p(x)) {
        let (ys, zs) = span(p, xs);
        ([x, ...ys], zs);
      } else {
        ([], xs);
      }
    };
  let rec dropWhile = (p, xs) =>
    switch (xs) {
    | [] => []
    | [x, ...xs] =>
      if (p(x)) {
        dropWhile(p, xs);
      } else {
        [x, ...xs];
      }
    };
};
