import { writable } from "svelte/store";
import { fmtClock } from "./format";

const KEY = "marks.v1";

export interface Mark {
	id: string;
	label: string;
	seconds: number;
	enabled: boolean;
	custom: boolean;
	muted: boolean;
}

let seq = 0;

export function makeMark(
	label: string,
	seconds: number,
	enabled: boolean,
	custom: boolean,
): Mark {
	return { id: `m${seq++}`, label, seconds, enabled, custom, muted: false };
}

function defaults(): Mark[] {
	seq = 0;
	return [
		makeMark("1分", 60, false, false),
		makeMark("2分", 120, false, false),
		makeMark("3分", 180, true, false),
		makeMark("4分", 240, false, false),
		makeMark("5分", 300, true, false),
		makeMark("10分", 600, false, false),
	];
}

function load(): Mark[] {
	if (typeof localStorage === "undefined") return defaults();
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return defaults();
		const arr = JSON.parse(raw) as Mark[];
		if (!Array.isArray(arr) || arr.length === 0) return defaults();
		const list = arr.map((m) => ({
			id: String(m.id),
			label: String(m.label),
			seconds: Number(m.seconds),
			enabled: !!m.enabled,
			custom: !!m.custom,
			muted: !!m.muted,
		}));
		// 既存 ID と衝突しないよう seq を最大値+1 に
		seq = list.reduce((max, m) => {
			const n = parseInt(m.id.replace(/^m/, ""), 10);
			return Number.isFinite(n) && n >= max ? n + 1 : max;
		}, 0);
		return list;
	} catch {
		return defaults();
	}
}

function persist(list: Mark[]): void {
	try {
		localStorage.setItem(KEY, JSON.stringify(list));
	} catch {
		/* noop */
	}
}

export const marks = writable<Mark[]>(load());
if (typeof localStorage !== "undefined") marks.subscribe(persist);

/** 設定を初期状態に戻し、保存も初期化する。 */
export function clearSettings(): void {
	marks.set(defaults());
}

/** ON マークの最大秒数（進捗バー終端）。無ければ60。 */
export function maxOnSeconds(list: Mark[]): number {
	const enabled = list.filter((m) => m.enabled);
	return enabled.length === 0 ? 60 : Math.max(...enabled.map((m) => m.seconds));
}

/** ON マークのうち最後（最大秒数）の ID。 */
export function lastOnId(list: Mark[]): string | null {
	const enabled = list.filter((m) => m.enabled);
	if (enabled.length === 0) return null;
	return enabled.reduce((a, b) => (b.seconds > a.seconds ? b : a)).id;
}

export function toggleMark(id: string, enabled: boolean): void {
	marks.update((list) => list.map((m) => (m.id === id ? { ...m, enabled } : m)));
}

export function setMuted(id: string, muted: boolean): void {
	marks.update((list) => list.map((m) => (m.id === id ? { ...m, muted } : m)));
}

export function setAllMuted(muted: boolean): void {
	marks.update((list) => list.map((m) => ({ ...m, muted })));
}

export function allMuted(list: Mark[]): boolean {
	return list.length > 0 && list.every((m) => m.muted);
}

export function removeMark(id: string): void {
	marks.update((list) => list.filter((m) => m.id !== id));
}

/** 同じ秒数が既にあれば false。 */
export function addCustomMark(seconds: number): boolean {
	let added = false;
	marks.update((list) => {
		if (list.some((m) => m.seconds === seconds)) return list;
		added = true;
		return [...list, makeMark(fmtClock(seconds), seconds, true, true)];
	});
	return added;
}
