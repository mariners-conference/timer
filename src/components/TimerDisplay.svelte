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
		/* Size the digits relative to the card width (cqw), not the viewport, so
		   card/page padding is accounted for and "00:00.000" never overflows on
		   narrow phones. */
		container-type: inline-size;
		text-align: center;
		font-variant-numeric: tabular-nums;
		font-feature-settings: "tnum";
		line-height: 1;
		margin-bottom: 2rem;
		white-space: nowrap;
	}
	.major {
		font-size: clamp(2.5rem, 22cqw, 6rem);
		font-weight: 600;
		letter-spacing: 0.01em;
	}
	.colon,
	.dot {
		font-size: clamp(1.8rem, 15cqw, 4rem);
		font-weight: 300;
		color: var(--cds-text-secondary, #8d8d8d);
		margin: 0 0.04em;
	}
	.ms {
		font-size: clamp(1.1rem, 9cqw, 2.4rem);
		font-weight: 500;
		color: var(--cds-interactive, #4589ff);
	}

	.display.big .major {
		font-size: clamp(2.5rem, 24cqw, 9rem);
	}
	.display.big .colon,
	.display.big .dot {
		font-size: clamp(1.8rem, 16cqw, 6rem);
	}
	.display.big .ms {
		font-size: clamp(1.4rem, 9cqw, 3.6rem);
	}
</style>
