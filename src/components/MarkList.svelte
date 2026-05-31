<script lang="ts">
	import { Toggle, Button } from "carbon-components-svelte";
	import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";
	import MarkItem from "./MarkItem.svelte";
	import CustomMarkForm from "./CustomMarkForm.svelte";
	import {
		marks,
		toggleMark,
		removeMark,
		setMuted,
		setAllMuted,
		allMuted,
		lastOnId,
		clearSettings,
	} from "../lib/marks";
	import { ensureAudio, playMarkSound } from "../lib/sounds";

	const sorted = $derived([...$marks].sort((a, b) => a.seconds - b.seconds));
	const lastId = $derived(lastOnId($marks));
	const isAllMuted = $derived(allMuted($marks));

	async function preview(isLast: boolean): Promise<void> {
		await ensureAudio();
		playMarkSound(isLast);
	}

	function clear(): void {
		if (confirm("設定を初期状態に戻しますか？")) clearSettings();
	}
</script>

<section class="card">
	<div class="head">
		<Button kind="danger-tertiary" size="small" icon={TrashCan} on:click={clear}>
			設定をクリア
		</Button>
		<div class="bulk">
			<Toggle
				size="sm"
				toggled={isAllMuted}
				labelText="一括ミュート"
				labelA="解除"
				labelB="ミュート"
				on:toggle={(e) => setAllMuted(e.detail.toggled)}
			/>
		</div>
	</div>

	<ul class="list">
		{#each sorted as mark (mark.id)}
			{@const isLast = mark.id === lastId}
			<MarkItem
				{mark}
				onToggle={(enabled) => toggleMark(mark.id, enabled)}
				onMute={(muted) => setMuted(mark.id, muted)}
				onPreview={() => preview(mark.enabled && isLast)}
				onRemove={() => removeMark(mark.id)}
			/>
		{/each}
	</ul>

	<CustomMarkForm />
</section>

<style>
	.card {
		background: var(--cds-layer, #262626);
		border: 1px solid var(--cds-border-subtle, #393939);
		border-radius: 12px;
		padding: 1.5rem;
	}
	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	.bulk {
		flex: 0 0 auto;
	}
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
