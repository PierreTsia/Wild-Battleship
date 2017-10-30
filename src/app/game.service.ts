import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { GameComponent } from './components/game/game.component'
import { Cell } from './models/cell';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';


@Injectable()
export class GameService {
  //realPlayer ;
  playerNumber: number;
  audio: any;

  public message = ["Bateau touché", "Bateau coulé", "Tous les bateaux coulés", ""];
  public eventObserver: Observable<{}>;
  public turnObserver: Observable<any>;
  public winnerObserver: Observable<any>;
  //  private myTurn:boolean = true;

  constructor(private db: AngularFireDatabase) {
    this.eventObserver = db.object('room/event').valueChanges();
    this.turnObserver = db.object('room/turn').valueChanges();
    this.winnerObserver = db.object('room/winner').valueChanges();
  }

  changeTurn(player: number) {
    if (player == 1) {
      this.db.object('room/turn')
        .set(2);
    } else {
      this.db.object('room/turn')
        .set(1);

    }
  }

  isMyGrid(gridNumber: number) {
    
    return ((this.playerNumber == 1 && gridNumber == 1) ||
      (this.playerNumber == 2 && gridNumber == 2));
  }

  clicked(grille: Cell[][], x: number, y: number, gridNumber: number) {
    if (this.isMyGrid(gridNumber)) {
      //console.log("hummmm???"+this.authService.authState.displayName)
      return;

    }



    //CLONE GRID TO BE SENT TO FIREBASE DB
    let tmpGrid = Object.assign({}, grille);

    //CHANGE CELL TYPE ON HIT
    this.onHitCell(tmpGrid, x, y);


    //CHANGE TURN NODE ON FB
    this.changeTurn(this.playerNumber);

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
      this.db.object('room/winner')
        .set(this.playerNumber);
        this.playsoundOnVictory();
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
     this.playsoundOnHitclick();
      return grid[x][y].type = "boatHit";


    } else if (this.getCellValue(grid, x, y) == "water") {
      this.playsoundOnclick();
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


  checkMyUserNumber(userObs: Observable<firebase.User>) {

    let userIdObs = userObs.map((user) => {
      return user.uid;
    });

    let playersObs = this.db.object("/room/players")
      .valueChanges()
      .take(1)
      .do((players) => {
        console.log(players);
      })

    return Observable.combineLatest(userIdObs, playersObs, (userId, players: { player1: string, player2: string }) => {

      console.log("playerId: " + userId);
      console.log(players);

      if (players.player1 == userId) {
        console.log("OK");
        return 1;
      } else {
        console.log("KO");
        return 2;
      }
    }).do((playerNumber) => {
      this.playerNumber = playerNumber;
    });
  }
  playsoundStart() {
    this.audio = new Audio();
    this.audio.src = "../../../assets/sound/Seagull_0.mp3";
    this.audio.load();
    this.audio.play()
  }
  playsoundOnclick() {

    this.audio = new Audio();
    this.audio.src = "../../../assets/sound/Sonar_Coat.mp3";
    this.audio.load();
    this.audio.play();
  }
  playsoundOnHitclick() {

    this.audio = new Audio();
    this.audio.src = "../../../assets/sound/explosion_hyd.mp3";
    this.audio.load();
    this.audio.play();
  }
  playsoundOnVictory() {

    this.audio = new Audio();
    this.audio.src = "../../../assets/sound/Seagull_0.mp3";
    this.audio.load();
    this.audio.play();
  }
}