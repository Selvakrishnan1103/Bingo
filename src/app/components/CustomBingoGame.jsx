"use client";

import React, { useState, useEffect } from 'react';

export default function CustomBingoGame() {
  const [playerInputs, setPlayerInputs] = useState(Array(25).fill(""));
  const [playerBoard, setPlayerBoard] = useState([]);
  const [computerBoard, setComputerBoard] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [playerBingoCount, setPlayerBingoCount] = useState(0);
  const [computerBingoCount, setComputerBingoCount] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");
  const [setupPhase, setSetupPhase] = useState(true);

  const bingoLetters = ["B", "I", "N", "G", "O"];

  useEffect(() => {
    if (playerBoard.length === 0 || computerBoard.length === 0) return;
    checkBingoLines();
  }, [selectedNumbers]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateComputerBoard = () => {
    let numbers = Array.from({ length: 25 }, (_, i) => i + 1);
    numbers = shuffleArray(numbers);
    const grid = [];
    for (let i = 0; i < 5; i++) {
      grid.push(numbers.slice(i * 5, i * 5 + 5));
    }
    return grid;
  };

  const startGame = () => {
    const nums = playerInputs.map((val) => parseInt(val));
    const uniqueNums = new Set(nums);

    if (
      nums.length !== 25 ||
      uniqueNums.size !== 25 ||
      nums.some((n) => isNaN(n) || n < 1 || n > 25)
    ) {
      alert("Please enter unique numbers between 1 and 25 in all cells.");
      return;
    }

    const grid = [];
    for (let i = 0; i < 5; i++) {
      grid.push(nums.slice(i * 5, i * 5 + 5));
    }

    setPlayerBoard(grid);
    setComputerBoard(generateComputerBoard());
    setSetupPhase(false);
    setSelectedNumbers([]);
    setPlayerBingoCount(0);
    setComputerBingoCount(0);
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner("");
  };

  const handlePlayerClick = (num) => {
    if (!isPlayerTurn || selectedNumbers.includes(num) || gameOver) return;
    setSelectedNumbers((prev) => [...prev, num]);
    setIsPlayerTurn(false);
    setTimeout(computerMove, 1000);
  };

  const computerMove = () => {
    if (gameOver) return;

    const availableNumbers = Array.from({ length: 25 }, (_, i) => i + 1).filter(
      (n) => !selectedNumbers.includes(n)
    );
    if (availableNumbers.length === 0) return;
    const randomPick = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    setSelectedNumbers((prev) => [...prev, randomPick]);
    setIsPlayerTurn(true);
  };

  const countBingo = (board) => {
    let count = 0;

    for (let row = 0; row < 5; row++) {
      if (board[row].every((num) => selectedNumbers.includes(num))) count++;
    }
    for (let col = 0; col < 5; col++) {
      const column = [];
      for (let row = 0; row < 5; row++) {
        column.push(board[row][col]);
      }
      if (column.every((num) => selectedNumbers.includes(num))) count++;
    }
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 to-pink-300">
      <h1 className="text-4xl font-bold text-white mb-6">Custom Bingo Game</h1>

      {setupPhase ? (
        <div>
          <h2 className="text-xl text-white font-semibold mb-4">
            Enter numbers between 1-25 (no duplicates)
          </h2>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {playerInputs.map((value, index) => (
              <input
                key={index}
                type="number"
                value={value}
                onChange={(e) => {
                  const updated = [...playerInputs];
                  updated[index] = e.target.value;
                  setPlayerInputs(updated);
                }}
                min="1"
                max="25"
                className="w-16 h-16 text-center text-xl font-semibold rounded-lg border-2 border-gray-300"
              />
            ))}
          </div>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div>
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

          <button
            onClick={() => {
              setPlayerInputs(Array(25).fill(""));
              setSetupPhase(true);
            }}
            className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
}
