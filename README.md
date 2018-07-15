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
console.log(board.axis.x);      // { start: "A", position: "north" }
console.log(board.borders);     // { north: true, east: false, south: false, west: true }
```
