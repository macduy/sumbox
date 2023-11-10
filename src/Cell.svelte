<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let x: number;
	export let y: number;
	export let active: boolean;
	export let off: boolean;

	const dispatch = createEventDispatcher();

	function onDown() {
		dispatch('down', { x, y });
	}

	function onMove() {
		dispatch('move', { x, y });
	}

	function onUp() {
		dispatch('up', { x, y });
	}
</script>

<div
	class="box"
	role="none"
	class:active
	class:off
	on:mousedown={onDown}
	on:mousemove={onMove}
	on:mouseup={onUp}
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
