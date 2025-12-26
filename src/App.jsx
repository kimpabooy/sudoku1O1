import "./style/General.css";
import "./style/Board.css";
import { useState, useEffect } from "react";
import Board from "./components/Board";
import Controls from "./components/Controls";
import { generatePuzzle } from "./sudoku/engine";

export default function App() {
  const RAW_CODE = "C25G03AAA0AB7C0524B"; // 0 represents a space
  const ACTIVATION_URL = "https://example.com/activate"; // TODO: replace with your activation page URL
  const [game, setGame] = useState(generatePuzzle("medium"));
  const [checkResult, setCheckResult] = useState(null); // null | true | false
  const [codeInput, setCodeInput] = useState("");
  const [codeStatus, setCodeStatus] = useState(null); // null | 'ok' | 'wrong'

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

  const handleCodeCheck = () => {
    const normalized = codeInput
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "0");
    setCodeStatus(normalized === RAW_CODE ? "ok" : "wrong");
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
                marginBottom: 16,
              }}
            >
              Grattis! Allt är rätt!
              <p>
                I sudokuns värld finns regler att följa,  
                från <b>1</b> till <b>9</b>, varken mera, eller mindre.
              </p>

              <p>
                När siffror inte räcker för att allt ska bli rätt,  
                får bokstäver hjälpa till, så mönstret blir komplett.
              </p>

              <p>
                Där något bryter ordning i sudokuns värld, låt rummet stå kvar,  
                och samla den funna koden, nu fyra i rad.
              </p>

              <p><strong>C25G03AAA0AB7C0524B</strong></p>

              <div style={{ marginTop: 12 }}>
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Ange din kod här..."
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    maxWidth: 360,
                    width: "100%",
                  }}
                />
                <div style={{ marginTop: 8 }}>
                  <button className="check-btn" onClick={handleCodeCheck}>
                    Verifiera
                  </button>
                </div>
                {codeStatus === "ok" && (
                  <div style={{ marginTop: 10 }}>
                    <span style={{ color: "#2e7d32" }}>Koden är korrekt!</span>
                    <div style={{ marginTop: 6 }}>
                      <a
                        href={`${ACTIVATION_URL}?code=${encodeURIComponent(codeInput.trim())}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: "underline" }}
                      >
                        Gå vidare
                      </a>
                    </div>
                  </div>
                )}
                {codeStatus === "wrong" && (
                  <div style={{ marginTop: 10, color: "#b71c1c" }}>
                    Fel kod. Kontrollera grupperingen.
                  </div>
                )}
              </div>
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
              <p>Kom ihåg: I sudoku finns ingen finns bara siffrorna 1-9</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
