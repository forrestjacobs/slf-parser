diagram
  = dd
    firstPlayer: [BW]?
    showAxis: "c"?
    size: natural?
    startingNumber: ("m" natural)?
    _ title: $(!EOL .)* _
    northBorder: edge?
    rows: rows
    southBorder: edge?
    meta: meta*
    EOL
    { return [
      firstPlayer,
      showAxis === "c",
      size,
      startingNumber && startingNumber[1],
      title,
      northBorder !== null,
      rows[0],
      rows[1],
      rows[2],
      southBorder !== null,
      meta
    ]; }

rows
  = x: lcr+ { return [true, x, true ]; }
  / x: lc+ { return [true, x, false ]; }
  / x: cr+ { return [false, x, true ]; }
  / x: c+ { return [false, x, false ]; }

lcr = delim border _ x: cell+ border _ { return x; }
lc = delim border _ x: cell+ { return x; }
cr = delim x: cell+ border _ { return x; }
c = delim x: cell+ { return x; }

cell = x: [0-9a-z.,XOBW#@YQZPCSTM_] _ { return x; }

edge = delim (border border+) _
border = [+\-|]

meta
  = delim "[" _ x: cell "|" _ y: $(!(_ "]" EOL) .)* _ "]" _
    { return [x, y]; }
  / delim "{" _ type: ("AR" / "LN") _ start: point _ end: point _ "}" _
    { return [type, start, end]; }

point
  = x: natural ":" y: natural
    { return [x, y]; }
  / x: [A-HJ-T] y: natural
    { return [x, y]; }

natural = v: $([1-9][0-9]*) { return +v; }
delim = nl dd _
EOL = _ (nl / !.)
nl = "\r"? "\n"
dd = _ "$$"
_ = [ \t]*
