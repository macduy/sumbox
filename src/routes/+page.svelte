<script lang="ts">
	import { XYSelection } from '$lib/types/selection';
	import Cell from '../Cell.svelte';

	let start: { x: number; y: number };
	let end: { x: number; y: number };

	let update = 0;

	let isDown: boolean = false;

	let currentSelection: XYSelection = new XYSelection();

	function onCellDown(x: number, y: number) {
		isDown = true;
		start = { x, y };
		end = { x, y };
		currentSelection.update(start, start);
		update++;
	}

	function onCellMove(x: number, y: number) {
		if (!isDown) {
			return;
		}

		end = { x, y };
		currentSelection.update(start, end);
		update++;
	}

	function onCellUp(x: number, y: number) {
		isDown = false;
		currentSelection.reset();
		update++;
	}

	function isActive(x: number, y: number) {
		return currentSelection.contains(x, y);
	}
</script>

{#key update}
	<div class="wrapper">
		{#each Array(10) as _, y (y)}
			{#each Array(10) as _, x (x)}
				<Cell
					{x}
					{y}
					isActive={isActive(x, y)}
					on:down={() => onCellDown(x, y)}
					on:move={() => onCellMove(x, y)}
					on:up={() => onCellUp(x, y)}
				/>
			{/each}
		{/each}
	</div>
{/key}

<style>
	.wrapper {
		margin: 20px auto;
		display: grid;
		border: 1px solid red;
		width: 200px;
		grid-template-columns: repeat(10, 1fr);
	}
</style>
