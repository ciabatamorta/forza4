document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("game-board");
    const message = document.getElementById("message");
    const resetButton = document.getElementById("reset-button");

    const redWinsElement = document.getElementById("red-wins");
    const yellowWinsElement = document.getElementById("yellow-wins");
    const totalGamesElement = document.getElementById("total-games");

    const rows = 6;
    const cols = 7;
    let currentPlayer = "red";
    let board = Array.from({ length: rows }, () => Array(cols).fill(null));
    let gameActive = true;

    const updateStats = () => {
        const redWins = localStorage.getItem("redWins") || 0;
        const yellowWins = localStorage.getItem("yellowWins") || 0;
        const totalGames = localStorage.getItem("totalGames") || 0;

        redWinsElement.textContent = `Vittorie di RED: ${redWins}`;
        yellowWinsElement.textContent = `Vittorie di YELLOW: ${yellowWins}`;
        totalGamesElement.textContent = `Giochi totali: ${totalGames}`;
    };

    const incrementStat = (stat) => {
        const value = parseInt(localStorage.getItem(stat) || "0") + 1;
        localStorage.setItem(stat, value);
        updateStats();
    };

    const resetBoard = () => {
        board = Array.from({ length: rows }, () => Array(cols).fill(null));
        currentPlayer = "red";
        gameActive = true;
        message.textContent = "RED's turn";
        createBoard();
    };

    const createBoard = () => {
        gameBoard.innerHTML = "";
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener("click", handleCellClick);
                gameBoard.appendChild(cell);
            }
        }
    };

    const handleCellClick = (event) => {
        if (!gameActive) return;

        const col = parseInt(event.target.dataset.col);
        for (let row = rows - 1; row >= 0; row--) {
            if (!board[row][col]) {
                board[row][col] = currentPlayer;
                const cell = document.querySelector(
                    `.cell[data-row="${row}"][data-col="${col}"]`
                );
                
                cell.classList.add(currentPlayer);
                if (checkWinner(row, col)) {
                    message.textContent = `${currentPlayer.toUpperCase()} wins!`;
                    incrementStat(currentPlayer + "Wins");
                    incrementStat("totalGames");
                    gameActive = false;
                } else if (board.flat().every((cell) => cell)) { // tutte le celle sono diverse da null
                    message.textContent = "It's a draw!";
                    incrementStat("totalGames");
                    gameActive = false;
                } else {
                    currentPlayer = currentPlayer === "red" ? "yellow" : "red";
                    message.textContent = `${currentPlayer.toUpperCase()}'s turn`;
                }
                break;
            }
        }
    };


    const checkWinner = (row, col) => {
        const directions = [
            { x: 1, y: 0 }, // horizontal
            { x: 0, y: 1 }, // vertical
            { x: 1, y: 1 }, // diagonal down-right
            { x: 1, y: -1 } // diagonal down-left
        ];

        for (const { x, y } of directions) {
            let count = 1;
            count += countInDirection(row, col, x, y);
            count += countInDirection(row, col, -x, -y);
            if (count >= 4) return true;
        }

        return false;
    };

    const countInDirection = (row, col, x, y) => {
        let count = 0;
        let r = row + x;
        let c = col + y;
        while (
            r >= 0 &&
            r < rows &&
            c >= 0 &&
            c < cols &&
            board[r][c] === currentPlayer
        ) {
            count++;
            r += x;
            c += y;
        }
        return count;
    };

    resetButton.addEventListener("click", resetBoard);

    updateStats();
    createBoard();
});
