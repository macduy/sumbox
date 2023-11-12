<script lang="ts">
	import type { TargetData } from '$lib/types/target';

	export let matchingTarget: boolean;
	export let targets: TargetData[];
</script>

<div class="targetRow m-auto flex justify-center gap-4 flex-wrap" class:matching={matchingTarget}>
	{#each targets as target, i (target)}
		<div class="target" class:match={target.match} class:completed={target.completed}>
			{target.value}
		</div>
	{/each}
</div>

<style lang="less">
	@import './shared.less';

	.targetRow {
		padding-left: 10px;
		padding-right: 10px;
		transition: padding 0.2s;
		&.matching {
			padding-left: 0px;
			padding-right: 0px;
		}
	}

	.target {
		.depth-text(@target-color, @target-color-darker, 2px);
		display: block;
		font-size: 30px;
		width: 50px;
		line-height: 50px;
		height: 50px;
		text-align: center;
		align-items: center;
		justify-content: center;

		transition: all 0.2s;
	}

	.match {
		.depth-text(#aef4b2, #4b945a, 2px, 6px) !important;
		font-size: 40px;
		padding-top: 0px;
		width: 70px;
	}

	.completed {
		.depth-text(@match-color, 2px) !important;
	}
</style>
