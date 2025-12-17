"use client";

import React, { useState, useEffect } from 'react';

export default function BingoCard() {
  const [board, setBoard] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [bingoCount, setBingoCount] = useState(0);

  useEffect(() => {
    generateBoard();
  }, []);

  useEffect(() => {
    checkBingoLines();
  }, [selectedCells]);

  const generateBoard = () => {
    let numbers = Array.from({ length: 25 }, (_, i) => i + 1);
    numbers = shuffleArray(numbers);
    const grid = [];
    for (let i = 0; i < 5; i++) {
      grid.push(numbers.slice(i * 5, i * 5 + 5));
    }
    setBoard(grid);
    setSelectedCells([]);
    setBingoCount(0);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleCellClick = (num) => {
    if (!selectedCells.includes(num)) {
      setSelectedCells([...selectedCells, num]);
    }
  };

  const checkBingoLines = () => {
    if (board.length === 0 || board.some(row => row.length !== 5)) {
        return; 
    }

    let count = 0;

    // Check rows
    for (let row = 0; row < 5; row++) {
        if (board[row].every((num) => selectedCells.includes(num))) {
        count++;
        }
    }

    // Check columns
    for (let col = 0; col < 5; col++) {
        const column = [];
        for (let row = 0; row < 5; row++) {
        column.push(board[row][col]);
        }
        if (column.every((num) => selectedCells.includes(num))) {
        count++;
        }
    }

    // Check diagonals
    const diag1 = [0, 1, 2, 3, 4].map((i) => board[i][i]);
    const diag2 = [0, 1, 2, 3, 4].map((i) => board[i][4 - i]);

    if (diag1.every((num) => selectedCells.includes(num))) count++;
    if (diag2.every((num) => selectedCells.includes(num))) count++;

    setBingoCount(count > 5 ? 5 : count);
  };

  const bingoLetters = ["B", "I", "N", "G", "O"];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-400">
      <h1 className="text-4xl font-bold text-white mb-6">Bingo Game</h1>

      <div className="flex space-x-2 mb-6 text-3xl font-bold tracking-widest text-white">
        {bingoLetters.map((letter, index) => (
          <span
            key={index}
            className={index < bingoCount ? "text-green-300" : "text-white/50"}
          >
            {letter}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2 bg-white p-4 rounded-xl shadow-lg">
        {board.flat().map((num, index) => (
          <div
            key={index}
            onClick={() => handleCellClick(num)}
            className={`w-16 h-16 flex items-center justify-center text-xl font-semibold rounded-lg cursor-pointer transition 
              ${
                selectedCells.includes(num)
                  ? "bg-green-400 text-white"
                  : "bg-blue-100 hover:bg-blue-300"
              }`}
          >
            {num}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center space-y-2">
        <button
          onClick={generateBoard}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Generate New Board
        </button>

        {bingoCount === 5 && (
          <div className="mt-4 text-2xl font-bold text-green-800">
            🎉 You Win!
          </div>
        )}
      </div>
    </div>
  );
}
