"use client";

import React, { useState, useEffect } from 'react';

export default function BingoGame() {
  const [playerBoard, setPlayerBoard] = useState([]);
  const [computerBoard, setComputerBoard] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [playerBingoCount, setPlayerBingoCount] = useState(0);
  const [computerBingoCount, setComputerBingoCount] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

  useEffect(() => {
    generateBoards();
  }, []);

  useEffect(() => {
    if (playerBoard.length === 0 || computerBoard.length === 0) return;
    checkBingoLines();
  }, [selectedNumbers]);

  const generateBoards = () => {
    const generateBoard = () => {
      let numbers = Array.from({ length: 25 }, (_, i) => i + 1);
      numbers = shuffleArray(numbers);
      const grid = [];
      for (let i = 0; i < 5; i++) {
        grid.push(numbers.slice(i * 5, i * 5 + 5));
      }
      return grid;
    };

    setPlayerBoard(generateBoard());
    setComputerBoard(generateBoard());
    setSelectedNumbers([]);
    setPlayerBingoCount(0);
    setComputerBingoCount(0);
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner("");
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handlePlayerClick = (num) => {
    if (!isPlayerTurn || selectedNumbers.includes(num) || gameOver) return;
    setSelectedNumbers((prev) => [...prev, num]);
    setIsPlayerTurn(false);
    setTimeout(computerMove, 1000);
  };

  const computerMove = () => {
    if (gameOver) return;

    let move;
    if (difficulty === "easy") {
      move = getRandomMove();
    } else if (difficulty === "medium") {
      move = getMediumMove();
    } else {
      move = getHardMove();
    }

    if (move !== null) {
      setSelectedNumbers((prev) => [...prev, move]);
    }
    setIsPlayerTurn(true);
  };

  const getRandomMove = () => {
    const availableNumbers = Array.from({ length: 25 }, (_, i) => i + 1).filter(
      (n) => !selectedNumbers.includes(n)
    );
    if (availableNumbers.length === 0) return null;
    return availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
  };

  const getMediumMove = () => {
    // Try to find rows/cols/diagonals with 4 numbers already selected
    const candidates = findCriticalNumbers(computerBoard, 4);
    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
    // Fallback to random if no critical moves
    return getRandomMove();
  };

  const getHardMove = () => {
    // First try to complete own board
    let candidates = findCriticalNumbers(computerBoard, 4);
    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }

    // Try to block player
    candidates = findCriticalNumbers(playerBoard, 4);
    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }

    return getRandomMove();
  };

  const findCriticalNumbers = (board, threshold) => {
    const critical = [];

    // Check rows
    for (let row = 0; row < 5; row++) {
      const rowNums = board[row];
      const marked = rowNums.filter((num) => selectedNumbers.includes(num));
      if (marked.length === threshold) {
        const unmarked = rowNums.filter((num) => !selectedNumbers.includes(num));
        critical.push(...unmarked);
      }
    }

    // Check columns
    for (let col = 0; col < 5; col++) {
      const colNums = [];
      for (let row = 0; row < 5; row++) {
        colNums.push(board[row][col]);
      }
      const marked = colNums.filter((num) => selectedNumbers.includes(num));
      if (marked.length === threshold) {
        const unmarked = colNums.filter((num) => !selectedNumbers.includes(num));
        critical.push(...unmarked);
      }
    }

    // Check diagonals
    const diag1 = [0, 1, 2, 3, 4].map((i) => board[i][i]);
    const diag2 = [0, 1, 2, 3, 4].map((i) => board[i][4 - i]);

    const markedDiag1 = diag1.filter((num) => selectedNumbers.includes(num));
    const markedDiag2 = diag2.filter((num) => selectedNumbers.includes(num));

    if (markedDiag1.length === threshold) {
      const unmarked = diag1.filter((num) => !selectedNumbers.includes(num));
      critical.push(...unmarked);
    }
    if (markedDiag2.length === threshold) {
      const unmarked = diag2.filter((num) => !selectedNumbers.includes(num));
      critical.push(...unmarked);
    }

    return critical;
  };

  const countBingo = (board) => {
    if (board.length !== 5 || board.some(row => row.length !== 5)) return 0;

    let count = 0;

    // Rows
    for (let row = 0; row < 5; row++) {
      if (board[row].every((num) => selectedNumbers.includes(num))) count++;
    }
    // Columns
    for (let col = 0; col < 5; col++) {
      const column = [];
      for (let row = 0; row < 5; row++) {
        column.push(board[row][col]);
      }
      if (column.every((num) => selectedNumbers.includes(num))) count++;
    }
    // Diagonals
    const diag1 = [0, 1, 2, 3, 4].map((i) => board[i][i]);
    const diag2 = [0, 1, 2, 3, 4].map((i) => board[i][4 - i]);

    if (diag1.every((num) => selectedNumbers.includes(num))) count++;
    if (diag2.every((num) => selectedNumbers.includes(num))) count++;

    return count > 5 ? 5 : count;
  };

  const checkBingoLines = () => {
    const playerCount = countBingo(playerBoard);
    const computerCount = countBingo(computerBoard);

    setPlayerBingoCount(playerCount);
    setComputerBingoCount(computerCount);

    if (playerCount >= 5 && !gameOver) {
      setGameOver(true);
      setWinner("Player");
    }
    if (computerCount >= 5 && !gameOver) {
      setGameOver(true);
      setWinner("Computer");
    }
  };

  const bingoLetters = ["B", "I", "N", "G", "O"];

  const renderBoard = (board, isPlayerView = true) => (
    <div className="grid grid-cols-5 gap-2 bg-white p-4 rounded-xl shadow-lg">
      {board.flat().map((num, index) => (
        <div
          key={index}
          onClick={() => isPlayerView && handlePlayerClick(num)}
          className={`w-16 h-16 flex items-center justify-center text-xl font-semibold rounded-lg cursor-pointer transition 
            ${
              selectedNumbers.includes(num)
                ? "bg-green-400 text-white"
                : isPlayerView
                ? "bg-blue-100 hover:bg-blue-300"
                : "bg-blue-100"
            }`}
        >
          {num}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-400">
      <h1 className="text-4xl font-bold text-white mb-4">Bingo: Player vs Computer</h1>

      {/* Difficulty selector */}
      <div className="mb-4">
        <label className="mr-2 text-white text-lg font-semibold">Select Difficulty:</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="p-2 rounded-lg text-lg"
          disabled={!gameOver && selectedNumbers.length > 0} // Lock after game starts
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="flex space-x-10">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-white">Player</h2>
          <div className="flex space-x-2 mb-4 text-3xl font-bold tracking-widest text-white">
            {bingoLetters.map((letter, index) => (
              <span
                key={index}
                className={index < playerBingoCount ? "text-green-300" : "text-white/50"}
              >
                {letter}
              </span>
            ))}
          </div>
          {renderBoard(playerBoard, true)}
        </div>

        {gameOver && (
          <div>
            <h2 className="text-2xl font-bold mb-2 text-white">Computer's Board</h2>
            <div className="flex space-x-2 mb-4 text-3xl font-bold tracking-widest text-white">
              {bingoLetters.map((letter, index) => (
                <span
                  key={index}
                  className={index < computerBingoCount ? "text-green-300" : "text-white/50"}
                >
                  {letter}
                </span>
              ))}
            </div>
            {renderBoard(computerBoard, false)}
          </div>
        )}
      </div>

      <button
        onClick={generateBoards}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Restart Game
      </button>

      {!gameOver && (
        <div className="mt-4 text-xl text-white font-semibold">
          {isPlayerTurn ? "Your Turn" : "Computer's Turn..."}
        </div>
      )}

      {gameOver && (
        <div className="mt-6 text-3xl font-bold text-white">
          🎉 {winner} Wins!
        </div>
      )}
    </div>
  );
}
