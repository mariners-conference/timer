<script lang="ts">
	import { splitTime } from "../lib/format";

	interface Props {
		elapsedMs: number;
		big?: boolean;
	}
	let { elapsedMs, big = false }: Props = $props();

	const parts = $derived(splitTime(elapsedMs));
</script>

<div class="display" class:big role="timer" aria-label="経過時間">
	<span class="major">{parts.min}</span><span class="colon">:</span
	><span class="major">{parts.sec}</span><span class="dot">.</span
	><span class="ms">{parts.ms}</span>
</div>

<style>
	.display {
		text-align: center;
		font-variant-numeric: tabular-nums;
		font-feature-settings: "tnum";
		line-height: 1;
		margin-bottom: 2rem;
	}
	.major {
		font-size: clamp(3.5rem, 16vw, 6rem);
		font-weight: 600;
		letter-spacing: 0.01em;
	}
	.colon,
	.dot {
		font-size: clamp(2.5rem, 11vw, 4rem);
		font-weight: 300;
		color: var(--cds-text-secondary, #8d8d8d);
		margin: 0 0.05em;
	}
	.ms {
		font-size: clamp(1.6rem, 7vw, 2.4rem);
		font-weight: 500;
		color: var(--cds-interactive, #4589ff);
	}

	.display.big .major {
		font-size: clamp(4.5rem, 24vw, 10rem);
	}
	.display.big .colon,
	.display.big .dot {
		font-size: clamp(3rem, 16vw, 6.5rem);
	}
	.display.big .ms {
		font-size: clamp(2rem, 10vw, 4rem);
	}
</style>
