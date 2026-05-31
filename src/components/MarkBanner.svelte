<script lang="ts">
	import { fly } from "svelte/transition";

	interface Props {
		text: string | null;
		isLast: boolean;
	}
	let { text, isLast }: Props = $props();
</script>

{#if text}
	<div
		class="banner"
		class:last={isLast}
		role="status"
		transition:fly={{ y: -48, duration: 250 }}
	>
		<span class="time">{text}</span>
		<span class="passed">経過</span>
	</div>
{/if}

<style>
	.banner {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.85rem 1rem;
		background: var(--cds-interactive, #4589ff);
		color: #fff;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
	}
	.banner.last {
		background: var(--cds-support-success, #42be65);
		color: #0b0b0b;
	}
	.time {
		font-size: 1.5rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
	.passed {
		font-size: 0.95rem;
		opacity: 0.9;
	}
</style>
