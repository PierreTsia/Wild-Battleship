import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
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

  isClicked:boolean = false;



  constructor(private db: AngularFireDatabase) { }
  
 

  ngOnInit() {
    this.db.object("/grid").update(this.grille);
    this.db.object("/grid").valueChanges().subscribe((data: string[][]) => {
      console.log(data);
      this.grille = data;
    });
  }

  onItemClicked(x, y) {
  

    let tmpGrid = Object.assign({}, this.grille);

    tmpGrid[x][y] = "Clicked";

    this.db.object("/grid").update(tmpGrid);
    let clickedSquare = tmpGrid[x][y];
    

  }

  resetGrid(){
    this.grille=[
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
  }


}
