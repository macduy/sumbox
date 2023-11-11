<script>
	import hand from '$lib/images/hand.png';
</script>

<div class="tutorial">
	<img alt="hand" src={hand} />
</div>

<style>
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
