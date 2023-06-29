<script lang="ts">
	import type { Recipe } from '$lib/types/recipe';
	import { fade, fly, slide } from 'svelte/transition';
	import Section from './section.svelte';

	export let title: string;
	export let ingredients: string[];
	export let steps: string[];
	export let tips: string[];
</script>

<div class="flex flex-col text-left gap-5" in:fade>
	<h1 class="text-center text-3xl font-bold" in:fly|global={{ x: -100 }}>{title}</h1>
	<h2 class="text-center" in:fly|global={{ x: -100 }}>Ingredienti: {ingredients.join(', ')}</h2>
		<h3 class="text-xl" in:fade|global={{ delay: 100 * steps.length }}>Istruzioni:</h3>
		<Section class="bg-base-300 overflow-hidden">
			<ol class="list-decimal list-inside text-xl space-y-5">
				{#each steps as step, idx}
					<li in:fly|global={{ x: -150, delay: 100 * (idx + 1) }}>
						{step}
					</li>
				{/each}
			</ol>
		</Section>
	{#if tips.length > 0}
		<h3 class="text-xl" in:fade|global={{ delay: 100 * steps.length }}>Tips & Tricks:</h3>
		<Section class="bg-base-300 text-xl overflow-hidden">
			<ol class="list-decimal list-inside space-y-5">
				{#each tips as tip, idx}
					<li in:fly|global={{ x: -150, delay: 200 * (idx + 1) }}>
						{tip}
					</li>
				{/each}
			</ol>
		</Section>
	{/if}
</div>
