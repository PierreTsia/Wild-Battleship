import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { GameComponent } from './components/game/game.component'
import { Cell } from './models/cell';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';


@Injectable()
export class GameService {
  //realPlayer ;
  playerNumber: number;

  public message = ["Bateau touché", "Bateau coulé", "Tous les bateaux coulés"];
  public eventObserver: Observable<{}>;

  constructor(private db: AngularFireDatabase, private authService: AuthService ) {

    this.playerNumber = 1;
    this.eventObserver= db.object('room/event').valueChanges();
  }

  isMyGrid(gridNumber: number) {
    return ((this.playerNumber == 1 && gridNumber == 1) ||
      (this.playerNumber == 2 && gridNumber == 2));
  }

  clicked(grille: Cell[][], x: number, y: number, gridNumber: number) {
    if (this.isMyGrid(gridNumber)) {
      console.log("hummmm???"+this.authService.authState.displayName)
      return;
      
    }

    console.log("Opponent grille : " + x + ", " + y);

    //CLONE GRID TO BE SENT TO FIREBASE DB
    let tmpGrid = Object.assign({}, grille);

    //CHANGE CELL TYPE ON HIT
    this.onHitCell(tmpGrid, x, y);


    //LOOP THROUGH THE GRID AND COUNT THE CELLS WITH SAME ID AND TYPE BOAT

    if (tmpGrid[x][y].boatId != 0 && this.onScanGrid(tmpGrid, x, y) == 0) {

      tmpGrid[x][y].type = "sunkShip";
      this.db.object('room/event')
      .set(this.message[1]);
      this.sinkingShip(tmpGrid, x, y);
    }

    //TELLS IF ALL SHIPS ARE SUNK

    if (this.howManySunkCells(tmpGrid) == 17) {
      this.db.object('room/event')
      .set(this.message[2]);
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
      this.db.object('room/event')
      .set(this.message[0]);
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