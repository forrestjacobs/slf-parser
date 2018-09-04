import { LinkMetaItem, LinkMetaItemIndex, ParseTree, ParseTreeIndex } from "./parse-tree";

export function validate(tree: ParseTree): string[] {
  const issues: string[] = [];

  const links = tree[ParseTreeIndex.Meta].filter((item) => item.length === 2) as LinkMetaItem[];
  addLinkIssues(issues, tree, links);

  // todo: line on board

  if (tree[ParseTreeIndex.ShowAxis]) {
    addAxisIssues(issues, tree);
  }

  if (tree[ParseTreeIndex.Size] !== undefined) {
    addSizeIssues(issues, tree);
  }

  return issues;
}

// todo: same link twice
function addLinkIssues(issues: string[], tree: ParseTree, links: LinkMetaItem[]) {
  const rows = tree[ParseTreeIndex.Rows];
  for (const link of links) {
    const cell = link[LinkMetaItemIndex.Cell];
    if (!rows.some((row) => row.indexOf(cell) !== -1)) {
      issues.push(`Link "${cell}" not on board`);
    }
  }
}

function addAxisIssues(issues: string[], tree: ParseTree): void {
  if ((tree[ParseTreeIndex.Size] || 0) > 19 || tree[ParseTreeIndex.Rows][0].length > 19) {
    issues.push("Cannot show axis when the board's width is greater than 19");
  }

  if (!tree[ParseTreeIndex.NorthBorder] && !tree[ParseTreeIndex.SouthBorder]) {
    issues.push("Must set a north or south border to show the axis");
  }

  if (!tree[ParseTreeIndex.WestBorder] && !tree[ParseTreeIndex.EastBorder]) {
    issues.push("Must set a east or west border to show the axis");
  }
}

function addSizeIssues(issues: string[], tree: ParseTree): void {
  const size = tree[ParseTreeIndex.Size] as number;
  const rows = tree[ParseTreeIndex.Rows];

  const numRows = rows.length;
  const numCols = rows[0].length;

  if (tree[ParseTreeIndex.NorthBorder] && tree[ParseTreeIndex.SouthBorder] && size !== numRows) {
    issues.push(`The board's height, ${numRows}, is different than the set size ${size}`);
  } else if (size < numRows) {
    issues.push(`The board's height, ${numRows}, is taller than the set size ${size}`);
  }

  if (tree[ParseTreeIndex.WestBorder] && tree[ParseTreeIndex.EastBorder] && size !== numCols) {
    issues.push(`The board's width, ${numCols}, is different than the set size ${size}`);
  } else if (size < numCols) {
    issues.push(`The board's width, ${numCols}, is wider than the set size ${size}`);
  }
}
