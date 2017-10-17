import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { Cell } from './models/cell';


@Injectable()
export class GameService {

  playerNumber: number;

  constructor(private db: AngularFireDatabase) {

    this.playerNumber = 1;
  }

  isMyGrid(gridNumber: number) {
    return ((this.playerNumber == 1 && gridNumber == 1) ||
      (this.playerNumber == 2 && gridNumber == 2));
  }

  clicked(grille: Cell[][], x: number, y: number, gridNumber: number) {
    if (!this.isMyGrid(gridNumber)) {
      return;
    }

    console.log("Ma grille : " + x + ", " + y);

    //CLONE GRID TO BE SENT TO FIREBASE DB
    let tmpGrid = Object.assign({}, grille);

    //CHANGE CELL TYPE ON HIT
    this.onHitCell(tmpGrid, x, y);


    //LOOP THROUGH THE GRID AND COUNT THE CELLS WITH SAME ID AND TYPE BOAT

    if (tmpGrid[x][y].boatId != 0 && this.onScanGrid(tmpGrid, x, y) == 0) {

      tmpGrid[x][y].type = "sunkShip";
      alert("bateau coulé ID:" + tmpGrid[x][y].boatId);
      this.sinkingShip(tmpGrid, x, y);
    }

    //TELLS IF ALL SHIPS ARE SUNK

    if (this.howManySunkCells(tmpGrid) == 17) {
      alert("ALL SHIPS SUNK")
    }

    //SEND UPDATED GRID TO FIREBASE DB
    this.db.object('room/' + this.getFirebaseDBPath(gridNumber)).update(tmpGrid);

  }

  getFirebaseDBPath(gridNumber) {
    return "/grid" + gridNumber;
  }

  //CHANGE CELL TYPE ON HIT (IF BOAT => BOATHIT / IF WATER=>WATERHIT)
  onHitCell(grid: Cell[][], x: number, y: number) {
    if (this.getCellValue(grid, x, y) == "boat") {
      return grid[x][y].type = "boatHit";
    } else if (this.getCellValue(grid, x, y) == "water") {
      return grid[x][y].type = "waterHit";
    }
  }

  getCellValue(grid: Cell[][], x: number, y: number) {
    return grid[x][y].type;
  }

  //LOOP THROUGH THE GRID AND COUNT THE CELLS WITH SAME ID WITH TYPE BOAT => RETURNS REMAINING UNTOUCHED CELLS WITH SAME ID

  onScanGrid(grid: Cell[][], x: number, y: number) {
    let remainingCellUntouched = 0;
    for (let i = 0; i < grid[0].length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j].boatId == grid[x][y].boatId && grid[i][j].type == "boat") {
          remainingCellUntouched++;
        }
      }
    }
    return remainingCellUntouched;
  }


  //LOOP THROUGH THE GRID CHANGE TYPE OF CELLS WITH SAME ID

  sinkingShip(grid: Cell[][], x: number, y: number) {
    for (let i = 0; i < grid[0].length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[x][y].boatId > 0 && grid[i][j].boatId == grid[x][y].boatId) {
          grid[i][j].type = "shipSunk";
        }
      }

    }
  }

  // COUNT THE NUMBER OF CELLS WITH SHIPSUNK TYPE

  howManySunkCells(grid: Cell[][]) {
    let result: number = 0;
    for (let i = 0; i < grid[0].length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j].type == "shipSunk") {
          result += 1;

        }
      }


    }
    console.log("nombre de cases coulées :" + result);
    return result;
  }

}