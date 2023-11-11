<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let showNext: boolean = true;
	export let show: boolean = false;
	const dispatch = createEventDispatcher();

	const nextLevel = () => {
		dispatch('nextLevel');
	};
</script>

<div class="outer" class:show>
	<div class="contents">
		<p class="mb-8 complete">Level complete</p>
		{#if showNext}
			<button class="button" on:click={nextLevel}>Next level</button>
		{/if}
	</div>
</div>

<style lang="less">
	@import './shared.less';

	.outer {
		background-color: rgba(100, 100, 100, 20%);
		transition: all;
		position: absolute;
		top: 0px;
		height: 100%;
		width: 100%;
		display: block;
		opacity: 0;
		transition: all 0.5s;
		pointer-events: none;
		padding-top: 350px;
		text-align: center;
	}

	.show {
		opacity: 100%;
		padding-top: 300px;
		pointer-events: initial;
	}

	.contents {
		display: inline-block;
		position: relative;
		border-radius: 20px;
		background-color: white;
		margin: auto;
		padding: 10px;
		text-align: center;
		box-shadow: 0 0 50px 50px white;
	}

	.complete {
		.depth-text(gold; @glow: 1em) !important;
		font-size: 150%;
	}
</style>
