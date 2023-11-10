<script lang="ts">
	import { X, Y } from '$lib/consts';
	import { LEVELS, LEVEL_EDITOR_META } from '$lib/levels';
	import type { CellData } from '$lib/types/cell';
	import { setupGame, type LevelSpec } from '$lib/types/level';
	import { XYSelection } from '$lib/types/selection';
	import type { TargetData } from '$lib/types/target';

	import Cell from '../Cell.svelte';
	import Target from '../Target.svelte';

	// Level editor stuff
	const urlParams = new URLSearchParams(window.location.search);
	export const isLevelEditorEnabled = urlParams.has('enableLevelEditor');
	let levelEditor: LevelSpec = { targets: [], rects: [] };

	const CELL_SIZE = 30;
	const GRID_HEIGHT = CELL_SIZE * Y;
	const GRID_WIDTH = CELL_SIZE * X;

	// Whether the current selection matches any targets.
	let matchingTarget = false;

	let currentLevel: LevelSpec = isLevelEditorEnabled ? LEVEL_EDITOR_META : LEVELS[0];

	$: {
		setupGameFor(currentLevel);
		forceRefresh();
	}

	function forceRefresh() {
		grid = grid;
		targets = targets;
	}

	function setupGameFor(level: LevelSpec) {
		console.log('Setup game');
		setupGame(level, grid, targets);
	}

	// Game state
	let grid: CellData[][] = [];
	let targets: TargetData[] = [];

	let start: { x: number; y: number };
	let end: { x: number; y: number };

	let isDown: boolean = false;

	let currentSelection: XYSelection = new XYSelection();

	function reset() {
		currentLevel = currentLevel;
		levelEditor = { targets: [], rects: [] };
	}

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
		// If level editor is on, any size is allowed.
		let foundMatch: boolean = isLevelEditorEnabled;
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
		if (isValidSelection(tempSelection)) {
			currentSelection.updateFrom(tempSelection);
		} else {
			tempSelection.update(start, { x: end.x, y: currentSelection.endY });
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

		// Resolve targets. If level editor is on, any selection is allowed.
		let matchFound = isLevelEditorEnabled;
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

		if (isLevelEditorEnabled) {
			levelEditor.targets.push(currentSelection.size);
			levelEditor.rects.push([
				currentSelection.minX,
				currentSelection.minY,
				currentSelection.maxX,
				currentSelection.maxY
			]);

			levelEditor = levelEditor;
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

<div class="flex justify-center gap-2">
	<button
		class="bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded"
		on:click={reset}>Reset</button
	>
	{#each LEVELS as level, i (i)}
		<button
			class="bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded"
			on:click={() => (currentLevel = level)}>Level {i + 1}</button
		>
	{/each}
</div>

{#if isLevelEditorEnabled}
	<pre>
	{JSON.stringify(levelEditor)}
	</pre>
{/if}

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
