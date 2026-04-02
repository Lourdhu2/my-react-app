import { useState, useEffect } from 'react'
import './TicTacToe.css'

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function getWinner(board) {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { mark: board[a], line: [a, b, c] }
    }
  }
  return null
}

function minimax(board, isAI) {
  const winner = getWinner(board)
  if (winner?.mark === 'O') return 1
  if (winner?.mark === 'X') return -1
  if (board.every(Boolean)) return 0

  let best = isAI ? -2 : 2
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = isAI ? 'O' : 'X'
      const score = minimax(board, !isAI)
      board[i] = null
      best = isAI ? Math.max(best, score) : Math.min(best, score)
    }
  }
  return best
}

function getBestMove(board) {
  let bestScore = -2
  let bestMove = 0
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O'
      const score = minimax(board, false)
      board[i] = null
      if (score > bestScore) {
        bestScore = score
        bestMove = i
      }
    }
  }
  return bestMove
}

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [scores, setScores] = useState({ You: 0, Computer: 0 })

  const winner = getWinner(board)
  const isDraw = !winner && board.every(Boolean)

  let status
  if (winner) status = winner.mark === 'X' ? '🎉 You win!' : '💻 Computer wins!'
  else if (isDraw) status = "It's a draw!"
  else status = xIsNext ? 'Your turn (X)' : 'Computer thinking...'

  // Computer's turn
  useEffect(() => {
    if (!xIsNext && !winner && !isDraw) {
      const timer = setTimeout(() => {
        const next = [...board]
        const move = getBestMove([...board])
        next[move] = 'O'
        setBoard(next)
        setXIsNext(true)

        const result = getWinner(next)
        if (result) {
          setScores((s) => ({ ...s, Computer: s.Computer + 1 }))
        }
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [xIsNext, board, winner, isDraw])

  function handleClick(i) {
    if (board[i] || winner || !xIsNext) return
    const next = [...board]
    next[i] = 'X'
    setBoard(next)
    setXIsNext(false)

    const result = getWinner(next)
    if (result) {
      setScores((s) => ({ ...s, You: s.You + 1 }))
    }
  }

  function reset() {
    setBoard(Array(9).fill(null))
    setXIsNext(true)
  }

  return (
    <div className="ttt">
      <h1>Tic Tac Toe</h1>
      <div className="ttt-scoreboard">
        <span className="ttt-score x">You (X): {scores.You}</span>
        <span className="ttt-score o">Computer (O): {scores.Computer}</span>
      </div>
      <p className="ttt-status">{status}</p>
      <div className="ttt-board">
        {board.map((cell, i) => (
          <button
            key={i}
            className={`ttt-cell${cell === 'X' ? ' x' : cell === 'O' ? ' o' : ''}${winner?.line.includes(i) ? ' winning' : ''}`}
            onClick={() => handleClick(i)}
            disabled={!xIsNext || !!winner}
          >
            {cell}
          </button>
        ))}
      </div>
      {(winner || isDraw) && (
        <button className="ttt-reset" onClick={reset}>Play Again</button>
      )}
    </div>
  )
}
