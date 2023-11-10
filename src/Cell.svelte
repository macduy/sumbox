<script lang="ts">
	export let x: number;
	export let y: number;
	export let active: boolean;
	export let off: boolean;
</script>

<div class="box" role="none" class:active class:off />

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
