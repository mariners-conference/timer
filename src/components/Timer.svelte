<script lang="ts">
	import { Button } from "carbon-components-svelte";
	import PlayFilledAlt from "carbon-icons-svelte/lib/PlayFilledAlt.svelte";
	import PauseFilled from "carbon-icons-svelte/lib/PauseFilled.svelte";
	import Reset from "carbon-icons-svelte/lib/Reset.svelte";
	import ChevronUp from "carbon-icons-svelte/lib/ChevronUp.svelte";
	import ChevronDown from "carbon-icons-svelte/lib/ChevronDown.svelte";
	import TimerDisplay from "./TimerDisplay.svelte";
	import ProgressBar from "./ProgressBar.svelte";
	import MarkList from "./MarkList.svelte";
	import MarkBanner from "./MarkBanner.svelte";
	import { timer } from "../lib/timer";
	import { marks, maxOnSeconds, lastOnId, type Mark } from "../lib/marks";
	import { ensureAudio, playMarkSound } from "../lib/sounds";
	import { fmtJp } from "../lib/format";

	const enabledMarks = $derived($marks.filter((m) => m.enabled));
	const maxSec = $derived(maxOnSeconds($marks));
	const lastId = $derived(lastOnId($marks));

	let settingsOpen = $state(false);
	let seeded = false;
	let fired = new Set<string>();
	let flashId = $state<string | null>(null);
	let flashTimer: ReturnType<typeof setTimeout> | undefined;
	let bannerText = $state<string | null>(null);
	let bannerLast = $state(false);
	let bannerTimer: ReturnType<typeof setTimeout> | undefined;

	async function start(): Promise<void> {
		await ensureAudio();
		timer.start();
	}

	function fire(mark: Mark): void {
		fired.add(mark.id);
		const isLast = mark.id === lastId;
		if (!mark.muted) playMarkSound(isLast);

		flashId = mark.id;
		clearTimeout(flashTimer);
		flashTimer = setTimeout(() => (flashId = null), 600);

		bannerText = fmtJp(mark.seconds);
		bannerLast = isLast;
		clearTimeout(bannerTimer);
		bannerTimer = setTimeout(() => (bannerText = null), 3500);
	}

	$effect(() => {
		const elapsedSec = $timer.elapsedMs / 1000;
		// 復元直後は通過済みマークを音なしで発火済み扱いにする
		if (!seeded) {
			for (const m of $marks) if (elapsedSec >= m.seconds) fired.add(m.id);
			seeded = true;
			return;
		}
		if ($timer.elapsedMs === 0) {
			fired.clear();
			return;
		}
		for (const m of $marks) {
			if (m.enabled && !fired.has(m.id) && elapsedSec >= m.seconds) fire(m);
		}
	});

	$effect(() => {
		function onKey(e: KeyboardEvent): void {
			const tag = (document.activeElement?.tagName ?? "").toLowerCase();
			if (e.code === "Space" && tag !== "input" && tag !== "button") {
				e.preventDefault();
				$timer.running ? timer.pause() : start();
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});
</script>

<MarkBanner text={bannerText} isLast={bannerLast} />

<div class="timer" class:collapsed={!settingsOpen}>
	<section class="display-card" class:big={!settingsOpen}>
		<TimerDisplay elapsedMs={$timer.elapsedMs} big={!settingsOpen} />
		<ProgressBar
			elapsedMs={$timer.elapsedMs}
			marks={enabledMarks}
			{maxSec}
			{flashId}
		/>
		<div class="controls">
			{#if $timer.running}
				<Button
					kind="danger"
					size="lg"
					icon={PauseFilled}
					iconDescription="一時停止"
					on:click={() => timer.pause()}
				/>
			{:else}
				<Button
					kind="primary"
					size="lg"
					icon={PlayFilledAlt}
					iconDescription={$timer.elapsedMs > 0 ? "再開" : "スタート"}
					on:click={start}
				/>
			{/if}
			<Button
				kind="tertiary"
				size="lg"
				icon={Reset}
				iconDescription="リセット"
				on:click={() => timer.reset()}
			/>
		</div>
	</section>

	<div class="settings-toggle">
		<Button
			kind="ghost"
			size="small"
			icon={settingsOpen ? ChevronUp : ChevronDown}
			on:click={() => (settingsOpen = !settingsOpen)}
		>
			{settingsOpen ? "設定を隠す" : "設定を表示"}
		</Button>
	</div>

	{#if settingsOpen}
		<MarkList />
	{/if}
</div>

<style>
	.timer {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		/* Let children shrink below their min-content so the nowrap timer digits
		   size against the card width instead of widening the layout. */
		min-width: 0;
	}
	.timer > :global(*) {
		min-width: 0;
	}
	.timer.collapsed {
		min-height: calc(100vh - 6.5rem);
		justify-content: center;
	}
	.display-card {
		background: var(--cds-layer, #262626);
		border: 1px solid var(--cds-border-subtle, #393939);
		border-radius: 12px;
		padding: 1.75rem 1.5rem;
		transition: padding 0.2s;
	}
	.display-card.big {
		padding: 3.5rem 1.5rem;
	}
	.controls {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
	}
	.settings-toggle {
		display: flex;
		justify-content: center;
	}
</style>
