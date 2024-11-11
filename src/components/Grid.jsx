/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const RainDrop = ({ color }) => (
  <div
    className="w-6 h-6 border border-gray-700"
    style={{
      backgroundColor: color || '#000000',
      transition: 'background-color 100ms'
    }}
  />
);

const MatrixRain = ({ rows = 15, cols = 20 }) => {
  const [drops, setDrops] = useState([]);
  const [grid, setGrid] = useState(Array(rows).fill().map(() => Array(cols).fill(null)));

  const getRandomColor = () => {
    const getRandomChannel = () => Math.floor(Math.random() * 156) + 100;
    const r = getRandomChannel();
    const g = getRandomChannel();
    const b = getRandomChannel();
    return { r, g, b };
  };

  const createDrop = (col) => {
    const length = Math.floor(Math.random() * 4) + 4;
    const baseColor = getRandomColor();

    return {
      col,
      length,
      head: 0,
      baseColor,
      active: true
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDrops(prevDrops => {
        const updatedDrops = prevDrops
          .map(drop => ({
            ...drop,
            head: drop.head + 1
          }))
          .filter(drop => drop.head < rows + drop.length);

        if (Math.random() < 0.2) {
          const col = Math.floor(Math.random() * cols);
          if (!updatedDrops.some(drop => drop.col === col && drop.head < 3)) {
            updatedDrops.push(createDrop(col));
          }
        }

        return updatedDrops;
      });

      setGrid(() => {
        const newGrid = Array(rows).fill().map(() => Array(cols).fill(null));

        drops.forEach(drop => {
          const tailStart = Math.max(0, drop.head - drop.length);
          const tailEnd = Math.min(rows - 1, drop.head);

          for (let i = tailStart; i <= tailEnd; i++) {
            if (i >= 0 && i < rows) {
              const intensity = 1 - (tailEnd - i) / drop.length;
              const { r, g, b } = drop.baseColor;
              const fadeColor = `rgb(${Math.floor(r * intensity)}, ${Math.floor(g * intensity)}, ${Math.floor(b * intensity)})`;
              newGrid[i][drop.col] = fadeColor;
            }
          }
        });

        return newGrid;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [rows, cols, drops]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-white mb-8">Digital Rain</h1>
      <div className="inline-block bg-black p-1">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 24px)`,
            gridTemplateRows: `repeat(${rows}, 24px)`,
          }}
        >
          {grid.map((row, i) =>
            row.map((color, j) => (
              <RainDrop key={`${i}-${j}`} color={color} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MatrixRain;