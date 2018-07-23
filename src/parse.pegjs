diagram
  = dd
    firstPlayer: [BW]?
    showAxis: "c"?
    size: natural?
    startingNumber: ("m" natural)?
    _ title: $(!EOL .)* _
    northBorder: edge?
    rows: row+
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
      rows,
      southBorder !== null,
      meta
    ]; }

row
  = delim westBorder: border? _ cells: cell+ eastBorder: border? _
    { return [westBorder != null, cells, eastBorder != null]; }

cell = v: [0-9a-z.,XOBW#@YQZPCSTM_] _ { return v; }

edge = delim (border border+) _
border = [+\-|]

meta
  = delim "[" _ cell: cell "|" _ href: $(!(_ "]" EOL) .)* _ "]" _
    { return [cell, href]; }
  / delim "{" _ type: ("AR" / "LN") _ start: point _ end: point _ "}" _
    { return [type, start, end]; }

point
  = col: natural ":" row: natural
    { return [row, col]; }
  / col: [A-HJ-T] row: natural
    { return [row, col]; }

natural = v: $([1-9][0-9]*) { return +v; }
delim = nl dd _
EOL = _ (nl / !.)
nl = "\r"? "\n"
dd = _ "$$"
_ = [ \t]*
