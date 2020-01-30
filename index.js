// Board Setup
// board[0]  |  board[1]  |  board[2]
// ----------------------------------
// board[3]  |  board[4]  |  board[5]
// ----------------------------------
// board[6]  |  board[7]  |  board[8]

const readlineSync = require('readline-sync');

let playerTurn = true; 
let isGameFinished = false;
let board = [0, 0, 0, 0, 0, 0, 0, 0, 0]
const winningOptions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

/**
 * A function that checks the condition of the game status
 * @param {Array} board 
 * @returns {string} player, computer, draw, pending
 */
function checkWinningCondition(board) {
    const currentCondition = getCurrentBoardCondition(board);
    if (currentCondition.some(status => status === 3)) {isGameFinished = true; return 'player'};
    if (currentCondition.some(status => status === -3)) {isGameFinished = true; return 'computer'};

    const spotActive = board.filter(spot => spot !== 0).length
    if (spotActive === 9) return 'draw';
    return 'pending'
}

/**
 * A function that determine computer action to stop the player from winning
 * @param {Array} board 
 * @returns {number} the board index for placement
 */
function computerAction(board) {
    const currentCondition = getCurrentBoardCondition(board);
    const nextOptionToBlock = currentCondition.indexOf(2);
    const nextOptionToWin = currentCondition.indexOf(-2);

    let nextActionWinningCondition = [];
    if (nextOptionToWin > -1) nextActionWinningCondition = winningOptions[nextOptionToWin];
    if (nextOptionToBlock > -1) nextActionWinningCondition = winningOptions[nextOptionToBlock];
    const nextSpotPlacement = nextActionWinningCondition.length 
        ? nextActionWinningCondition.filter(index => board[index] === 0)[0] : board.indexOf(0);
    return nextSpotPlacement
}

/**
 * Return current board condition i.e. status [0,0,0,1,2,0...]
 * @param {Array} board 
 * @returns {Array} array of current board winning option conditions
 */
function getCurrentBoardCondition(board) {
    return winningOptions.map(option => {
        let status = 0;
        option.forEach(boardIndex => status += board[boardIndex])
        return status;
    })
}

/**
 * log the board in UI display
 * @param {Array<number>} board 
 * @returns {void}
 */
function printCurrentBoard(board) {
    console.log(`
    ${displaySymbol(board, 0)} | ${displaySymbol(board, 1)} | ${displaySymbol(board, 2)}
    ----------
    ${displaySymbol(board, 3)} | ${displaySymbol(board, 4)} | ${displaySymbol(board, 5)}
    ----------
    ${displaySymbol(board, 6)} | ${displaySymbol(board, 7)} | ${displaySymbol(board, 8)}
    `)
}

/**
 * Takes the board index and return display symbol
 * @param {Array} board
 * @param {number} index
 * @returns {number | 'O' | 'X'} 
 */
function displaySymbol(board, index) {
    if (board[index] === 1) return 'O'
    else if (board[index] === -1) return 'X'
    else return index
}

function run(){
    console.log('starting the game!')
    printCurrentBoard(board);

    while(!isGameFinished) {
        if (playerTurn) {
            const playAction = readlineSync.questionInt('Which index do you want to place? ');
            console.log(`You chose ${playAction}`)
            board[playAction] = 1;
            playerTurn = false;
        } else {
            const AIStepIndex = computerAction(board);
            console.log(`Computer chose ${AIStepIndex}`)
            board[AIStepIndex] = -1;
            playerTurn = true;
        }
        printCurrentBoard(board);
        
        switch(checkWinningCondition(board)) {
            case 'player':
                console.log('Player Won!')
                isGameFinished = true;
                break;
            case 'computer':
                console.log('computer Won!')
                isGameFinished = true;
                break;
            case 'draw':
                console.log('Tied game')
                isGameFinished = true;
                break;
            default:
                console.log('------------------------------------')
                console.log(`${playerTurn ? "It is player's turn" : "It is computer's turn"}`)
                break;
        };
    }
}

run();
