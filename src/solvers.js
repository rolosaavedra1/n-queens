/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.findNRooksSolution = function (n) {
  // n = a potential solution matrix

  //loop columns
  for (var x = 0; x < n.length; x++) {
    //loop rows
    for (var y = 0; y < n.length; y++) {
      //check conflicts
      if (hasRowConflictAt(y) || hasRowConflictAt(x)) {
        return false;
      }
    }
  }
  return true;
};






// //one initial placement arrangement
// //input n is number of rooks and dimension of board
// //output is matrix with 1s in position of rooks
// /*
// (x, y) = (0, 0)
// iterate through the first row
// keep track of (x,y)
// //using helper functions
// if (no row or col conflict)
// place rook in (x,y)
// increment x, y
// if x and y are out of bounds,
// loop is done.
// if x is out of bounds
// reset x, increment y
// //check order of conditionals
//  */
// //create empty board
// var board = new Board({ n: n });
// //create (x,y) = (column, row)
// var x = 0;
// var y = 1;
// var piecesPlaced = 0;
// for (x; x <= n; x++) {
//   if (piecesPlaced === n) {
//     break;
//   }
//   //is the column (which we're incrementing with the loop) out of bounds?
//   if (x === n) {
//     x = 0;
//   }
//   if (!board.hasColConflictAt(x) && !board.hasRowConflictAt(y)) {
//     // if no conflict at (x,y), place rook there
//     board.togglePiece(y, x);
//     // then change position so that next iteration is (x+1, y+1) --> descending in major diagonal
//     y += 1; //x is already increasing with each iteration, x += 1 not needed
//     piecesPlaced++;
//   }
//   if (y === n) {
//     y = 0;
//   }

// }

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function (n) {

  // iterate through possible matrices, starting from empty to all 3 possible starting values for row 1.
  // in between populating each row, use findNRooksSolutions to discard conflicts.
  // then fill out row 2, check what solutions it provides for each.
  // all the way through n-1.
  //then iterate through solutions array, delete repeats.
  //return length.
  //1 , 0 -> 2, 0

  var board = new Board({ n: n });
  var solutionsArray = [];
  for (var x = 0; x < n.length; x++) {
    //loop rows
    for (var y = 0; y < n.length; y++) {
      solutionsArray.push(board.findSolution(x, y, board));
    }
  }
  return solutionsArray



  // Finding a solution:
  var findSolution = function (hort, vert, matrix) { // matrix === unsolved board
    var solutionsArray = [];
    return solutionsArray
    // iterate accross the row
    for (hort; hort < n; hort++) {
      // place another piece
      matrix.toggle(hort, vert);
      // check if conflict
      if (board.findNRooksSolution(matrix)) {
        // if last row, we have a solution
        if (vert === n) {
          solutionsArray.push(board.findSolution(x, y, board));

        }

        // if success, place next piece
        findSolution(hort + 1, vert, matrix);
      }
      matrix.toggle(hort, vert);
      // if error, got to next
      if (!matrix._isInBounds(hort, vert)) {
        continue;
      }
    }
    findSolution(0, vert + 1, matrix);
  };
  // start at (0,0), place a rook there. Get a solution for it.
  // function that when given a starting point returns a solution



  // base: if rook in row 1 is out of bounds or we're out of solutions
  // findNRooksSolution for starting point (x, y), then move to (x+1, y), do it again. repeat until row is done,
  // move to next row. until we get to last row, then backtrack for other potential solutions for every step.

  //recursive
  // if there are less than 4 rooks placed
  // place a rook on the next row
  // go back to last one that can move
  // move it

  // var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' rooks:', solutionsArray);
  // return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function (n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function (n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
