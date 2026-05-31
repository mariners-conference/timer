<script lang="ts">
	import { fmtClock } from "../lib/format";
	import type { Mark } from "../lib/marks";

	interface Props {
		elapsedMs: number;
		marks: Mark[];
		maxSec: number;
		flashId: string | null;
	}
	let { elapsedMs, marks, maxSec, flashId }: Props = $props();

	const elapsedSec = $derived(elapsedMs / 1000);
	const ratio = $derived(Math.min(elapsedSec / maxSec, 1));
	const isOver = $derived(elapsedSec > maxSec);

	function pos(seconds: number): number {
		return Math.min(seconds / maxSec, 1) * 100;
	}
</script>

<div class="wrap">
	<div class="track">
		<div class="fill" class:over={isOver} style:width="{ratio * 100}%"></div>
		<div class="head" class:over={isOver} style:left="{ratio * 100}%"></div>
		{#each marks as m (m.id)}
			<div
				class="marker"
				class:passed={elapsedSec >= m.seconds}
				class:flash={flashId === m.id}
				style:left="{pos(m.seconds)}%"
			>
				<span class="dot"></span>
				<span class="label">{m.label}</span>
			</div>
		{/each}
	</div>
	<div class="scale">
		<span>0:00</span>
		<span>{fmtClock(maxSec)}</span>
	</div>
</div>

<style>
	.wrap {
		margin-bottom: 2rem;
	}
	.track {
		position: relative;
		height: 14px;
		background: var(--cds-layer-accent, #393939);
		border-radius: 999px;
	}
	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		width: 0;
		background: linear-gradient(
			90deg,
			var(--cds-interactive, #4589ff),
			var(--cds-support-success, #42be65)
		);
		border-radius: 999px;
		transition: width 0.05s linear;
	}
	.fill.over {
		background: linear-gradient(90deg, #ff832b, #fa4d56);
	}
	.head {
		position: absolute;
		top: 50%;
		left: 0;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 0 0 4px rgba(69, 137, 255, 0.35);
		transform: translate(-50%, -50%);
		transition: left 0.05s linear;
	}
	.head.over {
		box-shadow: 0 0 0 4px rgba(255, 131, 43, 0.4);
	}
	.marker {
		position: absolute;
		top: 0;
		transform: translateX(-50%);
		pointer-events: none;
	}
	.dot {
		position: absolute;
		top: 7px;
		left: 50%;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--cds-text-secondary, #8d8d8d);
		border: 2px solid var(--cds-background, #161616);
		transform: translate(-50%, -50%);
		transition:
			background 0.2s,
			transform 0.2s;
	}
	.marker.passed .dot {
		background: var(--cds-support-success, #42be65);
		transform: translate(-50%, -50%) scale(1.25);
	}
	.marker.flash .dot {
		animation: pop 0.6s ease;
	}
	@keyframes pop {
		0% {
			box-shadow: 0 0 0 0 rgba(66, 190, 101, 0.6);
		}
		100% {
			box-shadow: 0 0 0 14px rgba(66, 190, 101, 0);
		}
	}
	.label {
		position: absolute;
		top: 18px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 0.7rem;
		color: var(--cds-text-secondary, #8d8d8d);
		white-space: nowrap;
	}
	.marker.passed .label {
		color: var(--cds-support-success, #42be65);
	}
	.scale {
		display: flex;
		justify-content: space-between;
		margin-top: 1.6rem;
		font-size: 0.75rem;
		color: var(--cds-text-secondary, #8d8d8d);
		font-variant-numeric: tabular-nums;
	}
</style>
