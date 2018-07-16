diagram
  = dd rows: row+ EOL
    { return { rows: rows }; }

row
  = delim cells: cell+
    { return { cells: cells }; }

cell = v: [0-9a-z.,XOBW#@YQZPCSTM_] _ { return v; }

delim = nl dd _
EOL = _ (nl / !.)
nl = "\r"? "\n"
dd = _ "$$"
_ = [ \t]*
