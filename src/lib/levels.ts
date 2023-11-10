import type { LevelSpec } from '$lib/types/level';

export const LEVEL_EDITOR_META: LevelSpec = {
	targets: [-1],
	rects: [[0, 0, 10, 10]]
};

export const LEVELS: LevelSpec[] = [
	{
		targets: [16, 10, 24],
		rects: [
			[1, 3, 5, 8],
			[5, 1, 8, 6]
		]
	},
	{
		targets: [12, 12, 8, 4],
		rects: [
			[2, 2, 7, 3],
			[3, 4, 5, 7],
			[6, 4, 7, 7],
			[2, 4, 2, 7]
		]
	},
	{
		targets: [20, 20, 8, 12],
		rects: [
			[1, 1, 5, 4],
			[6, 0, 7, 9],
			[1, 5, 2, 8],
			[3, 6, 5, 9]
		]
	},
	{
		targets: [6, 6, 10, 6, 6],
		rects: [
			[1, 2, 3, 3],
			[5, 6, 7, 7],
			[2, 4, 6, 5],
			[6, 1, 7, 3],
			[1, 6, 2, 8]
		]
	},
	{
		targets: [24, 12, 16, 9, 8],
		rects: [
			[1, 1, 3, 8],
			[4, 3, 7, 5],
			[4, 6, 7, 9],
			[8, 1, 8, 9],
			[4, 1, 7, 2]
		]
	},
	{
		targets: [12, 12, 12, 9],
		rects: [
			[1, 1, 6, 2],
			[2, 3, 4, 6],
			[3, 7, 6, 9],
			[0, 7, 2, 9]
		]
	}
];
