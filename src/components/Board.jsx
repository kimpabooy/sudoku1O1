import React from "react";
import Cell from "./Cell";

export default function Board({ game, setGame }) {
  const selectCell = (row, col) => {
    setGame({ ...game, selected: [row, col] });
  };

  const setValue = (row, col, val) => {
    if (game.givens[row][col]) return;
    const board = game.board.map((row) => row.slice());
    board[row][col] = val;
    setGame({ ...game, board });
  };

  // Hitta markerad siffra (från markerad cell)
  let markedValue = null;
  if (game.selected && game.selected.length === 2) {
    const [selRow, selCol] = game.selected;
    markedValue = game.board[selRow][selCol];
  }

  return (
    <div className="sudoku-board-wrapper">
      <div className="sudoku-board">
        {game.board.map((row, r) =>
          row.map((value, c) => {
            // Lägg till block-klasser för att markera 3x3-rutor
            let blockClass = "";
            if (r === 3 || r === 6) blockClass += " block-top";
            if (c === 3 || c === 6) blockClass += " block-left";
            if (r === 0) blockClass += " block-top";
            if (c === 0) blockClass += " block-left";
            if (r === 8) blockClass += " block-bottom";
            if (c === 8) blockClass += " block-right";
            return (
              <Cell
                key={`${r}-${c}`}
                r={r}
                c={c}
                value={value}
                given={game.givens[r][c]}
                selected={game.selected[0] === r && game.selected[1] === c}
                correctValue={game.solution[r][c]}
                selectCell={selectCell}
                setValue={setValue}
                className={blockClass}
                markedValue={markedValue}
                board={game.board}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
