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
      return { 'water': j != 'Clicked', 'clicked': j == 'Clicked' };
    }
    return { 'waterRed': j != 'Clicked', 'clicked': j == 'Clicked' };
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



  constructor(private db: AngularFireDatabase) { }



  ngOnInit() {
    this.db.object('room/'+this.firebaseDBPath).update(this.grille);
    this.db.object('room/'+this.firebaseDBPath).valueChanges().subscribe((data: string[][]) => {
      console.log(data);
      this.grille = data;
    });
  }

  onItemClicked(y, x) {


    let tmpGrid = Object.assign({}, this.grille);

    tmpGrid[y][x] = "Clicked";
    console.log(x);
    console.log(y);

    this.db.object('room/'+this.firebaseDBPath).update(tmpGrid);
    // let clickedSquare = tmpGrid[x][y];

    if (this.onClickedItem) {
      this.onClickedItem(x, y);
      console.log(this.firebaseDBPath);
    }


  }

  resetGrid() {
    this.db.object('room/'+this.firebaseDBPath).update(this.grilleVierge);

  }




}
