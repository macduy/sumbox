import { X, Y } from '$lib/consts';
import type { LevelSpec } from '$lib/types/level';

export const LEVEL_EDITOR_META: LevelSpec = {
	name: '',
	targets: [-1],
	rects: [[0, 0, X, Y]]
};

export const LEVELS: LevelSpec[] = [
	{
		name: 'Square',
		targets: [16],
		rects: [[4, 1, 7, 4]]
	},
	{
		name: 'Islands',
		targets: [8, 9, 24],
		rects: [
			[2, 2, 4, 4],
			[6, 1, 9, 6],
			[2, 8, 9, 8]
		]
	},
	{
		name: 'Letter',
		targets: [8, 16, 16],
		rects: [
			[2, 3, 3, 10],
			[4, 6, 7, 7],
			[8, 3, 9, 10]
		]
	},
	{
		name: 'Blocks',
		targets: [16, 10, 24],
		rects: [
			[6, 3, 9, 6],
			[5, 1, 9, 2],
			[2, 3, 5, 8]
		]
	},
	{
		name: 'Flower',
		targets: [6, 6, 6, 6, 10],
		rects: [
			[1, 2, 3, 3],
			[5, 6, 7, 7],
			[2, 4, 6, 5],
			[6, 1, 7, 3],
			[1, 6, 2, 8]
		],
		shift: { x: 2, y: 0 }
	},
	{
		name: 'Box',
		targets: [6, 6, 9, 15],
		rects: [
			[3, 2, 5, 4],
			[3, 5, 7, 7],
			[6, 2, 7, 4],
			[8, 2, 8, 7]
		]
	},
	{
		name: 'Peekabo',
		targets: [8, 12, 20, 20],
		rects: [
			[1, 1, 5, 4],
			[6, 0, 7, 9],
			[1, 5, 2, 8],
			[3, 6, 5, 9]
		],
		shift: { x: 1, y: 0 }
	},
	{
		name: 'Telephone',
		targets: [4, 9, 5, 12, 12],
		rects: [
			[3, 2, 3, 10],
			[3, 11, 8, 12],
			[4, 2, 4, 6],
			[5, 2, 8, 4],
			[4, 7, 4, 10]
		]
	},
	{
		name: 'Duck',
		targets: [10, 10, 12, 7, 7, 8, 14, 24],
		rects: [
			[1, 2, 4, 3],
			[5, 1, 8, 6],
			[3, 5, 4, 10],
			[5, 7, 9, 8],
			[10, 6, 10, 12],
			[3, 11, 9, 12],
			[1, 9, 2, 13],
			[3, 13, 9, 13]
		]
	},
	{
		name: 'Block',
		targets: [8, 9, 12, 16, 24],
		rects: [
			[1, 1, 3, 8],
			[4, 3, 7, 5],
			[4, 6, 7, 9],
			[8, 1, 8, 9],
			[4, 1, 7, 2]
		],
		shift: { x: 1, y: 0 }
	}
];

for (let i = 0; i < LEVELS.length; i++) {
	LEVELS[i].number = i + 1;
}
