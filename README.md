# slf-parser

A Node library for parsing Go diagrams in [Sensei's Library Format](https://senseis.xmp.net/?HowDiagramsWork).

## Example

```javascript
import { toBoard } from "slf-parser";

const diagram =
`$$ A joseki variation
 $$  ------------------
 $$ | . . . . . . . . .
 $$ | . . . . . . . . .
 $$ | . . 7 3 X d . . .
 $$ | . . O 1 O 6 . . .
 $$ | . . 4 2 5 c . . .
 $$ | . . 8 X a . . . .
 $$ | . . . b . . . . .
 $$ | . . . . . . . . .
 $$ | . . . . . . . . .`;

const board = toBoard(diagram);

console.log(board.title);       // "A joseki variation"
console.log(board.cells[2][2]); // { type: "black", label: "7" }
console.log(board.axis.x);      // { labels: "ABCDEFGHJ", position: "north" }
console.log(board.axis.y);      // { labels: [19, 18, 17, 16, 15, 14, 13, 12, 11], position:  "west" }
console.log(board.borders);     // { north: true, east: false, south: false, west: true }
```

---

## API

### `toBoard(slfString: string): Board`

Parses a diagram in [Sensei's Library Format](https://senseis.xmp.net/?HowDiagramsWork), returning a `Board` object.

```javascript
import {toBoard} from "./slf-parser";
const board = toBoard("..."); // => Board object
```

#### `Board` object

Property             | Description
---------------------|-------------
**`title`**          | The title of the board. Undefined if not applicable.
**`cells[row][col]`**| A 2D array of cells on the board's grid, starting on the north east corner.
`cells[][].type`     | The type of cell: `"black"` for a black stone, `"white"` for a white stone, `"intersection"` for an intersection with no stone, `"star"` for a star point/hoshi with no stone, or `"empty"` for an intersection with no grid.
`cells[][].label`    | A 1 character string label drawn on the cell. Undefined if not applicable. Cells can't have both a `label` and a `mark`.
`cells[][].link`     | The URL that the cell links to. Undefined if not applicable.
`cells[][].mark`     | The shape to draw on the cell: `"circle"`, `"cross"`, `"square"`, or `"triangle"`. Undefined if not applicable. Cells can't have both a `label` and a `mark`.
**`lines[i]`**       | An array of lines on the board's grid. Undefined if there are no lines.
`lines[].type`       | Either `"line"` or `"arrow"`. If `"arrow"`, the line ends in an arrow head shape.
`lines[].start.row`  | The line's starting row.
`lines[].start.col`  | The line's starting column.
`lines[].end.row`    | The line's ending row.
`lines[].end.col`    | The line's ending column.
**`borders`**        | An object specifying which edges have borders.
`borders.north`      | Whether the north edge has a border.
`borders.east`       | Whether the east edge has a border.
`borders.south`      | Whether the south edge has a border.
`borders.west`       | Whether the west edge has a border.
**`axes`**           | An object describing the axes/coordinate labels. Undefined if the axes are hidden.
`axes.x.labels`      | Labels for the x-axis, starting from the west. Each character in the string is a label.
`axes.x.position`    | Where to show the x-axis: either `"north"` or `"south"`.
`axes.y.labels`      | An array of labels for the y-axis, starting from the north. Each element is a number.
`axes.y.position`    | Where to show the y-axis: either `"east"` or `"west"`.
