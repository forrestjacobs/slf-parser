diagram
  = dd
    firstPlayer: [BW]?
    showAxis: "c"?
    size: natural?
    startingNumber: startingNumber?
    _ title: $(!EOL .)* _
    northBorder: edge?
    rows: row+
    southBorder: edge?
    meta: meta*
    EOL
    { return {
      firstPlayer: firstPlayer,
      showAxis: showAxis === "c",
      size: size,
      startingNumber: startingNumber,
      title: title,
      northBorder: northBorder !== null,
      rows: rows,
      southBorder: southBorder !== null,
      meta: meta
    }; }

startingNumber = "m" v: natural { return v; }

row
  = delim westBorder: border? _ cells: cell+ eastBorder: border? _
    { return { westBorder: westBorder != null, cells: cells, eastBorder: eastBorder != null }; }

cell = v: [0-9a-z.,XOBW#@YQZPCSTM_] _ { return v; }

edge = delim (border border+) _
border = [+\-|]

meta = link / line
link
  = delim "[" _ cell: cell "|" _ href: $(!(_ "]" EOL) .)* _ "]" _
    { return {type: "link", cell: cell, href: href}; }

line
  = delim "{" _ type: ("AR" / "LN") _ start: point _ end: point _ "}" _
    { return {type: type, start: start, end: end}; }

point
  = col: natural ":" row: natural
    { return {type: 0 /* absolute */, row: row, col: col}; }
  / col: [A-HJ-T] row: natural
    { return {type: 1 /* board */, row: row, col: col}; }

natural = v: $([1-9][0-9]*) { return +v; }
delim = nl dd _
EOL = _ (nl / !.)
nl = "\r"? "\n"
dd = _ "$$"
_ = [ \t]*
