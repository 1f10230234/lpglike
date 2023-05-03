import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  function refleshName() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        newBoard[i][j] = normalBoard[i][j];
      }
    }
    setTurnColor(1);
    setBoard(normalBoard);
  }
  const normalBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 3, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const [board, setBoard] = useState(normalBoard);
  const direction = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ];
  const [turnColor, setTurnColor] = useState(1);
  const newBoard: number[][] = JSON.parse(JSON.stringify(board));
  const count: number[] = [];
  let isPlace = false;
  const clickMasu = (x: number, y: number) => {
    isPlace = false;
    const isFrontColor = (color: number, n: number[], distance: number, x: number, y: number) => {
      return board[y + n[1] * distance][x + n[0] * distance] % 3 === color;
    };
    if (board.some((row) => row.includes(3))) {
      if (board[y][x] === 3) {
        isPlace = false;
        for (const n of direction) {
          for (
            let distance = 1;
            distance <=
            Math.min(
              Math.abs(3.5 + 3.5 * n[0] - x) + 99 * (1 - Math.abs(n[0])),
              Math.abs(3.5 + 3.5 * n[1] - y) + 99 * (1 - Math.abs(n[1]))
            );
            distance++
          ) {
            if (isFrontColor(0, n, distance, x, y)) {
              distance = 0;
              break;
            } else if (isFrontColor(3 - turnColor, n, distance, x, y)) {
              continue;
            } else if (isFrontColor(turnColor, n, distance, x, y)) {
              for (let i = 1; i < distance; i++) {
                newBoard[y + n[1] * (distance - i)][x + n[0] * (distance - i)] = turnColor;
                isPlace = true;
              }
              break;
            }
          }
        }
      }
    }
    if (isPlace) {
      newBoard[y][x] = turnColor;
    }
    if (isPlace || board.some((row) => row.includes(3)) === false) {
      for (let x1 = 0; x1 < 8; x1++) {
        for (let y1 = 0; y1 < 8; y1++) {
          newBoard[y1][x1] %= 3;
        }
      }
      for (let x2 = 0; x2 < 8; x2++) {
        for (let y2 = 0; y2 < 8; y2++) {
          for (const n of direction) {
            for (
              let distance = 1;
              distance <=
              Math.min(
                Math.abs(3.5 + 3.5 * n[0] - x2) + 99 * (1 - Math.abs(n[0])),
                Math.abs(3.5 + 3.5 * n[1] - y2) + 99 * (1 - Math.abs(n[1]))
              );
              distance++
            ) {
              if (newBoard[y2][x2] === 3 - turnColor) {
                if (newBoard[y2 + n[1] * distance][x2 + n[0] * distance] === turnColor) {
                  continue;
                } else if (newBoard[y2 + n[1] * distance][x2 + n[0] * distance] % 3 === 0) {
                  for (let i = 1; i < distance; i++) {
                    newBoard[y2 + n[1] * distance][x2 + n[0] * distance] = 3;
                  }
                  break;
                } else {
                  break;
                }
              }
            }
          }
        }
      }
    }
    console.log(isPlace);
    console.log(newBoard.some((row) => row.includes(3)));
    if (isPlace) {
      setTurnColor(3 - turnColor);
      setBoard(newBoard);
    } else {
      if (newBoard.some((row) => row.includes(3))) {
        setTurnColor(3 - turnColor);
        setBoard(newBoard);
      } else {
        setTurnColor(3 - turnColor);
        setBoard(newBoard);
        if (count[0] !== count[1]) {
          alert(`${count[0] > count[1] ? '黒' : '白'}の勝ち`);
        }
        if (confirm('新しいゲームを作りますか？')) {
          refleshName;
          setTurnColor(1);
          setBoard(normalBoard);
          isPlace = true;
          console.log('i');
        }
      }
    }
  };
  for (let k = 0; k < 3; k++) {
    let a = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j] === 1 + k) {
          a += 1;
        }
      }
    }
    count[k] = a;
  }
  if (count[2] === 0) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j] === 0) {
          clickMasu(i, j);
        }
      }
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((masu, x) => (
            <div className={styles.masu} key={`${x}-${y}`} onClick={() => clickMasu(x, y)}>
              {masu !== 0 && (
                <div
                  className={styles.ishi}
                  style={{
                    background: masu === 1 ? '#000' : masu === 2 ? '#fff' : '#ff6a00',
                    width: masu === 3 ? '20%' : '87.5%',
                    height: masu === 3 ? '20%' : '87.5%',
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>
      {board.some((row) => row.includes(3)) === false && isPlace === false && (
        <h1>
          {`${turnColor === 1 ? '黒' : '白'}` +
            `の番：置けま` +
            `${
              board.some((row) => row.includes(3))
                ? 'す'
                : 'せん。画面をクリックしてパスしてください'
            }`}
        </h1>
      )}
      <h1>{`白：` + `${count[0]}` + `個` + ` / ` + `黒：` + `${count[1]}` + `個`}</h1>
      <div
        className={styles.button}
        onClick={() => {
          console.log('a');
          isPlace = true;
          refleshName;
          setBoard(normalBoard);
          setTurnColor(1);
        }}
      >
        <button>リセット</button>
      </div>
    </div>
  );
};

export default Home;
