import "./style/General.css";
import "./style/Board.css";
import { useState, useEffect } from "react";
import Board from "./components/Board";
import Controls from "./components/Controls";
import { generatePuzzle } from "./sudoku/engine";

export default function App() {
  const [game, setGame] = useState(generatePuzzle("medium"));
  const [checkResult, setCheckResult] = useState(null); // null | true | false

  // Tangentbordsstöd: fyll i markerad cell med 1-9
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!game.selected || game.selected.length !== 2) return;
      const [r, c] = game.selected;
      if (game.givens[r][c]) return;
      if (e.key >= "1" && e.key <= "9") {
        const num = parseInt(e.key, 10);
        const board = game.board.map((row) => row.slice());
        // Om samma siffra trycks igen, rensa cellen
        if (board[r][c] === num) {
          board[r][c] = 0;
        } else {
          board[r][c] = num;
        }
        setGame({ ...game, board });
      }
      if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
        const board = game.board.map((row) => row.slice());
        board[r][c] = 0;
        setGame({ ...game, board });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [game]);

  const startNew = (difficulty) => {
    setGame(generatePuzzle(difficulty));
    setCheckResult(null);
  };

  // Kolla om brädet är fullt
  const isFull = game.board.flat().every((v) => v !== 0);

  // Kolla om brädet är rätt
  const checkSudoku = () => {
    let correct = true;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (game.board[r][c] !== game.solution[r][c]) {
          correct = false;
          break;
        }
      }
      if (!correct) break;
    }
    setCheckResult(correct);
  };

  return (
    <div className="sudoku-container">
      <div className="sudoku-app-wrapper">
        <h1>Sudoku1O1</h1>
        <Board game={game} setGame={setGame} />
        <Controls game={game} setGame={setGame} startNew={startNew} />
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button
            className="check-btn"
            onClick={checkSudoku}
            disabled={!isFull}
          >
            Rätta
          </button>
          {checkResult === true && (
            <div
              style={{
                color: "#388e3c",
                fontWeight: 600,
                fontSize: "1.2em",
                marginTop: 8,
              }}
            >
              Grattis! Allt är rätt!
            </div>
          )}
          {checkResult === false && (
            <div
              style={{
                color: "#b71c1c",
                fontWeight: 600,
                fontSize: "1.2em",
                marginTop: 8,
              }}
            >
              Tyvärr, något är fel.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
