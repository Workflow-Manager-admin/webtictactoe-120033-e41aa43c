import React, { useState, useEffect } from 'react';
import './App.css';

/*
Tic Tac Toe App
- Interactive 3x3 board
- Player name entry
- Game reset
- Winner/draw detection and display
- Visual turn indicator
- Modern minimalistic centered layout, light theme
- Uses colors: primary: #1976d2, secondary: #ffffff, accent: #f44336
*/

// Helper to check for winner
function calculateWinner(squares) {
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
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // Player name entry
  const [playerNames, setPlayerNames] = useState({ X: '', O: '' });
  const [editingNames, setEditingNames] = useState(true);

  // Board state
  const [squares, setSquares] = useState(Array(9).fill(null));

  // X always goes first
  const [xIsNext, setXIsNext] = useState(true);

  // For result message
  const [gameResult, setGameResult] = useState(null); // 'X', 'O', or 'draw'

  // Reset on player name submit
  useEffect(() => {
    if (!editingNames) {
      handleGameReset();
    }
    // eslint-disable-next-line
    // not including handleGameReset in deps to not cause double reset
  }, [editingNames]);

  // Check for winner/draw on squares change
  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      setGameResult(winner);
    } else if (!squares.includes(null)) {
      setGameResult('draw');
    } else {
      setGameResult(null);
    }
  }, [squares]);

  // PUBLIC_INTERFACE
  const handleNameInput = (mark, value) => {
    setPlayerNames(prev => ({ ...prev, [mark]: value }));
  };

  // PUBLIC_INTERFACE
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (playerNames.X.trim() && playerNames.O.trim()) {
      setEditingNames(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleSquareClick = (idx) => {
    if (editingNames || squares[idx] || gameResult) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  function handleGameReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameResult(null);
  }

  // PUBLIC_INTERFACE
  const handleEditNames = () => {
    setEditingNames(true);
  };

  // PUBLIC_INTERFACE
  function getTurnName() {
    return playerNames[xIsNext ? 'X' : 'O'];
  }

  // PUBLIC_INTERFACE
  function getWinnerName() {
    if (gameResult === 'draw') return 'Draw!';
    return `${playerNames[gameResult]} wins!`;
  }

  // Rendered UI

  return (
    <div className="ttt-app-bg" style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, Segoe UI, sans-serif'
    }}>
      <div className="ttt-app-container"
        style={{
          background: 'var(--bg-secondary, #fff)',
          borderRadius: '20px',
          boxShadow: '0 4px 32px rgba(25,118,210,0.10), 0 0.5px 1.5px rgba(0,0,0,0.10)',
          padding: '36px 32px 28px 32px',
          minWidth: 320,
          width: 350,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <h1 style={{
          margin: 0,
          fontSize: 32,
          fontWeight: 600,
          color: '#1976d2',
          letterSpacing: -1,
          marginBottom: 18,
        }}>
          Tic Tac Toe
        </h1>
        {/* Player name entry */}
        {editingNames ? (
          <form style={{
            width: '100%',
            marginBottom: 25,
            marginTop: 10
          }} onSubmit={handleNameSubmit} autoComplete="off">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              <input
                type="text"
                required
                placeholder="Player X name"
                value={playerNames.X}
                onChange={e => handleNameInput('X', e.target.value)}
                style={inputStyle('X')}
              />
              <input
                type="text"
                required
                placeholder="Player O name"
                value={playerNames.O}
                onChange={e => handleNameInput('O', e.target.value)}
                style={inputStyle('O')}
              />
              <button className="ttt-btn"
                style={{
                  ...buttonStyle('#1976d2', '#fff'),
                  width: '100%',
                  marginTop: 5
                }}
                type="submit"
                aria-label="Start Game">
                Start Game
              </button>
            </div>
          </form>
        ) : (
          <div className="ttt-status-section" style={{ width: '100%', marginBottom: 16 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 7
            }}>
              <span style={{
                fontSize: 15, 
                color: '#aaa', 
                letterSpacing: 0.5
              }}>
                X: <span style={{ color: '#1976d2', fontWeight: 500 }}>{playerNames.X}</span>
                &nbsp;|&nbsp;
                O: <span style={{ color: '#f44336', fontWeight: 500 }}>{playerNames.O}</span>
              </span>
              <button 
                className="ttt-edit-names"
                aria-label="Edit player names"
                style={{
                  fontSize: 12,
                  color: '#1976d2',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0
                }}
                onClick={handleEditNames}
              >Edit Names</button>
            </div>
            {/* Status / Turn Info */}
            {gameResult ? (
              <div className="ttt-winner-display" style={{
                fontWeight: 600, fontSize: 19,
                color: (gameResult === 'X') ? '#1976d2' : (gameResult === 'O') ? '#f44336' : '#222'
              }}>
                {gameResult === 'draw' ? 'It’s a draw!' : getWinnerName()}
              </div>
            ) : (
              <div className="ttt-turn-display" style={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 500,
                fontSize: 17
              }}>
                <TurnIndicator isX={xIsNext} color={xIsNext ? '#1976d2' : '#f44336'} />
                <span
                  style={{
                    color: xIsNext ? '#1976d2' : '#f44336',
                    marginLeft: 7,
                  }}
                  aria-live="polite"
                >
                  {getTurnName()}'s turn
                </span>
              </div>
            )}
          </div>
        )}
        {/* Game board */}
        {!editingNames && (
          <Board squares={squares} onClick={handleSquareClick} gameResult={gameResult} />
        )}
        {/* Controls */}
        {!editingNames && (
          <div className="ttt-controls" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 18,
            width: '100%'
          }}>
            <button
              className="ttt-btn"
              aria-label="Restart Game"
              style={{
                ...buttonStyle('#f44336', '#fff'),
                width: '100%'
              }}
              onClick={handleGameReset}
            >Restart</button>
          </div>
        )}
        <div style={{flex: 1}} />
        <footer style={{
          marginTop: 28,
          fontSize: 11,
          color: '#bdbdbd'
        }}>
          &copy; {new Date().getFullYear()} Modern Minimal Tic Tac Toe
        </footer>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onClick, gameResult }) {
  // Render 3x3 grid
  return (
    <div
      className="ttt-board"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 72px)',
        gridTemplateRows: 'repeat(3, 72px)',
        gap: '10px',
        margin: '0 auto',
        marginTop: 8,
        marginBottom: 8,
        background: '#ececec',
        padding: '10px',
        borderRadius: 14,
        boxShadow: '0 1.5px 6px rgba(25,118,210,0.04)'
      }}
      role="grid"
      aria-label="Tic Tac Toe Grid"
    >
      {squares.map((value, i) => (
        <Square
          key={i}
          value={value}
          onClick={() => onClick(i)}
          disabled={!!value || !!gameResult}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Square({ value, onClick, disabled }) {
  return (
    <button
      className="ttt-square"
      style={{
        width: 72,
        height: 72,
        border: '2px solid #eeeeee',
        borderRadius: 10,
        background: '#fff',
        fontSize: 36,
        fontWeight: 700,
        color: value === 'X' ? '#1976d2' : value === 'O' ? '#f44336' : '#ccc',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: value
          ? `0 0 0 2px ${value === 'X' ? '#1976d2' : '#f44336'}78`
          : '0 1.5px 6px rgba(25,118,210,0.04)',
        transition: 'box-shadow 0.2s'
      }}
      aria-label={value ? `${value} mark` : 'Empty square'}
      onClick={disabled ? undefined : onClick}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function TurnIndicator({ isX, color }) {
  return (
    <span
      className="ttt-turn-indicator"
      style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: color,
        display: 'inline-block',
        boxShadow: `0 0 0 2px ${color}40`,
        marginRight: 2,
        verticalAlign: 'middle'
      }}
      aria-label={isX ? 'X turn' : 'O turn'}
    />
  );
}

// Helper for consistent button styles
function buttonStyle(bg, fg) {
  return {
    background: bg,
    color: fg,
    border: 'none',
    borderRadius: 10,
    padding: '12px 0',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: `0 3px 12px ${bg}19`,
    transition: 'background 0.21s'
  };
}

// Helper for consistent input styles
function inputStyle(player) {
  return {
    background: '#fafbfc',
    border: `2px solid ${player === 'X' ? '#1976d2' : '#f44336'}30`,
    color: '#232323',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: 500,
    fontSize: 15,
    outline: 'none',
    width: '100%',
    letterSpacing: 0.2,
  };
}

export default App;
