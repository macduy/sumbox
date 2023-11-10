/** Represents a selection the grid. */
export class XYSelection {
	constructor(
		public startX: number = 0,
		public minY: number = -1,
		public endX: number = 0,
		public maxY: number = -1
	) {}

	update(start: { x: number; y: number }, end: { x: number; y: number }) {
		this.startX = start.x;
		this.minY = Math.min(start.y, end.y);
		this.endX = end.x;
		this.maxY = Math.max(start.y, end.y);
	}

	copy(): XYSelection {
		return new XYSelection(this.startX, this.endX, this.minY, this.minY);
	}

	updateFrom(selection: XYSelection) {
		this.startX = selection.startX;
		this.endX = selection.endX;
		this.minY = selection.minY;
		this.maxY = selection.maxY;
	}

	reset() {
		this.update({ x: 0, y: 0 }, { x: -1, y: -1 });
	}

	get isEmpty(): boolean {
		if (this.endX < this.startX) {
			return true;
		}
		return false;
	}

	get size(): number {
		if (this.isEmpty) {
			return 0;
		}
		return (this.endX - this.startX + 1) * (this.maxY - this.minY + 1);
	}

	get isSquare(): boolean {
		return this.endX - this.startX === this.maxY - this.minY;
	}

	contains(x: number, y: number): boolean {
		return x >= this.startX && x <= this.endX && y >= this.minY && y <= this.maxY;
	}

	iterate(callback: (x: number, y: number) => void) {
		for (let x = this.startX; x <= this.endX; x++) {
			for (let y = this.minY; y <= this.maxY; y++) {
				callback(x, y);
			}
		}
	}
}
