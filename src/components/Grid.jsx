/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const RainDrop = ({ color }) => (
  <div
    className="w-full h-full"
    style={{ backgroundColor: color }}
  />
);

const MatrixRain = ({ rows = 15, cols = 20 }) => {
  const [grid, setGrid] = useState([]);
  const [speed] = useState(100);

  const getRandomColor = () => {
    const getRandomChannel = () => Math.floor(Math.random() * 156) + 100;
    const r = getRandomChannel();
    const g = getRandomChannel();
    const b = getRandomChannel();
    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    const initialGrid = Array(rows).fill().map(() =>
      Array(cols).fill(null)
    );
    setGrid(initialGrid);
  }, [rows, cols]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row => [...row]);

        for (let i = rows - 1; i >= 0; i--) {
          for (let j = 0; j < cols; j++) {
            if (i === rows - 1) {
              newGrid[i][j] = null;
            } else if (newGrid[i][j]) {
              newGrid[i + 1][j] = newGrid[i][j];
              newGrid[i][j] = null;
            }
          }
        }

        for (let j = 0; j < cols; j++) {
          if (Math.random() < 0.15) {
            newGrid[0][j] = getRandomColor();
          }
        }

        return newGrid;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [rows, cols, speed]);

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col items-center justify-center">
      <div className="bg-black/90 p-4 rounded-lg shadow-2xl border-2 border-gray-600 max-w-3xl w-full">
        <h1 className="text-xl font-bold mb-4 text-center text-gray-300">Digital Rain</h1>

        <div
          className="grid rounded-lg"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            aspectRatio: `${cols} / ${rows}`,
            gap: '2px',
            padding: '2px',
            backgroundColor: '#333'
          }}
        >
          {grid.map((row, i) =>
            row.map((color, j) => (
              <div
                key={`${i}-${j}`}
                className="w-full pb-[100%] relative bg-black"
              >
                <div className="absolute inset-0">
                  <RainDrop color={color || 'rgba(0, 0, 0, 1)'} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MatrixRain;