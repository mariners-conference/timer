<script lang="ts">
	import { TextInput, Button } from "carbon-components-svelte";
	import Add from "carbon-icons-svelte/lib/Add.svelte";
	import { parseMmSs } from "../lib/format";
	import { addCustomMark } from "../lib/marks";

	let value = $state("");
	let error = $state("");

	function submit(e: Event): void {
		e.preventDefault();
		const seconds = parseMmSs(value);
		if (seconds === null) {
			error = "mm:ss で入力してください（コロン省略可、例: 0730 / 730 / 30）。";
			return;
		}
		if (!addCustomMark(seconds)) {
			error = "同じ時刻のマークが既にあります。";
			return;
		}
		error = "";
		value = "";
	}
</script>

<form class="form" onsubmit={submit} autocomplete="off">
	<div class="row">
		<div class="field">
			<TextInput
				size="sm"
				labelText="カスタム (mm:ss)"
				placeholder="例: 15:00"
				bind:value
				invalid={error !== ""}
				invalidText={error}
			/>
		</div>
		<Button type="submit" kind="secondary" size="field" icon={Add} iconDescription="追加" />
	</div>
</form>

<style>
	.form {
		border-top: 1px solid var(--cds-border-subtle, #393939);
		padding-top: 1.25rem;
		margin-top: 1.25rem;
	}
	.row {
		display: flex;
		gap: 0.6rem;
		align-items: flex-end;
	}
	.field {
		flex: 1;
	}
</style>
