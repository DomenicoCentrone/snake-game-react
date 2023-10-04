// App.js
import React, { useState } from 'react';
import SnakeGame from './SnakeGame';
import './App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="game-container">
      {!gameStarted && <button className='gameButton' onClick={() => setGameStarted(true)}>Start</button>}
      {gameStarted && <SnakeGame />}
    </div>
  );
}

export default App;
