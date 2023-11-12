<script lang="ts">
	import { X, Y } from '$lib/consts';
	import { LEVELS, LEVEL_EDITOR_META } from '$lib/levels';
	import type { CellData } from '$lib/types/cell';
	import { setupGame, type LevelSpec } from '$lib/types/level';
	import { XYSelection } from '$lib/types/selection';
	import type { TargetData } from '$lib/types/target';
	import type { UndoStep } from '$lib/types/undo';

	import Cell from '../Cell.svelte';
	import LevelComplete from '../LevelComplete.svelte';
	import Targets from '../Targets.svelte';
	import Tutorial from '../Tutorial.svelte';

	// Level editor stuff
	const urlParams = new URLSearchParams(window.location.search);
	export const isLevelEditorEnabled = urlParams.has('enableLevelEditor');
	let levelEditor: LevelSpec = { name: '', targets: [], rects: [] };

	const CELL_SIZE = 30;
	const GRID_HEIGHT = CELL_SIZE * Y;
	const GRID_WIDTH = CELL_SIZE * X;

	// Whether the current selection matches any targets.
	let matchingTarget = false;

	let showTutorial = true;

	let currentLevelIndex = 0;

	$: currentLevel = isLevelEditorEnabled ? LEVEL_EDITOR_META : LEVELS[currentLevelIndex];

	$: {
		setupGameFor(currentLevel);
		forceRefresh();
	}

	let undoStack: UndoStep[] = [];

	function forceRefresh() {
		grid = grid;
		targets = targets;
	}

	function setupGameFor(level: LevelSpec) {
		setupGame(level, grid, targets);
		levelComplete = false;
	}

	// Game state
	let grid: CellData[][] = [];
	let targets: TargetData[] = [];

	let start: { x: number; y: number };
	let end: { x: number; y: number };

	let isDown: boolean = false;

	let levelComplete: boolean = false;

	let currentSelection: XYSelection = new XYSelection();

	function reset() {
		currentLevel = currentLevel;
		levelEditor = { name: '', targets: [], rects: [] };
		undoStack = [];
	}

	function undo() {
		const lastStep = undoStack.pop();
		if (!lastStep) {
			return;
		}

		if (lastStep.matchedTarget) {
			lastStep.matchedTarget.completed = false;
		}

		lastStep.selection.iterate((x, y) => (grid[x][y].removed = false));

		targets = targets;
	}

	function isValidSelection(selection: XYSelection) {
		if (selection.size == 0) return false;

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
		showTutorial = false;
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

		if (isValidSelection(currentSelection)) {
			// Resolve targets - find the matching one and mark as completed.
			// Mark all others as unmatched.
			let matchedTarget: TargetData | undefined;
			for (let target of targets) {
				if (target.match) {
					target.completed = true;
					matchedTarget = target;
				}
				target.match = false;
			}

			if (matchedTarget || isLevelEditorEnabled) {
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

			// Push onto undo stack.
			undoStack.push({
				selection: currentSelection.copy(),
				matchedTarget
			});
		}

		currentSelection.reset();
		updateGridSelection();

		evalEndLevel();
	}

	function evalEndLevel() {
		let incomplete = 0;
		for (let target of targets) {
			if (!target.completed) {
				incomplete++;
			}
		}

		if (incomplete == 0) {
			// Level is completed.
			setTimeout(() => (levelComplete = true), 600);
		}
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

<div class="mt-4 text-center text-sky-400">
	Level {currentLevel.number}: {currentLevel.name}
</div>

<Targets {targets} {matchingTarget} />

<div class="wrapper">
	{#each grid as row, x}
		{#each row as cellData, y}
			<Cell
				{x}
				{y}
				{cellData}
				{matchingTarget}
				size={isDown && start && x == start.x && y == start.y
					? isValidSelection(currentSelection)
						? currentSelection.size
						: 0
					: undefined}
			/>
		{/each}
	{/each}
	{#if showTutorial}
		<Tutorial />
	{/if}
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

<LevelComplete
	on:nextLevel={() => currentLevelIndex++}
	show={levelComplete}
	showNext={currentLevelIndex < LEVELS.length - 1}
/>

<div class="flex justify-center gap-2 flex-wrap p-1">
	<button class="button" on:click={undo}>Undo</button>
	<button class="button" on:click={reset}>Reset</button>
</div>
<div class="flex justify-center gap-2 flex-wrap p-1">
	<button disabled={currentLevelIndex == 0} class="button" on:click={() => currentLevelIndex--}
		>Previous level</button
	>
	<button
		disabled={currentLevelIndex == LEVELS.length - 1}
		class="button"
		on:click={() => currentLevelIndex++}>Next level</button
	>
</div>

{#if isLevelEditorEnabled}
	<pre class="text-white">
	{JSON.stringify(levelEditor)}
	</pre>
{/if}

<style lang="less">
	@import '../shared.less';

	.wrapper {
		margin: 20px auto;
		display: grid;
		flex-direction: column;
		grid-auto-flow: column;
		width: 360px; /** Cell size * X */
		grid-template-columns: repeat(12, 1fr);
		grid-template-rows: repeat(14, 1fr);
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
		background: @bg-color;
	}

	:global(.button) {
		@color: rgb(203, 212, 216);
		border-radius: 4px;
		background: @color;
		border: 1px solid darken(@color, 30%);
		border-bottom-width: 4px;
		margin-right: 1px;
		padding: 0.1em 0.3em;

		&:active {
			background-color: khaki;
			border-color: darken(khaki, 30%);
			border-bottom-width: 2px;
			margin-bottom: 2px;
			position: relative;
			top: 2px;
		}
	}
</style>
