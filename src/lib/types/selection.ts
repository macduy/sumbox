/** Represents a selection the grid. */
export class XYSelection {
	constructor(
		public minX: number = 0,
		public maxX: number = 0,
		public minY: number = -1,
		public maxY: number = -1
	) {}

	update(start: { x: number; y: number }, end: { x: number; y: number }) {
		this.minX = start.x;
		this.minY = start.y;
		this.maxX = end.x;
		this.maxY = end.y;
	}

	reset() {
		this.update({ x: 0, y: 0 }, { x: -1, y: -1 });
	}

	get isEmpty(): boolean {
		if (this.maxX < this.minX || this.maxY < this.minY) {
			return true;
		}
		return false;
	}

	get size(): number {
		if (this.isEmpty) {
			return 0;
		}
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
