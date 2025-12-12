import React from "react";

export default function Cell({
  r,
  c,
  value,
  given,
  selected,
  correctValue, // används ej längre för styling
  selectCell,
  setValue,
  className = "",
  markedValue,
  board,
}) {
  let cellClass = "sudoku-cell";
  if (given) cellClass += " given";
  if (selected) cellClass += " selected";
  if (className) cellClass += className;

  // Markera alla celler med samma siffra
  if (markedValue && value === markedValue && value !== 0) {
    cellClass += " highlight-number";
  }

  // Kontrollera om denna cell bryter mot sudoku-regler (om den inte är tom och inte given)
  let isConflict = false;
  if (!given && value !== 0 && board) {
    // Kolla rad och kolumn
    for (let i = 0; i < 9; i++) {
      if (i !== c && board[r][i] === value) isConflict = true;
      if (i !== r && board[i][c] === value) isConflict = true;
    }
    // Kolla 3x3-block
    const blockRow = Math.floor(r / 3) * 3;
    const blockCol = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const rr = blockRow + i;
        const cc = blockCol + j;
        if ((rr !== r || cc !== c) && board[rr][cc] === value)
          isConflict = true;
      }
    }
    if (isConflict) cellClass += " conflict";
  }

  const handleClick = () => selectCell(r, c);

  return (
    <div className={cellClass} onClick={handleClick}>
      {value !== 0 ? value : ""}
    </div>
  );
}
