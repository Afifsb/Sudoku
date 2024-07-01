import React, { useState, useEffect } from 'react';
import './Sudoku.css';

function generateSudoku() {
  const board = Array(9).fill().map(() => Array(9).fill(0));
  
  function isValid(num, row, col) {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num || board[x][col] === num) {
        return false;
      }
    }
    
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  function fillBoard(row, col) {
    if (col === 9) {
      row++;
      col = 0;
    }
    
    if (row === 9) {
      return true;
    }
    
    if (board[row][col] !== 0) {
      return fillBoard(row, col + 1);
    }
    
    for (let num = 1; num <= 9; num++) {
      if (isValid(num, row, col)) {
        board[row][col] = num;
        if (fillBoard(row, col + 1)) {
          return true;
        }
        board[row][col] = 0;
      }
    }
    
    return false;
  }
  
  fillBoard(0, 0);
  
  // Remove some numbers to create the puzzle
  for (let i = 0; i < 40; i++) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    board[row][col] = 0;
  }
  
  return board;
}

function Sudoku() {
  const [board, setBoard] = useState(generateSudoku());
  const [isGameOver, setIsGameOver] = useState(false);
  const [initialBoard, setInitialBoard] = useState([]);

  useEffect(() => {
    setInitialBoard(board.map(row => row.map(cell => cell !== 0)));
  }, []);

  useEffect(() => {
    checkGameOver();
  }, [board]);

  const handleCellChange = (row, col, value) => {
    if (initialBoard[row][col]) return; // Prevent changing initial cells
    const newBoard = board.map(rowArray => [...rowArray]);
    newBoard[row][col] = value === '' ? 0 : parseInt(value, 10);
    setBoard(newBoard);
  };

  const restartGame = () => {
    const newBoard = generateSudoku();
    setBoard(newBoard);
    setInitialBoard(newBoard.map(row => row.map(cell => cell !== 0)));
    setIsGameOver(false);
  };

  const checkGameOver = () => {
    const isBoardFull = board.every(row => row.every(cell => cell !== 0));
    if (isBoardFull) {
      setIsGameOver(true);
    }
  };

  return (
    <div className="sudoku-container">
      <h1>SUDOKU</h1>
      <div className="board">
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              value={cell === 0 ? '' : cell}
              onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
              className={`cell ${initialBoard[rowIndex]?.[colIndex] ? 'initial' : ''}`}
              maxLength="1"
              disabled={isGameOver || initialBoard[rowIndex]?.[colIndex]}
            />
          ))
        ))}
      </div>
      <button onClick={restartGame} className="restart-button">
        RESTART GAME
      </button>
      {isGameOver && <div className="game-over">Game Over!</div>}
    </div>
  );
}

export default Sudoku;