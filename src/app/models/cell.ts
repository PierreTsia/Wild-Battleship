export class Cell {
    type: string;
    boatId: number;

    public static newWaterCell(): Cell {
        let waterCell = new Cell();
        waterCell.type = "water";
        waterCell.boatId = 0;
        return waterCell;
    }
}


