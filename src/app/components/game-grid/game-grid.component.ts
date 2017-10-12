import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-game-grid',
  templateUrl: './game-grid.component.html',
  styleUrls: ['./game-grid.component.css']
})
export class GameGridComponent implements OnInit {

  @Input() onClickedItem: Function;
  @Input() firebaseDBPath: string;

  getNgClass(j) {
    if (this.firebaseDBPath == "/grid1") {
      return { 'water': j != 'Clicked', 'clicked': j == 'Clicked', 'boated': j == 'boat' };
    }
    return { 'waterRed': j != 'Clicked', 'clicked': j == 'Clicked', 'boated': j == 'boat' };
  }

  grilleVierge = [
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"],
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"],
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"],
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"],
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"],
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"],
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"],
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"],
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"]
  ];


  grille = [
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"],
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"],
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"],
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"],
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"],
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"],
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"],
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"],
    ["water", "water", "water", "water", "water", "water", "water", "water", "water"]
  ];

  isClicked: boolean = false;
  isGridFull = false;

  boat = [[], [], []];



  constructor(private db: AngularFireDatabase) { }



  ngOnInit() {
    this.db.object('room/' + this.firebaseDBPath).update(this.grille);
    this.db.object('room/' + this.firebaseDBPath).valueChanges().subscribe((data: string[][]) => {
      console.log(data);
      this.grille = data;
    });
  }

  onItemClicked(x, y) {
    let tmpGrid = Object.assign({}, this.grille);
    tmpGrid[y][x] = "Clicked";
    console.log(x);
    console.log(y);
    this.db.object('room/' + this.firebaseDBPath).update(tmpGrid);
    // let clickedSquare = tmpGrid[x][y];
    if (this.onClickedItem) {
      this.onClickedItem(x, y);
      console.log("this.firebaseDBPath:" + this.firebaseDBPath);
    }
  }

  resetGrid() {
    this.db.object('room/' + this.firebaseDBPath).update(this.grilleVierge);
    this.isGridFull = false;
  }

  isBoated(grid: string[][], x: number, y: number) {
    return this.getCellValue(this.grille, x, y) == "boat";
  }

  getCellValue(grid: string[][], x: number, y: number) {
    return grid[x][y];
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

  isBoatInGrid(grid: string[][], x: number, y: number, direction: string, size: number) {
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

  collisionAvoided(grid: string[][], x: number, y: number, direction: string, size: number) {
    let i = 0;
    while (i < size) {
      switch (direction) {
        case "left":
          if (grid[x - i][y] == "boat") {
            return false;
          }
          break;
        case "up":
          if (grid[x][y - i] == "boat") {
            return false;
          }
          break;
        case "right":
          if (grid[x + i][y] == "boat") {
            return false;
          }
          break;
        case "down":
        default:
          if (grid[x][y + i] == "boat") {
            return false;
          }
          break;
      }
      i++;
    }
    return true;
  }

  placeBoat(grid: string[][], x: number, y: number, direction: string, size: number) {
    let i = 0;
    while (i < size) {
      switch (direction) {
        case "left":
          grid[x - i][y] = "boat";
          break;
        case "up":
          grid[x][y - i] = "boat";
          break;
        case "right":
          grid[x + i][y] = "boat";
          break;
        case "down":
        default:
          grid[x][y + i] = "boat";
          break;
      }
      i++;
    }
  }

  addShip(size: number) {
    let found = false;
    let i = 0;
    while (!found && i<100) {
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


  generatePlayerGrid(){
    this.addShip(5);
    this.addShip(4);
    this.addShip(3);
    this.addShip(3);
    this.addShip(2);
    this.isGridFull = true;
  }
}
