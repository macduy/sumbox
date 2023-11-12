<script>
	import hand from '$lib/images/hand.png';
</script>

<div class="outer">
	<div class="tutorial">
		<img alt="hand" src={hand} />
	</div>
	<div class="text font-exo2 text-white">
		<b class="text-center block uppercase">How to Play</b> <br />Draw boxes of size matching targets
		above.
	</div>
</div>

<style lang="less">
	@import './shared.less';

	.text {
		font-family: 'Exo 2', sans-serif;
		color: saturate(lighten(@bg-color, 80%), 40%);
		width: 250px;
		margin: auto;
		position: relative;
		top: 200px;
		border: 1px solid lighten(@bg-color, 30%);
		padding: 20px;
		border-radius: 16px;
	}
	.outer {
		position: absolute;
		width: 100%;
	}
	.tutorial {
		width: 60px;
		height: 60px;
		position: absolute;
		animation: mymove ease-in-out 3s;
		animation-iteration-count: 1000;
	}

	@keyframes mymove {
		0% {
			top: 40px;
			left: 110px;
		}
		20% {
			top: 40px;
			left: 110px;
		}
		80% {
			top: 130px;
			left: 200px;
		}
		100% {
			top: 130px;
			left: 200px;
		}
	}
</style>
