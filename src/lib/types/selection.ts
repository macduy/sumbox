/** Represents a selection the grid. */
export class XYSelection {
	public minX: number;
	public maxX: number;
	public minY: number;
	public maxY: number;

	constructor(
		startX: number = 0,
		startY: number = -1,
		public endX: number = 0,
		public endY: number = -1
	) {
		this.endX = endX;
		this.endY = endY;
		this.minX = Math.min(startX, endX);
		this.minY = Math.min(startY, endY);
		this.maxX = Math.max(startX, endX);
		this.maxY = Math.max(startY, endY);
	}

	update(start: { x: number; y: number }, end: { x: number; y: number }) {
		this.minX = Math.min(start.x, end.x);
		this.minY = Math.min(start.y, end.y);
		this.maxX = Math.max(start.x, end.x);
		this.maxY = Math.max(start.y, end.y);
		this.endX = end.x;
		this.endY = end.y;
	}

	copy(): XYSelection {
		const s = new XYSelection();
		s.updateFrom(this);
		return s;
	}

	updateFrom(selection: XYSelection) {
		this.endX = selection.endX;
		this.endY = selection.endY;
		this.minX = selection.minX;
		this.maxX = selection.maxX;
		this.minY = selection.minY;
		this.maxY = selection.maxY;
	}

	reset() {
		this.update({ x: -1, y: -1 }, { x: -1, y: -1 });
	}

	get size(): number {
		return (this.maxX - this.minX + 1) * (this.maxY - this.minY + 1);
	}

	get isSquare(): boolean {
		return this.maxX - this.minX === this.maxY - this.minY;
	}

	contains(x: number, y: number): boolean {
		return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
	}

	iterate(callback: (x: number, y: number) => void) {
		for (let x = this.minX; x <= this.maxX; x++) {
			for (let y = this.minY; y <= this.maxY; y++) {
				callback(x, y);
			}
		}
	}
}
