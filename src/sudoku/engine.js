export function generatePuzzle(difficulty = "medium") {


    function generateFullBoard() {
        const board = Array.from({ length: 9 }, () => Array(9).fill(0));
        function shuffle(a) {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }


        function canPlace(b, r, c, n) {
            for (let i = 0; i < 9; i++) if (b[r][i] === n || b[i][c] === n) return false;
            const br = Math.floor(r / 3) * 3;
            const bc = Math.floor(c / 3) * 3;
            for (let rr = br; rr < br + 3; rr++) for (let cc = bc; cc < bc + 3; cc++) if (b[rr][cc] === n) return false;
            return true;
        }


        function backtrack(pos = 0) {
            if (pos === 81) return true;
            const r = Math.floor(pos / 9);
            const c = pos % 9;
            if (board[r][c] !== 0) return backtrack(pos + 1);


            const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            for (let n of nums) {
                if (canPlace(board, r, c, n)) {
                    board[r][c] = n;
                    if (backtrack(pos + 1)) return true;
                    board[r][c] = 0;
                }
            }
            return false;
        }


        backtrack();
        return board;
    }


    function makePuzzle(solution, difficulty) {
        const puzzle = solution.map((row) => row.slice());
        let removals;
        if (difficulty === "easy") removals = 36;
        else if (difficulty === "medium") removals = 45;
        else if (difficulty === "hard") removals = 54;
        else if (difficulty === "expert") removals = 60;
        else removals = 45;
        const positions = Array.from({ length: 81 }, (_, i) => i);


        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }


        let removed = 0;
        for (let p of positions) {
            if (removed >= removals) break;
            const r = Math.floor(p / 9);
            const c = p % 9;
            puzzle[r][c] = 0;
            removed++;
        }

        return puzzle;
    }

    // Skapa full lösning och pussel
    const solution = generateFullBoard();
    const puzzle = makePuzzle(solution, difficulty);

    // Skapa givens-array (true om siffran är given, annars false)
    const givens = puzzle.map((row, r) => row.map((cell, c) => cell !== 0));

    // Returnera objektet som appen förväntar sig
    return {
        board: puzzle.map((row) => row.slice()),
        givens,
        solution: solution.map((row) => row.slice()),
        selected: [0, 0],
    };
}