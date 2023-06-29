
<script lang="ts">
    export let rating: number
    export let maxRating:number = 5;
</script>

<div class="w-fit gap-1 inline-flex">
    {#each {length: rating} as star}
         <span class="mask mask-star-2 bg-primary w-5 h-5"></span>
    {/each}
    {#each {length: maxRating - rating} as star }
         <span class="mask mask-star-2 bg-secondary-content w-5 h-5"></span>
    {/each}
   
</div>