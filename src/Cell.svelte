<script lang="ts">
	import type { CellData } from '$lib/types/cell';

	export let x: number;
	export let y: number;
	export let cellData: CellData;
</script>

<div
	class="box"
	role="none"
	class:active={cellData.on && cellData.selected}
	class:off={!cellData.on || cellData.removed}
/>

<style>
	.box {
		user-select: none;
		background-color: blue;
		border: 1px solid green;
		width: 20px;
		height: 20px;
	}

	.active {
		background-color: yellow;
	}

	.off {
		background-color: white;
	}
</style>
