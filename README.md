# Lava Checkers

First game built on Phaser framework.

Rules:

Each player starts with 12 pieces on dark squares on three rows closest to the player's side.

Simple Move: Moving a piece to diagonally adjacent unoccupied square. Uncrowned piece can move diagonally forward only. Kings can move in any diagonal direction.

Jump: Moving a piece that is diagonally adjacent an opponent's piece, to an empty square immediately beyond it in the same direction. Uncrowned piece can jump diagonally forward only; Kings can jump in any diagonal direction. A jump piece is considered "captured" and removed from the game. Any piece, king or uncrowned, can jump a king.

Multiple jumps are possible. If after one jump, another piece is immediately eligiblt to be jumped even if that jump is in a different diagonal direction.

Jumping is always mandatory: If a player has the option to jump, he must take it, even if doing so results in disadvantage for the jumping player.

King piece: When the uncrowned piece moves onto the row closest to the opponent, it is promoted as a King piece. It can then move in any diagonal direction.

A player wins if he/she captures all the pieces of the opponent or the opponent has no valid moves left.

The game ends in a draw if no capture move happens in forty consecutive moves.