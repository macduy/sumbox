import { X, Y } from '$lib/consts';
import type { CellData } from '$lib/types/cell';
import { XYSelection } from '$lib/types/selection';
import type { TargetData } from '$lib/types/target';

export type LevelSpec = {
	targets: number[];
	rects: [number, number, number, number][];
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
		rects.push(new XYSelection(...rect));
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
