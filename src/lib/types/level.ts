import { X, Y } from '$lib/consts';
import type { CellData } from '$lib/types/cell';
import { XYSelection } from '$lib/types/selection';
import type { TargetData } from '$lib/types/target';

export type LevelSpec = {
	name: string;
	targets: number[];
	rects: [number, number, number, number][];
	/** shift all the rects by this much */
	shift?: { x: number; y: number };
	number?: number;
};

export function setupGame(spec: LevelSpec, grid: CellData[][], targets: TargetData[]) {
	targets.length = 0;

	for (const targetValue of spec.targets) {
		targets.push({
			value: targetValue,
			match: false,
			completed: false
		});
	}

	// convert rects into selections.
	const rects: XYSelection[] = [];
	for (const rect of spec.rects) {
		const rectCopy = [...rect];
		if (spec.shift) {
			rectCopy[0] += spec.shift.x;
			rectCopy[2] += spec.shift.x;
			rectCopy[1] += spec.shift.y;
			rectCopy[3] += spec.shift.y;
		}
		rects.push(new XYSelection(...rectCopy));
	}

	for (let i = 0; i < X; i++) {
		grid[i] = [];
		for (let j = 0; j < Y; j++) {
			let on = false;

			for (const rect of rects) {
				if (rect.contains(i, j)) {
					on = true;
					break;
				}
			}

			grid[i][j] = {
				on,
				removed: false,
				selected: false
			};
		}
	}
}
