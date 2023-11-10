
export type CellData = {
  // Whether the cell is part of this level.
  on: boolean;
  // Whether the cell has been removed by the player.
  removed: boolean;
  // If the cell is currently selected.
  selected: boolean;
};