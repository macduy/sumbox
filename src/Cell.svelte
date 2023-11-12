<script lang="ts">
	import type { CellData } from '$lib/types/cell';
	import Page from './routes/+page.svelte';

	export let x: number;
	export let y: number;
	export let cellData: CellData;
	export let matchingTarget: boolean;
	export let size: number | undefined = undefined;

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
	<div
		class="box inline-block align-middle {stateClass}"
		class:showSize={size !== undefined}
		role="none"
	>
		{#if size}
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
		position: relative;
		top: 0px;
		display: flex;
		justify-content: center;
		align-items: center;
		align-self: center;
		border-radius: 6px;
		user-select: none;
		background-color: white;
		color: white;
		text-align: center;
		padding-top: 2px;
		transition: background-color 0.3s, border-radius 0.1s, border-color 0.2s, transform 0.3s,
			width 0.2s, height 0.2s, top 0.2s, left 0.2s;
	}

	.off {
		background-color: darken(@bg-color, 5%);
		border-color: darken(@bg-color, 10%);
		width: 0px;
		height: 0px;
	}

	.normal {
		background-color: @cell-normal;
		border-color: darken(@cell-normal, 20%);
		width: 20px;
		height: 20px;
	}

	.active-no-match {
		top: -1px;
		border-radius: 4px;
		background-color: rgb(223, 26, 26);
		border-color: darken(rgb(223, 26, 26), 20%);
		width: 22px;
		height: 22px;
		border-bottom-width: 2px;
		border-style: solid;
	}

	.active-match {
		top: -1px;
		border-radius: 4px;
		background-color: #39b051;
		border-color: darken(#39b051, 20%);
		width: 22px;
		height: 22px;
		border-bottom-width: 2px;
		border-style: solid;
	}

	.showSize {
		top: -3px;
		border-radius: 8px;
		width: 28px;
		height: 29px;
		border-bottom-width: 3px;
		border-style: solid;
	}
</style>
