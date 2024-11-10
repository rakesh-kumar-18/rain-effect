/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const RainDrop = ({ color }) => (
  <div
    className="w-full h-full transition-colors duration-500"
    style={{ backgroundColor: color }}
  />
);

const MatrixRain = ({ rows = 15, cols = 20 }) => {
  const [grid, setGrid] = useState([]);
  const [speed] = useState(100);

  // Generate random color in purple/blue spectrum
  const getRandomColor = () => {
    const colors = [
      'rgb(138, 43, 226)', // Purple
      'rgb(147, 112, 219)', // Medium Purple
      'rgb(75, 0, 130)',    // Indigo
      'rgb(0, 0, 139)',     // Dark Blue
      'rgba(138, 43, 226, 0.7)', // Transparent Purple
      'rgba(75, 0, 130, 0.7)',   // Transparent Indigo
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Initialize grid
  useEffect(() => {
    const initialGrid = Array(rows).fill().map(() =>
      Array(cols).fill(null)
    );
    setGrid(initialGrid);
  }, [rows, cols]);

  // Update rain animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row => [...row]);

        // Move existing drops down
        for (let i = rows - 1; i >= 0; i--) {
          for (let j = 0; j < cols; j++) {
            if (i === rows - 1) {
              // Clear bottom row
              newGrid[i][j] = null;
            } else if (newGrid[i][j]) {
              // Move drop down
              newGrid[i + 1][j] = newGrid[i][j];
              newGrid[i][j] = null;
            }
          }
        }

        // Add new drops at top
        for (let j = 0; j < cols; j++) {
          if (Math.random() < 0.1) { // 10% chance of new drop
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
      {/* Custom card container using Tailwind */}
      <div className="bg-black/90 p-2 rounded-lg shadow-2xl border-2 border-purple-500/30 max-w-3xl w-full">
        <h1 className="text-xl font-bold mb-2 text-center text-purple-300">Digital Rain</h1>

        {/* Rain grid container */}
        <div
          className="grid gap-0.5 bg-black p-4 rounded-lg shadow-inner"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            aspectRatio: `${cols} / ${rows}`
          }}
        >
          {grid.map((row, i) =>
            row.map((color, j) => (
              <div
                key={`${i}-${j}`}
                className="w-full pb-[100%] relative border border-gray-900/20"
              >
                <div className="absolute inset-0">
                  <RainDrop color={color || 'transparent'} />
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