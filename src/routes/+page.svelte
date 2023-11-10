<script lang="ts">
	import type { CellData } from '$lib/types/cell';
	import { XYSelection } from '$lib/types/selection';
	import type { TargetData } from '$lib/types/target';

	import Cell from '../Cell.svelte';
	import Target from '../Target.svelte';

	const X = 10;
	const Y = 10;

	const CELL_SIZE = 30;
	const GRID_HEIGHT = CELL_SIZE * Y;
	const GRID_WIDTH = CELL_SIZE * X;

	const initialSetup = [new XYSelection(1, 3, 5, 8), new XYSelection(5, 1, 8, 6)];

	// Whether the current selection matches any targets.
	let matchingTarget = false;

	let grid: CellData[][] = [];

	let targets: TargetData[] = [
		{ value: 16, match: false, completed: false },
		{ value: 10, match: false, completed: false },
		{ value: 24, match: false, completed: false }
	];

	for (let i = 0; i < X; i++) {
		grid[i] = [];
		for (let j = 0; j < Y; j++) {
			let on = false;

			for (const rects of initialSetup) {
				if (rects.contains(i, j)) {
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

	let start: { x: number; y: number };
	let end: { x: number; y: number };

	let isDown: boolean = false;

	let currentSelection: XYSelection = new XYSelection();

	function isValidSelection(selection: XYSelection) {
		let isValid = true;
		selection.iterate((x, y) => {
			if (!grid[x][y].on || grid[x][y].removed) {
				isValid = false;
			}
		});
		return isValid;
	}

	function updateGridSelection() {
		for (let i = 0; i < X; i++) {
			for (let j = 0; j < Y; j++) {
				grid[i][j].selected = currentSelection.contains(i, j);
			}
		}
		grid = grid;

		// Check targets.
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
		matchingTarget = foundMatch;
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

		// Validate selection first. Only update the selection if it's valid.
		const tempSelection = currentSelection.copy();
		tempSelection.update(start, end);
		console.log(tempSelection, currentSelection);
		if (isValidSelection(tempSelection)) {
			currentSelection.updateFrom(tempSelection);
		} else {
			// Try updating the X coordinate only.
			let y = end.y > start.y ? currentSelection.maxY : currentSelection.minY;

			tempSelection.update(start, { x: end.x, y });
			if (isValidSelection(tempSelection)) {
				currentSelection.updateFrom(tempSelection);
			} else {
				// Try updating Y coordinate.
				tempSelection.update(start, { x: currentSelection.endX, y: end.y });
				if (isValidSelection(tempSelection)) {
					currentSelection.updateFrom(tempSelection);
				}
			}
		}

		currentSelection = currentSelection;

		updateGridSelection();
	}

	function onCellUp() {
		isDown = false;

		// Resolve targets.
		let matchFound = false;
		for (let target of targets) {
			if (target.match) {
				target.completed = true;
				matchFound = true;
			}
			target.match = false;
		}

		if (matchFound) {
			// Remove the cells.
			currentSelection.iterate((x, y) => (grid[x][y].removed = true));
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

<div class="mt-10 m-auto flex justify-center gap-8">
	{#each targets as target, i (target)}
		<Target {target} />
	{/each}
</div>

<div class="wrapper">
	{#each grid as row, x}
		{#each row as cellData, y}
			<Cell
				{x}
				{y}
				{cellData}
				{matchingTarget}
				size={isDown && start && x == start.x && y == start.y ? currentSelection.size : 0}
			/>
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

{#key currentSelection}
	<div>{JSON.stringify(currentSelection)}</div>
{/key}

<style>
	.wrapper {
		margin: 20px auto;
		display: grid;
		flex-direction: column;
		grid-auto-flow: column;
		border: 1px solid red;
		width: 302px;
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

	:global(html) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>
