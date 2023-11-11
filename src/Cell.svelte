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

<div class="cell flex justify-center">
	<div class="box inline-block align-middle {stateClass}" class:showSize={size > 0} role="none">
		{#if size > 0}
			{size}
		{/if}
	</div>
</div>

<style lang="less">
	@import './shared.less';

	@cellSize: 30px;

	.cell {
		pointer-events: none;
		width: @cellSize;
		height: @cellSize;
	}

	.box {
		display: flex;
		justify-content: center;
		align-items: center;
		align-self: center;
		border-radius: 6px;
		user-select: none;
		background-color: white;
		color: white;
		text-align: center;
		transition: background-color 0.3s, border-width 0.15s, border-radius 0.35s, border-color 0.1s,
			transform 0.3s, width 0.3s, height 0.3s;
	}

	.off {
		width: 0px;
		height: 0px;
	}

	.normal {
		background-color: grey;
		width: 20px;
		height: 20px;
	}

	.active-no-match {
		border-radius: 1px;
		background-color: red;
		width: 22px;
		height: 22px;
	}

	.active-match {
		border-radius: 3px;
		background-color: green;
		width: 22px;
		height: 22px;
	}

	.showSize {
		width: 26px;
		height: 26px;
	}
</style>
