/*
* This is the Main Component which renders Tic-Tac-Toe Screen
*/
import {useState} from 'react';
import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log"
import {WINNING_COMBINATIONS} from "./winning-combinations";
import GameOver from './components/GameOver';

// ****** CONSTANTS *******//
const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

const PLAYERS = {
  X : 'Player 1',
  O : 'Player 2'
};

// ***** Util Functions to derive values ******* //
function deriveActivePlayer(gameTurns)
{
  let currentPlayer = 'X';
  if(gameTurns.length > 0 && gameTurns[0].player ==='X')
  {
      currentPlayer = 'O';
  }
  return currentPlayer;
}

function deriveWinner(gameBoard, players)
{
  let winner = null;

  for(const combinations of WINNING_COMBINATIONS)
  {
    const firstSquareSymbol = gameBoard[combinations[0].row][combinations[0].column];
    const secondSquareSymbol = gameBoard[combinations[1].row][combinations[1].column];
    const thirdSquareSymbol = gameBoard[combinations[2].row][combinations[2].column];;

    if(firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol)
    {
      winner = players[firstSquareSymbol];
    }

  }
  return winner;
}

function deriveGameBoard(gameTurns)
{
  let gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])];

  for(const turn of gameTurns)
  {
      const {square, player} = turn;
      const {row, col} = square;

      gameBoard[row][col] = player;
  }

  return gameBoard;
}

// ******** Main 'App' Component *************
function App() {

  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const isDraw = gameTurns.length === 9 && !winner;

  // ******** Event Listener Functions **********
  function handleSelectSquare(rowIndex, colIndex)
  {
    setGameTurns((prevTurns) => {
      let currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [ {square : {row:rowIndex, col : colIndex}, player : activePlayer},
        ...prevTurns];

        return updatedTurns;
    });
  }

  function handleRestart()
  {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName)
  {
    setPlayers(prevPlayers => {
      return {
        ...prevPlayers, [symbol] : newName
      }
    })
  }

  return (
  <main>
    <div id="game-container">
      <ol id = "players" className='highlight-player'>
        <Player initialName={PLAYERS.X} symbol="X" isActive = {activePlayer === 'X'} onChangeName={handlePlayerNameChange}/>
        <Player initialName={PLAYERS.O} symbol="O" isActive = {activePlayer === 'O'} onChangeName={handlePlayerNameChange}/>
      </ol>
     {(winner || isDraw) && <GameOver winner = {winner} onRestart={handleRestart}></GameOver>}
    <GameBoard onSelectSquare = {handleSelectSquare} gameBoard = {gameBoard}/>
    </div>
    <Log turns={gameTurns}/>
  </main>);
}

export default App
