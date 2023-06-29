<script>
	import '../app.postcss';
	import Nav from '$lib/components/nav.svelte';
</script>

<div class="flex flex-col h-full gap-5">
	<Nav />
	<slot />
</div>
