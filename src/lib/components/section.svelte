<script lang="ts">
	import { cn } from '$lib/utils/cn';
	let className = '';
	export { className as class };
</script>

<div class={cn('p-5 rounded-lg shadow-md', className)}>
	<slot />
</div>
