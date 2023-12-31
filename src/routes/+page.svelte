<script lang="ts">
	import Rating from '$lib/components/rating.svelte';
	import Recipe from '$lib/components/recipe.svelte';
	import Section from '$lib/components/section.svelte';
	import recipeStub from '$lib/stubs/recipe.json';
	import type { Recipe as RecipeType } from '$lib/types/recipe';
	import { sleep } from '$lib/utils/sleep';
	import Icon from '@iconify/svelte';

	function addIngredient() {
		ingredients.push(ingredientText);
		ingredients = ingredients;
		ingredientText = '';
	}

	let recipe: RecipeType = recipeStub;
	let completionStatus: 'idle' | 'loading' | 'completed' | 'error' = 'idle';
	let error: Error | null = null;
	let ingredients: string[] = [];
	let ingredientText: string = '';

	async function sendRequest() {
		completionStatus = 'loading';
		await sleep(1000);
		return (completionStatus = 'completed');
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

	let image: string = recipeStub.image;

	async function generateImage() {
		const response = await fetch('/api/generate/image', {
			method: 'POST',
			body: JSON.stringify({ prompt: recipe.title }),
			headers: {
				'content-type': 'application/json'
			}
		});
		image = (await response.json()).image;
	}
</script>

<Section class="flex-1 grid grid-cols-4 grid-rows-4 gap-5">
	<Section class="bg-base-200 col-span-1 row-span-3 flex flex-col gap-5">
		<Section class="bg-base-300 flex-1 relative">
			<picture>
				<img
					src={image}
					alt={recipe.title}
					loading="lazy"
					width="512"
					height="512"
					class="aspect-square rounded-md inset-0 absolute object-cover w-full h-full"
				/>
			</picture>
		</Section>
		<Section class="bg-base-300 flex items-center gap-4">
			<span class="text-lg">Difficolta ricetta:</span>
			<Rating rating={completionStatus === 'completed' ? recipe.difficulty : 0} maxRating={5} />
		</Section>
	</Section>
	<Section
		class="bg-base-200 col-span-3 row-span-4 p-5 overflow-x-hidden relative overflow-y-auto max-h-[75vh]"
	>
		{#if completionStatus === 'completed'}
			<Recipe {...recipe} />
		{:else if completionStatus === 'loading'}
			<div class="inset-0 absolute grid place-content-center">
				<span class="loading loading-spinner loading-lg" />
			</div>
		{:else if completionStatus === 'error'}
			<div class="alert alert-error">
				<span>Error! {error?.message}</span>
			</div>
		{:else}
			<span>Genera una ricetta.</span>
		{/if}
	</Section>

	<Section
		class="bg-base-200 col-span-1 row-span-1 p-5 flex flex-wrap gap-3 overflow-y-auto max-hh-full"
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
	</Section>

	<Section class="bg-base-200 col-span-4 w-full flex items-center p-5 justify-between">
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
		<button class="btn btn-primary" on:click={generateImage}
			><span>genera immagine </span><Icon icon="clarity:play-solid" /></button
		>
	</Section>
</Section>
