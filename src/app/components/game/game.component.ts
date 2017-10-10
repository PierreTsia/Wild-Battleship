import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
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

  isClicked:boolean = false;



  constructor(private db: AngularFireDatabase) { }
  
 

  ngOnInit() {
    this.db.object("/grid").update(this.grille);
    this.db.object("/grid").valueChanges().subscribe((data: string[][]) => {
      console.log(data);
      this.grille = data;
    });
  }

  onItemClicked(y, x) {
  

    let tmpGrid = Object.assign({}, this.grille);

    tmpGrid[y][x] = "Clicked";
    console.log(x);
    console.log(y);

    this.db.object("/grid").update(tmpGrid);
   // let clickedSquare = tmpGrid[x][y];
    

  }

  resetGrid(){
    this.db.object("/grid").update(this.grilleVierge);
    
  }


}
