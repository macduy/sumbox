<script lang="ts">
	import type { TargetData } from '$lib/types/target';

	export let target: TargetData;
</script>

<div class="target" class:match={target.match} class:completed={target.completed}>
	{target.value}
</div>

<style lang="less">
	@import './shared.less';
	.target {
		.depth-text(#e6e6e6, #555555, 2px);
		display: flex;
		font-size: 30px;
		height: 50px;
		text-align: center;
		align-items: center;
		justify-content: center;

		transition: all 0.2s;
	}

	.match {
		.depth-text(#4ff571, 2px, 6px) !important;
		font-size: 40px;
	}

	.completed {
		.depth-text(#68ca1f, 2px) !important;
	}
</style>
