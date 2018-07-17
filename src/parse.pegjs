diagram
  = dd
    startingNumber: startingNumber?
    _ title: $(!EOL .)* _
    northBorder: edge?
    rows: row+
    southBorder: edge?
    EOL
    { return {
      startingNumber: startingNumber,
      title: title,
      northBorder: northBorder !== null,
      rows: rows,
      southBorder: southBorder !== null
    }; }

startingNumber = "m" v: natural { return v; }

row
  = delim westBorder: border? _ cells: cell+ eastBorder: border? _
    { return { westBorder: westBorder != null, cells: cells, eastBorder: eastBorder != null }; }

cell = v: [0-9a-z.,XOBW#@YQZPCSTM_] _ { return v; }

edge = delim (border border+) _
border = [+\-|]

natural = v: $([1-9][0-9]*) { return +v; }
delim = nl dd _
EOL = _ (nl / !.)
nl = "\r"? "\n"
dd = _ "$$"
_ = [ \t]*
