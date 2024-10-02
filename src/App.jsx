import './App.css';
import { useState } from 'react';
import confetti from 'canvas-confetti';

const TURNS = {
    x: 'X',
    o: 'O',
};

const Square = ({ children, isSelected, updateBoard, index }) => {
    const className = `square ${isSelected ? 'is-selected' : ''}`;

    const handleClick = () => {
        updateBoard(index);
    };

    return (
        <div className={className} onClick={handleClick}>
            {children}
        </div>
    );
};

const WINNER_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function App() {
    const [board, setBoard] = useState(() => {
        const boardFromLocalStorage = window.localStorage.getItem('board');
        return boardFromLocalStorage
            ? JSON.parse(boardFromLocalStorage)
            : Array(9).fill(null);
    });
    const [turn, setTurn] = useState(() => {
        const turnFromLocalStorage = window.localStorage.getItem('turn');
        return turnFromLocalStorage ? turnFromLocalStorage : TURNS.x;
    });
    const [winner, setWinner] = useState(null);

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setTurn(TURNS.x);
        setWinner(null);

        window.localStorage.removeItem('board');
        window.localStorage.removeItem('turn');
    };

    const checkWinner = (boardToCheck) => {
        for (const combo of WINNER_COMBOS) {
            const [a, b, c] = combo;
            if (
                boardToCheck[a] &&
                boardToCheck[a] === boardToCheck[b] &&
                boardToCheck[a] === boardToCheck[c]
            ) {
                return boardToCheck[a];
            }
        }
        return null;
    };

    const updateBoard = (index) => {
        if (board[index] || winner) {
            return;
        }

        const newBoard = [...board];
        newBoard[index] = turn;
        setBoard(newBoard);

        const newTurn = turn === TURNS.x ? TURNS.o : TURNS.x;
        setTurn(newTurn);

        window.localStorage.setItem('board', JSON.stringify(newBoard));
        window.localStorage.setItem('turn', JSON.stringify(turn));

        const newWinner = checkWinner(newBoard);

        if (newWinner) {
            confetti();
            setWinner(newWinner);
        } else if (!newBoard.includes(null)) {
            setWinner(false);
        }
    };

    return (
        <main className='board'>
            <h1>Tic Tac toe</h1>
            <button onClick={resetGame}>reset de juego</button>
            <section className='game'>
                {board.map((_, index) => {
                    return (
                        <Square
                            key={index}
                            index={index}
                            updateBoard={updateBoard}
                        >
                            {board[index]}
                        </Square>
                    );
                })}
            </section>

            <section className='turn'>
                <Square isSelected={turn === TURNS.x}>{TURNS.o}</Square>
                <Square isSelected={turn === TURNS.o}>{TURNS.x}</Square>
            </section>

            <section>
                {winner !== null && (
                    <section className='winner'>
                        <div className='text'>
                            <h2>{winner === false ? 'Empate' : `Ganó: `}</h2>
                            <header className='win'>
                                {winner && <Square>{winner}</Square>}
                            </header>
                            <footer>
                                <button onClick={resetGame}>
                                    Empezar de nuevo
                                </button>
                            </footer>
                        </div>
                    </section>
                )}
            </section>
        </main>
    );
}

export default App;
