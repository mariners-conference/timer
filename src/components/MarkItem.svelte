<script lang="ts">
	import { Toggle, Button } from "carbon-components-svelte";
	import VolumeUp from "carbon-icons-svelte/lib/VolumeUp.svelte";
	import VolumeMute from "carbon-icons-svelte/lib/VolumeMute.svelte";
	import Play from "carbon-icons-svelte/lib/Play.svelte";
	import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";
	import { fmtClock } from "../lib/format";
	import type { Mark } from "../lib/marks";

	interface Props {
		mark: Mark;
		onToggle: (enabled: boolean) => void;
		onMute: (muted: boolean) => void;
		onPreview: () => void;
		onRemove: () => void;
	}
	let { mark, onToggle, onMute, onPreview, onRemove }: Props = $props();
</script>

<li class="item" class:enabled={mark.enabled}>
	<div class="toggle">
		<Toggle
			size="sm"
			toggled={mark.enabled}
			labelText={`${mark.label} の通知`}
			hideLabel
			labelA=""
			labelB=""
			on:toggle={(e) => onToggle(e.detail.toggled)}
		/>
	</div>

	<span class="name">{mark.label}</span>
	<span class="time">{fmtClock(mark.seconds)}</span>

	<div class="actions">
		<Button
			kind="ghost"
			size="small"
			icon={mark.muted ? VolumeMute : VolumeUp}
			iconDescription={mark.muted ? "ミュート解除" : "ミュート"}
			on:click={() => onMute(!mark.muted)}
		/>
		<Button kind="ghost" size="small" icon={Play} iconDescription="試聴" on:click={onPreview} />
		{#if mark.custom}
			<Button
				kind="danger-ghost"
				size="small"
				icon={TrashCan}
				iconDescription="削除"
				on:click={onRemove}
			/>
		{/if}
	</div>
</li>

<style>
	.item {
		display: grid;
		grid-template-columns: 3rem 1fr auto auto;
		align-items: center;
		gap: 0.75rem;
		background: var(--cds-layer, #262626);
		border: 1px solid var(--cds-border-subtle, #393939);
		border-radius: 8px;
		padding: 0.4rem 0.75rem;
		opacity: 0.6;
		transition: opacity 0.15s;
	}
	.item.enabled {
		opacity: 1;
		border-color: var(--cds-interactive, #4589ff);
	}
	.toggle {
		display: flex;
		align-items: center;
	}
	.name {
		font-weight: 600;
	}
	.time {
		color: var(--cds-text-secondary, #8d8d8d);
		font-variant-numeric: tabular-nums;
		font-size: 0.85rem;
	}
	.actions {
		display: flex;
		gap: 0.25rem;
		justify-content: flex-end;
		align-items: center;
	}

	@media (max-width: 560px) {
		.item {
			grid-template-columns: 3rem 1fr auto;
			grid-template-areas:
				"toggle name time"
				"actions actions actions";
			row-gap: 0.5rem;
		}
		.toggle {
			grid-area: toggle;
		}
		.name {
			grid-area: name;
		}
		.time {
			grid-area: time;
			text-align: right;
		}
		.actions {
			grid-area: actions;
			justify-content: flex-start;
			flex-wrap: wrap;
		}
	}
</style>
