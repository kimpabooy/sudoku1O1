import React, { useEffect } from "react";

export default function Controls({ game, setGame, startNew }) {
  const [r, c] = game.selected;

  const playClick = () => {
    const audio = new Audio("/sounds/click.mp3");
    audio.play();
  };

  const enterValue = (num, playSound = true) => {
    if (r == null || c == null) return;
    if (game.givens[r][c]) return;
    if (playSound) playClick();
    const board = game.board.map((row) => row.slice());
    // Om samma siffra trycks igen, rensa cellen
    if (board[r][c] === num) {
      board[r][c] = 0;
    } else {
      board[r][c] = num;
    }
    setGame({ ...game, board });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Siffror 1-9 på tangentbordet
      if (e.key >= "1" && e.key <= "9") {
        enterValue(Number(e.key), true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [r, c, game.givens, game.board]);

  return (
    <div
      style={{
        marginTop: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "100%",
        }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <button key={i} onClick={() => enterValue(i + 1, true)}>
            {i + 1}
          </button>
        ))}
        <button onClick={() => enterValue(0, true)}>Clear</button>
      </div>
      <div
        style={{
          marginTop: 16,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "100%",
        }}
      >
        <button onClick={() => startNew("easy")}>New Easy</button>
        <button onClick={() => startNew("medium")}>New Medium</button>
        <button onClick={() => startNew("hard")}>New Hard</button>
        <button onClick={() => startNew("expert")}>New Expert</button>
        <button onClick={() => startNew("debugg")}>New Debugg</button>
      </div>
    </div>
  );
}
