<script lang="ts">
	import type { CellData } from '$lib/types/cell';
	import { XYSelection } from '$lib/types/selection';
	import type { TargetData } from '$lib/types/target';
	import { circOut } from 'svelte/easing';
	import Cell from '../Cell.svelte';

	const X = 10;
	const Y = 10;

	const CELL_SIZE = 20;
	const GRID_HEIGHT = CELL_SIZE * Y;
	const GRID_WIDTH = CELL_SIZE * X;

	let grid: CellData[][] = [];

	let targets: TargetData[] = [
		{ value: 16, match: false, completed: false },
		{ value: 10, match: false, completed: false },
		{ value: 24, match: false, completed: false }
	];

	for (let i = 0; i < X; i++) {
		grid[i] = [];
		for (let j = 0; j < Y; j++) {
			grid[i][j] = {
				on: true,
				removed: false,
				selected: false
			};
		}
	}

	let start: { x: number; y: number };
	let end: { x: number; y: number };

	let isDown: boolean = false;

	let currentSelection: XYSelection = new XYSelection();

	function updateGridSelection() {
		for (let i = 0; i < X; i++) {
			for (let j = 0; j < Y; j++) {
				grid[i][j].selected = currentSelection.contains(i, j);
			}
		}
		grid = grid;
	}

	function onCellDown(x: number, y: number) {
		console.log(x, y);
		isDown = true;
		start = { x, y };
		end = { x, y };
		currentSelection.update(start, start);
		updateGridSelection();
	}

	function onCellMove(x: number, y: number) {
		if (!isDown) {
			return;
		}

		end = { x, y };
		currentSelection.update(start, end);

		// Update targets
		const size = currentSelection.size;
		let foundMatch: boolean = false;
		for (let target of targets) {
			if (target.completed) {
				continue;
			}
			if (!foundMatch && target.value == size) {
				target.match = true;
				foundMatch = true;
			} else {
				target.match = false;
			}
		}
		targets = targets;

		updateGridSelection();
	}

	function onCellUp() {
		isDown = false;

		currentSelection.iterate((x, y) => (grid[x][y].removed = true));

		// Resolve targets.
		let matchFound = false;
		for (let target of targets) {
			if (target.match) {
				target.completed = true;
				matchFound = true;
			}
			target.match = false;
		}

		currentSelection.reset();
		updateGridSelection();
	}

	function clampX(x: number): number {
		if (x >= GRID_WIDTH) return GRID_WIDTH - 1;
		if (x < 0) return 0;
		return x;
	}

	function clampY(y: number): number {
		if (y >= GRID_HEIGHT) return GRID_HEIGHT - 1;
		if (y < 0) return 0;
		return y;
	}

	function convertToCellCoords(e: MouseEvent): [number, number] {
		return [clampX(Math.floor(e.offsetX / CELL_SIZE)), clampY(Math.floor(e.offsetY / CELL_SIZE))];
	}

	function convertTouchToCellCoords(e: TouchEvent): [number, number] {
		const rect = (e.target as any).getBoundingClientRect();
		const offsetX = e.touches[0].pageX - rect.left;
		const offsetY = e.touches[0].pageY - rect.top;
		return [clampX(Math.floor(offsetX / CELL_SIZE)), clampY(Math.floor(offsetY / CELL_SIZE))];
	}
</script>

<div class="wrapper">
	{#each grid as row, x}
		{#each row as cellData, y}
			<Cell {x} {y} {cellData} />
		{/each}
	{/each}
	<div
		class="interactor"
		role="none"
		on:mousedown={(e) => {
			onCellDown(...convertToCellCoords(e));
		}}
		on:mousemove={(e) => {
			onCellMove(...convertToCellCoords(e));
		}}
		on:mouseup={(e) => {
			onCellUp();
		}}
		on:touchstart={(e) => {
			onCellDown(...convertTouchToCellCoords(e));
		}}
		on:touchmove={(e) => {
			onCellMove(...convertTouchToCellCoords(e));
		}}
		on:touchend={(e) => {
			console.log(e);
			onCellUp();
		}}
	/>
</div>

<div>
	{#each targets as target, i (target)}
		<div>{target.value} {target.match}</div>
	{/each}
</div>

<style>
	.wrapper {
		margin: 20px auto;
		display: grid;
		flex-direction: column;
		grid-auto-flow: column;
		border: 1px solid red;
		width: 200px;
		grid-template-columns: repeat(10, 1fr);
		grid-template-rows: repeat(10, 1fr);
		position: relative;
	}

	.interactor {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}
</style>
