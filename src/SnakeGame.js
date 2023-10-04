import React, { useState, useEffect, useCallback } from 'react';

const gridSize = 20;

function SnakeGame() {
    const [snake, setSnake] = useState([{ x: 2, y: 2 }]);
    const [apple, setApple] = useState({ x: 5, y: 5 });
    const [dir, setDir] = useState({ x: 1, y: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [intervalTime, setIntervalTime] = useState(200);
    const [bonus, setBonus] = useState(null);
  
    const spawnBonus = () => {
      const newBonus = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
      setBonus(newBonus);
    }
  
    const moveSnake = useCallback(() => {
      let newSnake = snake.map(s => ({...s}));
      let head = Object.assign({}, newSnake[0]);
      head.x += dir.x;
      head.y += dir.y;
      newSnake.unshift(head);
  
      if (head.x === apple.x && head.y === apple.y) {
        const newApple = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
        setApple(newApple);
        setScore(prevScore => {
          const newScore = prevScore + 1;
          if (newScore % 5 === 0) spawnBonus();
          if (newScore % 3 === 0 && intervalTime > 50) { // Verifica che il punteggio sia un multiplo di 3 e che intervalTime sia maggiore di un valore minimo (per evitare che vada troppo veloce)
              setIntervalTime(prevInterval => prevInterval - 10); // diminuisce l'intervallo di 10ms
          }
          return newScore;
        });
      } else if (bonus && head.x === bonus.x && head.y === bonus.y) {
        setBonus(null);  // remove the bonus from the screen
        newSnake.push({}, {});  // add +2 length
        setScore(prevScore => {
          const newBonusScore = prevScore + 5;
          if (newBonusScore % 3 === 0 && intervalTime > 50) {
              setIntervalTime(prevInterval => prevInterval - 10);
          }
          return newBonusScore;
      });
      } else {
        newSnake.pop();
      }
      setSnake(newSnake);
    }, [snake, dir, apple, bonus]);

  useEffect(() => {
    const checkCollision = () => {
      let head = snake[0];
      for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
      }
      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) return true;
      return false;
    };

    if (checkCollision()) {
      setGameOver(true);
    } else {
      const gameInterval = setInterval(moveSnake, intervalTime);
      return () => clearInterval(gameInterval);
    }
  }, [snake, moveSnake, intervalTime]);

  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (dir.y === 0) setDir({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (dir.y === 0) setDir({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (dir.x === 0) setDir({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (dir.x === 0) setDir({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dir]);


  if (gameOver) return <div>Game Over!</div>;

  return (
    <div>
      <div className="score">Punteggio: {score}</div>
      {Array(gridSize).fill().map((_, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {Array(gridSize).fill().map((_, colIndex) => {
            const isSnakeSegment = snake.some(s => s.x === colIndex && s.y === rowIndex);
            const isSnakeHead = isSnakeSegment && snake[0].x === colIndex && snake[0].y === rowIndex;
            const cellColor = isSnakeSegment ? 'green' : (apple.x === colIndex && apple.y === rowIndex ? 'red' : (bonus && bonus.x === colIndex && bonus.y === rowIndex ? 'blue' : 'white'));
            
            return (
              <div 
                key={colIndex}
                style={{ 
                  width: '15px', 
                  height: '15px', 
                  border: '1px solid black', 
                  backgroundColor: cellColor,
                  position: 'relative'
                }}
              >
                {isSnakeHead && (
                  <>
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      position: 'absolute',
                      top: '2px',
                      left: '2px'
                    }}></div>
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      position: 'absolute',
                      top: '2px',
                      right: '2px'
                    }}></div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  );
}

export default SnakeGame;