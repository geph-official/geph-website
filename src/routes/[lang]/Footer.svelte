<script>
	import Email from 'svelte-material-icons/Email.svelte';
</script>

<footer>
	<div class="container">
		<div class="copyright">© Gephyra OÜ</div>
		<div class="address">Sakala 7-2,<br /> Tallinn<br /> Estonia 10141</div>
		<div class="email"><Email /> <a href="mailto:contact@geph.io">contact@geph.io</a></div>
	</div>
</footer>

<style>
	footer {
		padding-left: 2rem;
		background-color: rgba(var(--bs-light-rgb), 1);
		padding-top: 2rem;
		padding-bottom: 3rem;
		margin-top: 7rem;
	}
	div {
		padding: 0.3rem;
		font-size: 95%;
		font-weight: 500;
	}

	.address {
		opacity: 0.8;
	}

	.email a {
		color: var(--bs-body-color);
		opacity: 0.8;
	}
</style>
