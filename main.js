var board = [
    [null, null, null], 
    [null, null, null], 
    [null, null, null]
]

var turn = "x"
var p = "x"
var solo = true

var max_depth = 11

// Swap between 1 & 2 players
function set_p_num(is_solo) {
    solo = is_solo

    // Check if now Ai's turn
    if(solo && p != turn) {
        best_move = bestMove(board)

        board[best_move[0]][best_move[1]] = p == "x" ? "o" : "x"
        turn = (turn == "x" ? "o" : "x")
    
        redraw()
    }

    // Highlight currently selected option
    if(is_solo) {
        document.getElementById("ai").className = "but ai"
        document.getElementById("hum").className = "but"
    } else {
        document.getElementById("hum").className = "but human"
        document.getElementById("ai").className = "but"
    }
}

// Swap between x & o
function set_p(new_p) {

    reset()
    p = new_p

    switch(new_p) {
        case "x":
            reset()
            document.getElementById("sq").className = "but x"
            document.getElementById("cir").className = "but"
            break
        
        case "o":
            // Ai move

            if(solo) {
                best_move = bestMove(board)
                board[best_move[0]][best_move[1]] = p == "x" ? "o" : "x"
                turn = (turn == "x" ? "o" : "x")
                redraw()
            }

            document.getElementById("cir").className = "but o"
            document.getElementById("sq").className = "but"
            break
    }
}

// Set minimax depth based on difficulty setting
function set_depth(new_depth) {
    max_depth = new_depth

    // Highlight currently selected option
    if(new_depth == 1) {
        document.getElementById("easy").className = "but easy"
        document.getElementById("med").className = "but"
        document.getElementById("hard").className = "but"
    } else if(new_depth == 2) {
        document.getElementById("easy").className = "but"
        document.getElementById("med").className = "but med"
        document.getElementById("hard").className = "but"
    } else {
        document.getElementById("easy").className = "but"
        document.getElementById("med").className = "but"
        document.getElementById("hard").className = "but hard"
    }
}

function move(i, j) {
    if(board[i][j] == null && state(board)[0] == null) {
        board[i][j] = turn

        turn = (turn == "x" ? "o" : "x")
        console.log(turn)

        redraw()

        // Ai's move (if playing vs. AI)
        if(solo && state(board)[0] == null) {
                
            best_move = bestMove(board)

            board[best_move[0]][best_move[1]] = turn
            turn = (turn == "x" ? "o" : "x")
    
            redraw()
        }
    }
}

function redraw() {
    unpack_winner = state(board)
    winner = unpack_winner[0]
    winners = unpack_winner[1]

    for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
            var tile = document.getElementById(i + "-" + j)
            
            if(winner == null || winner == "/") {
                switch(board[i][j]) {
                    case "x":
                        tile.className = "tile square fill"
                        break

                    case "o":
                        tile.className = "tile circle fill"
                        break

                    default:
                        if(turn == "x") {
                            tile.className = "tile square"
                        } else if(turn == "o") {
                            tile.className = "tile circle"
                        }
                }
            }
            
            // Highlight winning tiles
            else {
                is_winner = false
                for(var l = 0; l < winners.length; l++) {
                    win = winners[l]
                    if(win[0] == i && win[1] == j) {
                        is_winner = true
                        switch(winner) {
                            case "x":
                                tile.className = "tile square fill"
                                break
                            
                            case "o":
                                tile.className = "tile circle fill"
                                break
                        }
                    } else if(!is_winner) {
                        tile.className = (turn == "x" ? "tile square" : "tile circle")
                    }
                }
            }
        }
    }
}

function state(_board) {
    // "x", "o", "/" (draw), null (not over yet)
    // Returns winning 3 squares too

    // Horizontal
    for(var i = 0; i < 3; i++) {
        if(_board[i][0] == _board[i][1] && _board[i][1] == _board[i][2] && _board[i][0] != null) {
            return [_board[i][0], [[i, 0], [i, 1], [i, 2]]]
        }
    }
    
    // Vertical
    for(var j = 0; j < 3; j++) {
        if(_board[0][j] == _board[1][j] && _board[1][j] == _board[2][j] && _board[0][j] != null) {
            return [_board[0][j], [[0, j], [1, j], [2, j]]]
        }
    }

    // Diagonal 0,0 - 2,2
    if(_board[0][0] == _board[1][1] && _board[1][1] == _board[2][2] && _board[0][0] != null) {
        return [_board[0][0], [[0, 0], [1, 1], [2, 2]]]
    }

    // Diagonal 2,0 - 0,2
    if(_board[2][0] == _board[1][1] && _board[1][1] == _board[0][2] && _board[2][0] != null) {
        return [_board[2][0], [[2, 0], [1, 1], [0, 2]]]
    }

    // Draw
    for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
            if(_board[i][j] == null) {
                return [null, []]
            }
        }
    }

    return ["/", []]
}

function reset() {
    board = [
        [null, null, null], 
        [null, null, null], 
        [null, null, null]
    ]
    
    turn = "x"

    // Check if now Ai's turn
    if(turn != p && solo) {
        best_move = bestMove(board)

        board[best_move[0]][best_move[1]] = p == "x" ? "o" : "x"
        turn = (turn == "x" ? "o" : "x")
    }

    redraw()
}

// ------------
// Minimax Code
// ------------

function bestMove(_board) {
    var ai = turn
    var best_score = -1000

    for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
            if(board[i][j] == null) {
                board[i][j] = ai
                var score = minimax(_board, ai, 1, false)
                board[i][j] = null

                if(score > best_score) {
                    best_score = score
                    var best_move = [i, j]
                }
            }
        }
    }

    return best_move
}

function minimax(_board, ai, depth, is_max) {
    var score = 0

    // Check for game over
    var _state = state(_board)[0]

    if(_state == "/") {
        return 0
    } else if(_state != null) {
        if(_state == ai) {
            return 1
        } else {
            return -1
        }
    } else if(depth == max_depth) {
        return 0
    }

    // Maximizing
    if(is_max) {
        var best_score = -1000

        for(var i = 0; i < 3; i++) {
            for(var j = 0; j < 3; j++) {
                if(board[i][j] == null) {
                    board[i][j] = ai
                    var score = minimax(_board, ai, depth + 1, false)
                    board[i][j] = null
    
                    if(score > best_score) {
                        best_score = score
                    }
                }
            }
        }

        return best_score
    }

    // Minimizing
    else {
        var best_score = 1000

        for(var i = 0; i < 3; i++) {
            for(var j = 0; j < 3; j++) {
                if(board[i][j] == null) {
                    board[i][j] = ai == "o" ? "x" : "o"
                    var score = minimax(_board, ai, depth + 1, true)
                    board[i][j] = null
    
                    if(score < best_score) {
                        best_score = score
                    }
                }
            }
        }

        return best_score
    }
}
