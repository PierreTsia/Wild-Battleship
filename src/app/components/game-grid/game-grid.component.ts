import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';
import { Cell } from '../../models/cell'

@Component({
  selector: 'app-game-grid',
  templateUrl: './game-grid.component.html',
  styleUrls: ['./game-grid.component.css']
})
export class GameGridComponent implements OnInit {

  @Input() onClickedItem: Function;
  @Input() firebaseDBPath: string;

  getNgClass(cell) {
    let ngClassObject = {
      'clicked': cell.type == 'Clicked',
      'boated': cell.type == 'boat',
      'waterHitClass': cell.type == "waterHit",
      'boatHitClass': cell.type == "boatHit",
      'shipSunkClass': cell.type == "shipSunk"
    };

    if (this.firebaseDBPath == "/grid1") {
      ngClassObject["water"] = cell.type == "water"
    } else if (this.firebaseDBPath == "/grid2") {
      ngClassObject["waterRed"] = cell.type == "water"
    }
    return ngClassObject;
  }



  grilleVierge = [

    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()],
    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()],
    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()],
    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()],
    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()],
    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()],
    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()],
    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()],
    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()]

  ];


  grille = [
    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()],
    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()],
    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()],
    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()],
    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()],
    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()],
    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()],
    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()],
    [Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell(), Cell.newWaterCell()]

  ];

  isClicked: boolean = false;
  isGridFull = false;


  private idBoat: number = 0;
  constructor(private db: AngularFireDatabase) { }



  ngOnInit() {
    this.db.object('room/' + this.firebaseDBPath).update(this.grille);
    this.db.object('room/' + this.firebaseDBPath).valueChanges().subscribe((data: Cell[][]) => {
      this.grille = data;
    });
  }

  
  //CHANGE CELL TYPE ON HIT (IF BOAT => BOATHIT / IF WATER=>WATERHIT)
  onHitCell(grid: Cell[][], x: number, y: number) {
    if (this.getCellValue(grid, x, y) == "boat") {
      return grid[x][y].type = "boatHit";
    } else if (this.getCellValue(grid, x, y) == "water") {
      return grid[x][y].type = "waterHit";
    }
  }


  onItemClicked(x, y) {

    //CLONE GRID TO BE SENT TO FIREBASE DB
    let tmpGrid = Object.assign({}, this.grille);




    //CHANGE CELL TYPE ON HIT
    this.onHitCell(tmpGrid, x, y);

 
    //LOOP THROUGH THE GRID AND COUNT THE CELLS WITH SAME ID AND TYPE BOAT

    if (tmpGrid[x][y].boatId!= 0 && this.onScanGrid(tmpGrid, x, y) == 0) {

      tmpGrid[x][y].type = "sunkShip";
      alert("bateau coulé ID:" + tmpGrid[x][y].boatId);
      this.sinkingShip(tmpGrid, x, y);
    }

    //TELLS IF ALL SHIPS ARE SUNK

    if (this.howManyBoatCells(tmpGrid) == 0){
      alert("all ships sunk")
    }

    //SEND UPDATED GRID TO FIREBASE DB
    this.db.object('room/' + this.firebaseDBPath).update(tmpGrid);
    if (this.onClickedItem) {
      this.onClickedItem(x, y);
      console.log("this.firebaseDBPath:" + this.firebaseDBPath);
    }
  }

  //LOOP THROUGH THE GRID AND COUNT THE CELLS WITH SAME ID AND TYPE BOAT

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


  // COUNT THE NUMBER OF CELLS WITH "BOAT" TYPE

  howManyBoatCells (grid: Cell[][]){
    let result = 0;
    for (let i = 0; i < grid[0].length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j].type == "boat") {
          result++;
        }
      }
      return result;
    }

  }
  resetGrid() {
    this.db.object('room/' + this.firebaseDBPath).update(this.grilleVierge);
    this.isGridFull = false;
  }

  isBoated(grid: Cell[][], x: number, y: number) {
    return this.getCellValue(Cell[x][y].type, x, y) == "boat";
  }

  getCellValue(grid: Cell[][], x: number, y: number) {
    return grid[x][y].type;
  }

  generateDirection() {
    let direction = Math.floor(Math.random() * 4);
    switch (direction) {
      case 0:
        return "left";
      case 1:
        return "up";
      case 2:
        return "right";
      case 3:
      default:
        return "down";
    }
  }

  isBoatInGrid(grid: Cell[][], x: number, y: number, direction: string, size: number) {
    switch (direction) {
      case "left":
        return x >= size - 1;
      case "up":
        return y >= size - 1;
      case "right":
        return x <= grid.length - size;
      case "down":
      default:
        return y <= grid[0].length - size;
    }
  }

  collisionAvoided(grid: Cell[][], x: number, y: number, direction: string, size: number) {
    let i = 0;
    while (i < size) {
      switch (direction) {
        case "left":
          if (grid[x - i][y].type == "boat") {
            return false;
          }
          break;
        case "up":
          if (grid[x][y - i].type == "boat") {
            return false;
          }
          break;
        case "right":
          if (grid[x + i][y].type == "boat") {
            return false;
          }
          break;
        case "down":
        default:
          if (grid[x][y + i].type == "boat") {
            return false;
          }
          break;
      }
      i++;
    }
    return true;
  }

  randomizeBoatId() {
    this.idBoat = Math.floor(Math.random() * 1000)
  }
  placeBoat(grid: Cell[][], x: number, y: number, direction: string, size: number) {
    let i = 0;
    this.randomizeBoatId();

    while (i < size) {
      switch (direction) {
        case "left":

          grid[x - i][y].boatId = this.idBoat;
          grid[x - i][y].type = "boat";

          break;
        case "up":

          grid[x][y - i].boatId = this.idBoat;
          grid[x][y - i].type = "boat";

          break;
        case "right":

          grid[x + i][y].boatId = this.idBoat;
          grid[x + i][y].type = "boat";

          break;
        case "down":
        default:

          grid[x][y + i].boatId = this.idBoat;
          grid[x][y + i].type = "boat";

          break;
      }
      i++;

    }
  }

  addShip(size: number) {
    let found = false;
    let i = 0;
    while (!found && i < 100) {
      let xpos = Math.floor(Math.random() * 9);
      let ypos = Math.floor(Math.random() * 9);
      let direction = this.generateDirection();
      console.log("try : " + xpos + "and " + ypos + " with direction : " + direction)
      if (this.isBoatInGrid(this.grille, xpos, ypos, direction, size) &&
        this.collisionAvoided(this.grille, xpos, ypos, direction, size)) {
        let tmpGrid = Object.assign({}, this.grille);
        this.placeBoat(tmpGrid, xpos, ypos, direction, size);
        this.db.object('room/' + this.firebaseDBPath).update(tmpGrid);
        found = true;
      }
      i++;
    }
  }


  generatePlayerGrid() {
    this.addShip(5);
    this.addShip(4);
    this.addShip(3);
    this.addShip(3);
    this.addShip(2);
    this.isGridFull = true;


  }
}
