<script lang="ts">
	import type { Recipe } from '$lib/types/recipe';
	import Icon from '@iconify/svelte';
	let ingredients: string[] = [];
	let ingredientText: string = '';
	import recipeStub from '$lib/stubs/recipe.json';
	function addIngredient() {
		ingredients.push(ingredientText);
		ingredients = ingredients;
		ingredientText = '';
	}

	let recipe: Recipe | null = null;
	let completionStatus: 'idle' | 'loading' | 'completed' | 'error' = 'idle';
	let error: Error | null = null;

	async function sendRequest() {
		completionStatus = 'loading';
		try {
			const response = await fetch('/api/ai', {
				method: 'POST',
				body: JSON.stringify({ ingredients }),
				headers: {
					'content-type': 'application/json'
				}
			});
			recipe = await response.json();
			completionStatus = 'completed';
		} catch (e) {
			completionStatus = 'error';
			if (e instanceof Error) error = e;
		}
	}
</script>

<div class="flex-1 grid grid-cols-4 grid-rows-4 gap-5 p-5">
	<div class="bg-base-200 col-span-2 row-span-3">SX</div>
	<div class="bg-base-200 col-span-2 row-span-4 p-5">
		{#if completionStatus === 'completed' || recipeStub}
			{JSON.stringify(recipeStub, null, 2)}
		{:else if completionStatus === 'loading'}
			<span class="loading loading-spinner loading-lg" />
		{:else if completionStatus === 'error'}
			<div class="alert alert-error">
				<span>Error! {error?.message}</span>
			</div>
		{:else}
			<span>Genera una ricetta.</span>
		{/if}
	</div>
	<div
		class="bg-base-200 col-span-2 row-span-1 p-5 flex flex-wrap gap-3 overflow-y-auto max-hh-full"
	>
		{#each ingredients as ingredient}
			<button
				class="bg-accent-focus text-accent-content px-2 p-1 rounded-xl h-fit flex items-center gap-1"
				on:click={() => (ingredients = ingredients.filter((i) => i !== ingredient))}
				>{ingredient} <Icon icon="ph:x" /></button
			>
		{:else}
			<span> Inserisci gli ingredienti per generare una ricetta</span>
		{/each}
	</div>
	<div class="bg-base-200 col-span-4 w-full flex items-center p-5 justify-between">
		<div class="flex h-full gap-5">
			<input
				type="text"
				class="h-full rounded-md bg-base-100 text-content outline-none pl-5 w-[350px]"
				placeholder="Aggiungi gli ingredienti che desideri"
				bind:value={ingredientText}
			/>
			<button class="btn btn-secondary" on:click={addIngredient}
				>aggiungi <Icon icon="ph:plus" /></button
			>
		</div>
		<button class="btn btn-primary w-40" on:click={sendRequest}
			>genera <Icon icon="clarity:play-solid" /></button
		>
	</div>
</div>
