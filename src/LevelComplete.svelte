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
		background-color: rgba(0, 0, 0, 80%);
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
		background-color: hsla(222.1, 29%, 11.6%, 30%);
		border: 1px solid hsl(222.1, 29%, 30%);
		margin: auto;
		padding: 20px 30px;
		text-align: center;
	}

	.complete {
		.depth-text(gold; @glow: 1em) !important;
		font-size: 150%;
	}
</style>
