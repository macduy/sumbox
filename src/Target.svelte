<script lang="ts">
	import type { TargetData } from '$lib/types/target';

	export let target: TargetData;
</script>

<div class="target" class:match={target.match} class:completed={target.completed}>
	{target.value}
</div>

<style>
	.target {
		display: flex;
		width: 40px;
		height: 40px;
		font-weight: bold;
		color: white;
		font-size: 1.2em;
		background: grey;
		text-align: center;
		align-items: center;
		justify-content: center;
	}

	.match {
		background-color: green;
		transform: scale(1.1);
	}

	.completed {
		background-color: darkgreen;
	}
</style>
