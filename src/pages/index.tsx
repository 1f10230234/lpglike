import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  //prettier-ignore
  const [board,setBoard] = useState([
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,3,0,0,0,0],
[0,0,3,2,1,0,0,0],
[0,0,0,1,2,3,0,0],
[0,0,0,0,3,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0]
  ]);
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
  let countBrack = 0;
  let countWhite = 0;
  console.log('a');
  let isPlace = false;
  let isPredict = false;
  const clickMasu = (x: number, y: number) => {
    if (board.some((row) => row.includes(3))) {
      if (board[y][x] === 3) {
        console.log(x, y);
        for (const n of direction) {
          console.log(n);
          for (
            let distance = 1;
            distance <=
            Math.min(
              Math.abs(3.5 + 3.5 * n[0] - x) + 99 * (1 - Math.abs(n[0])),
              Math.abs(3.5 + 3.5 * n[1] - y) + 99 * (1 - Math.abs(n[1]))
            );
            distance++
          ) {
            console.log('!');
            if (board[y + n[1] * distance][x + n[0] * distance] % 3 === 0) {
              console.log('a');
              distance = 0;
              break;
            } else if (board[y + n[1] * distance][x + n[0] * distance] === 3 - turnColor) {
              console.log('b');
              continue;
            } else if (board[y + n[1] * distance][x + n[0] * distance] === turnColor) {
              console.log('c');
              console.log('d', distance);
              for (let i = 1; i < distance; i++) {
                newBoard[y + n[1] * (distance - i)][x + n[0] * (distance - i)] = turnColor;
                isPlace = true;
              }
              console.log(isPlace);
              break;
            }
          }
        }
        if (isPlace) {
          console.log('e');
          newBoard[y][x] = turnColor;
          for (let x1 = 0; x1 < 8; x1++) {
            for (let y1 = 0; y1 < 8; y1++) {
              console.log(newBoard[y1][x1]);
              newBoard[y1][x1] %= 3;
            }
          }
          //console.table(newBoard);
          console.log('next');
          for (let x2 = 0; x2 < 8; x2++) {
            for (let y2 = 0; y2 < 8; y2++) {
              console.log(x2, y2); //
              for (const n of direction) {
                console.log(n);
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
                      console.log('b');
                      continue;
                    } else if (newBoard[y2 + n[1] * distance][x2 + n[0] * distance] % 3 === 0) {
                      console.log('c', distance);
                      for (let i = 1; i < distance; i++) {
                        console.log('d', [x2 + n[0] * distance], [y2 + n[1] * distance]);
                        newBoard[y2 + n[1] * distance][x2 + n[0] * distance] = 3;
                      }
                      isPredict = true;
                      console.log(isPlace);
                      break;
                    } else {
                      isPredict = false;
                      break;
                    }
                  }
                }
              }
              //console.table(newBoard);
              setBoard(newBoard);
            }
          }
        }
      }
    }
    console.log(isPlace);
    console.log(isPredict);
    if (isPlace) {
      setTurnColor(3 - turnColor);
    } else {
      if (board.some((row) => row.includes(3)) === false) {
        setTurnColor(3 - turnColor);
      }
    }
  };
  for (let i = 1; i < 8; i++) {
    for (let j = 1; j < 8; j++) {
      if (board[i][j] === 1) {
        countWhite += 1;
      }
    }
  }
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === 2) {
        countBrack += 1;
        console.log(countBrack);
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
      <div className={styles.turn}>
        <h1>
          {`${turnColor === 1 ? '黒の番' : '白の番'}` +
            `：` +
            `${board.some((row) => row.includes(3)) ? '置けます' : 'パス'}` +
            `  `}
        </h1>
      </div>
      <div className={styles.count}>
        <h1>{`白：` + `${countWhite}` + `個` + ` / ` + `黒：` + `${countBrack}` + `個`}</h1>
      </div>
    </div>
  );
};

export default Home;
