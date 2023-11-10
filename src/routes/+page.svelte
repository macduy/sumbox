<script lang="ts">
	import { XYSelection } from '$lib/types/selection';
	import Cell from '../Cell.svelte';

	const X = 10;
	const Y = 10;

	type CellData = {
		type: 'off' | 'on' | 'removed';
		selected: boolean;
	};

	let grid: CellData[][] = [];

	for (let i = 0; i < X; i++) {
		grid[i] = [];
		for (let j = 0; j < Y; j++) {
			grid[i][j] = {
				type: 'on',
				selected: false
			};
		}
	}

	let start: { x: number; y: number };
	let end: { x: number; y: number };

	let isDown: boolean = false;

	let currentSelection: XYSelection = new XYSelection();

	function updateGridSelection() {
		console.log('update');
		for (let i = 0; i < X; i++) {
			for (let j = 0; j < Y; j++) {
				grid[i][j].selected = currentSelection.contains(i, j);
			}
		}
		grid = grid;
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
		currentSelection.update(start, end);

		updateGridSelection();
	}

	function onCellUp(x: number, y: number) {
		isDown = false;

		currentSelection.iterate((x, y) => (grid[x][y].type = 'off'));

		currentSelection.reset();
		updateGridSelection();
	}
</script>

<!-- {#key update} -->
<div class="wrapper">
	{#each grid as row, x}
		{#each row as cellData, y}
			<Cell
				{x}
				{y}
				active={cellData.selected}
				off={cellData.type === 'off'}
				on:down={() => onCellDown(x, y)}
				on:move={() => onCellMove(x, y)}
				on:up={() => onCellUp(x, y)}
			/>
		{/each}
	{/each}
</div>

<!-- {/key} -->

<style>
	.wrapper {
		margin: 20px auto;
		display: grid;
		border: 1px solid red;
		width: 200px;
		grid-template-columns: repeat(10, 1fr);
	}
</style>
