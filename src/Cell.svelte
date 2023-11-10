<script lang="ts">
	import type { CellData } from '$lib/types/cell';
	import Page from './routes/+page.svelte';

	export let x: number;
	export let y: number;
	export let cellData: CellData;
	export let matchingTarget: boolean;
	export let size: number = 0;

	$: stateClass = evaluateClass(cellData, matchingTarget);

	function evaluateClass(cellData: CellData, matchingTarget: boolean) {
		if (!cellData.on || cellData.removed) {
			return 'off';
		}
		if (!cellData.selected) {
			return 'normal';
		}
		if (matchingTarget) {
			return 'active-match';
		}
		return 'active-no-match';
	}
</script>

<div class="box inline-block align-middle {stateClass}" class:showSize={size > 0} role="none">
	{#if size > 0}
		{size}
	{/if}
</div>

<style>
	.box {
		pointer-events: none;
		border-radius: 12px;
		user-select: none;
		background-color: white;
		width: 30px;
		height: 30px;
		color: white;
		text-align: center;

		transition: background-color 0.3s, border-width 0.15s, border-radius 0.35s, border-color 0.1s,
			transform 0.3s;
	}

	.off {
		border-radius: 0px;
		transform: scale(0);
	}

	.normal {
		background-color: grey;
		border: 4px solid white;
	}

	.active-no-match {
		background-color: red;
		border: 3px solid white;
	}

	.active-match {
		background-color: green;
		border: 2px solid white;
	}

	.showSize {
		border-width: 1px !important;
	}
</style>
