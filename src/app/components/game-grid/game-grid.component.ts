import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';
import { GameService } from '../../game.service';
import { Cell } from '../../models/cell'


@Component({
  selector: 'app-game-grid',
  templateUrl: './game-grid.component.html',
  styleUrls: ['./game-grid.component.css']
})
export class GameGridComponent implements OnInit {

  @Input() gridNumber: number;

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
  public turnStatus;

  private idBoat: number = 0;
  constructor(private db: AngularFireDatabase, public authService: AuthService, public gameService: GameService) { }


  getNgClass(cell) {
    let ngClassObject = {
      'clicked': cell.type == 'Clicked',
      'waterHitClass': cell.type == "waterHit",
      'boatHitClass': cell.type == "boatHit",
      'shipSunkClass': cell.type == "shipSunk"
    };

    if ((this.gameService.playerNumber == 1 && this.gridNumber == 1) ||
      (this.gameService.playerNumber == 2 && this.gridNumber == 2)) {
      // MY GRID
      ngClassObject["water"] = cell.type == "water";
      ngClassObject["boated"] = cell.type == "boat";
    } else { // OPPONENT GRID
      ngClassObject["waterRed"] = cell.type == "water";
      ngClassObject["opponentBoat"] = cell.type == "boat";
    }

    return ngClassObject;
  }

  getFirebaseDBPath() {
    return "/grid" + this.gridNumber;
  }

  ngOnInit() {
    this.db.object('room/' + this.getFirebaseDBPath()).update(this.grille);
    this.db.object('room/' + this.getFirebaseDBPath()).valueChanges().subscribe((data: Cell[][]) => {
      this.grille = data;
      
    });
    this.gameService.turnObserver.subscribe((turn) => {
      this.turnStatus = turn;
      console.log("this is turn from game grid:"+this.turnStatus);
      console.log("this is playerNumber from game grid:"+this.gameService.playerNumber);
      
    });
  }

  onItemClicked(x, y) {
    this.gameService.clicked(this.grille, x, y, this.gridNumber);
    
  }



  resetGrid() {
    this.db.object('room/' + this.getFirebaseDBPath()).update(this.grilleVierge);
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
        this.db.object('room/' + this.getFirebaseDBPath()).update(tmpGrid);
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

  generateMessage(string){
    return "My message is "+string;
  }

}

