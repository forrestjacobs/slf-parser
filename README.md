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
