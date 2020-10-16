// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function () {

  window.Board = Backbone.Model.extend({
    //it can take an object, or (an array of arrays)

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },
    //returns the rows (an array of rows)
    rows: function () {
      //_.range creates an array of length n, which map then populates with the rows in the Board, from 0 to n.
      return _(_.range(this.get('n'))).map(function (rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function (rowIndex, colIndex) {
      //this line modifies the value of the matrix at position [rowIndex][colIndex] to its opposite (0 -> 1)
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function (rowIndex, colIndex) {
      // if given a position on the array , it returns the row for major diagonal movement.
      // it returns the starting point for a diagonal on the top array (-2) || (-1) || (0) || (1) || (2)
      //white board this one !!!! how do you find where to start for a diagonal when you reference the first row?
      //top left -> bottom right in that case you already know, this function is only when you aren't on the first row
      // (1, 1) - >  0.
      // (1, 2) - > 1
      return colIndex - rowIndex;
    },
    //same for minor diagonal: bottom left -> top right
    _getFirstRowColumnIndexForMinorDiagonalOn: function (rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function () {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function (rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function () {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },
    // returns whether you're within bound or not
    _isInBounds: function (rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    // NOTE: USING CONSOLE LOG I DETERMINED THAT this.attributes IS WHERE THE MATRIX IS LOCATED
    // The matrix is arranged as an array of rows, such that its size is determined by RowsXColumns
    // so to get a row i, simply call this.attributes[i].
    // to get a column j, you have to iterate through this.attributes[i][j] with i going from 0 to Rows.

    // test if a specific row on this board contains a conflict
    //NOTE: row is the row we're looking at for conflicts. IT IS NOT AN INDEX.

    conflictInArray: function (array) {
      //if input isn't an array, return false
      if (!array.length) { return false; }
      //get the first instance of 1 in the array
      let firstInstance = array.indexOf(1);
      //if -1, return false
      if (firstInstance === -1) {
        return false;
      }
      //get the second instance of 1 in the array
      let secondInstance = array.lastIndexOf(1);
      //if same as first, return false
      if (firstInstance === secondInstance) {
        return false;
      }
      //if none of this conditions apply, there is a conflict
      return true;

    },
    hasRowConflictAt: function (rowIndex) {
      //if rowIndex is an array, return false
      if (rowIndex.length) { return false; }
      return this.conflictInArray(this.get(rowIndex));
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function () {
      let rows = this.rows();
      for (var i = 0; i < rows.length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function (colIndex) {
      let col = [];
      for (var i = 0; i < this.get(0).length; i++) {
        col.push(this.get(i)[colIndex]);
      }
      return this.conflictInArray(col);
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function () {
      for (var i = 0; i < this.get(0).length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function (majorDiagonalColumnIndexAtFirstRow) {
      // Assuming coordinates: (rows, columns) -> visually, this is (vertical, horizontal)
      // we receive the column number c on the first row, so starting coordinates are (0, c)
      // check if (0, c) > 0, if so add to counter
      //we want to descend diagonally to (0+1, c+1), check if within bounds. Then check if > 0. if so, add to counter.
      // continue adding to coordinates until we're out of bounds or >rows.length
      /*
      //NOTE: THIS IGNORES THE BOTTOM-LEFT SIDE OF THE MATRIX unless we're given a row
      proposed solution:
      let c = majorDiagonalColumnIndexAtFirstRow;
      let r = row || 0;
      let count = 0;
      for (var i = c; i < this.rows().length; i++)
       if (_isInBounds(r, i) {
         counter += this.get(r)[i];
         if (counter > 1) {
           return true;
         }
         r++;
        }
        else {
          return false;
        }
      }
      return false;
      */
      board = this.rows();
      // x is the column number
      var x = majorDiagonalColumnIndexAtFirstRow; //-2
      // y is the row number
      var y = 0;
      var count = 0;
      for (var i = x; i < board.length; i++) {
        if (i < 0) {
          //descending diagonally down the matrix
          y++;
          //skip rest of loop cycle
          continue;
        }
        //add to counter to check for 1
        count += board[i][y];
        //if more than one 1 is found, return true
        if (count > 1) {
          return true;
        }
        //descend diagonally down the matrix
        y++;
      }
      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function () {
      //iterate through rows
      // for first row, call hasMajorDiagonalConflictAt for every starting column position, 0 through n
      //for second row onwards, call it only for column position 0

      // proposed solution:
      /*
      for (var c = 0; c < this.get(0).length; c++) {
        if (c === 0){
          for (var r = 0; r <this.get(0).length; r++) {
            if (this.hasMajorDiagonalConflictAt(0, r)) {
              return true;
            }
          }
        }
        if (this.hasMajorDiagonalConflictAt(c)) {
          returns true;
        }
      }
      */

      var board = this.rows();
      var start = - board.length;
      for (var i = start; i < board.length; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function (minorDiagonalColumnIndexAtFirstRow) {
      //same but descending in opposite direction
      // Solution: descend diagonally. If our position is out of bounds before reaching the square, increase

      //debugger;
      board = this.rows();
      // x is the column number
      var x = minorDiagonalColumnIndexAtFirstRow; // = 6
      // y is the row number
      var y = 0;
      var count = 0;
      //sets the starting position for the decent, based on top row coordinates (x, 0)
      for (var i = x; i >= 0; i--) {
        if (i >= board.length) {
          //descending diagonally down the matrix
          y++;
          //skip rest of loop cycle
          continue;
        }
        //stops the loop if coordinates leave the board
        if (y >= board.length) {
          return false;
        }
        //add to counter to check for 1
        count += board[i][y];
        //if more than one 1 is found, return true
        if (count > 1) {
          return true;
        }
        //descend diagonally down the matrix
        y++;
      }
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function () {
      // Blake's solution:  extend the board so it is a 2n * n rectangle. Descend diagonally until out of bounds, looking for conflicts. Do this for all starting positions from (0, 2n) to (0, 0). Ignore any out of bounds positions.
      var board = this.rows();
      var start = (board.length - 1) * 2;
      for (var i = start; i > 1; i--) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function (n) {
    return _(_.range(n)).map(function () {
      return _(_.range(n)).map(function () {
        return 0;
      });
    });
  };

}());
