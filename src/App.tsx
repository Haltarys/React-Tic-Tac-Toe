/* eslint-disable react-x/no-array-index-key */
import { useState } from 'react';

type PlayerType = 'X' | 'O';
type SquareValue = PlayerType | null;
type BoardState = SquareValue[];

type SquareProps = {
  value: SquareValue;
  onSquareClick: () => void;
};

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button type="button" className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares: BoardState): SquareValue {
  // All possible combinations of indices of a winning tic-tac-toe position
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
  return null;
}

type BoardProps = {
  isXToPlay: boolean;
  squares: BoardState;
  onPlay: (nextSquares: BoardState) => void;
};

function Board({ isXToPlay, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    // If the current square already has a value, it cannot be overwritten. Exit early.
    if (squares[i]) return;

    // If there is a winner, no need to update the board
    if (calculateWinner(squares)) return;

    const nextSquares = squares.slice();

    if (isXToPlay) nextSquares[i] = 'X';
    else nextSquares[i] = 'O';

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const status = winner ? `Winner: ${winner}` : `Next player: ${isXToPlay ? 'X' : 'O'}`;

  return (
    <>
      <div className="status">{status}</div>
      {Array.from({ length: 3 }).map((_, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {Array.from({ length: 3 }).map((_, colIndex) => {
            const squareIndex = rowIndex * 3 + colIndex;
            return (
              <Square
                key={squareIndex}
                value={squares[squareIndex]}
                onSquareClick={() => handleClick(squareIndex)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

function Game() {
  const [history, setHistory] = useState(() => [Array<SquareValue>(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: BoardState) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpToMove(moveIndex: number) {
    setCurrentMove(moveIndex);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          isXToPlay={currentMove % 2 === 0}
          squares={currentSquares}
          onPlay={handlePlay}
        ></Board>
      </div>
      <div className="game-info">
        <ol start={0}>
          {history.map((_, moveIndex) => (
            <li key={moveIndex}>
              {moveIndex === currentMove ? (
                <b>{`You are at move #${moveIndex}`}</b>
              ) : (
                <button type="button" onClick={() => jumpToMove(moveIndex)}>
                  {moveIndex === 0 ? 'Go to game start' : `Go to move #${moveIndex}`}
                </button>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Game;
