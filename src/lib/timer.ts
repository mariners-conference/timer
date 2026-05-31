import { writable } from "svelte/store";

const KEY = "timer.v1";

interface Persisted {
	baselineMs: number;
	startedAt: number | null;
	running: boolean;
}

export interface TimerState {
	elapsedMs: number;
	running: boolean;
}

function load(): Persisted {
	const empty: Persisted = { baselineMs: 0, startedAt: null, running: false };
	if (typeof localStorage === "undefined") return empty;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return empty;
		const p = JSON.parse(raw) as Persisted;
		return {
			baselineMs: Number(p.baselineMs) || 0,
			startedAt: typeof p.startedAt === "number" ? p.startedAt : null,
			running: !!p.running,
		};
	} catch {
		return empty;
	}
}

function save(p: Persisted): void {
	try {
		localStorage.setItem(KEY, JSON.stringify(p));
	} catch {
		/* noop */
	}
}

function clear(): void {
	try {
		localStorage.removeItem(KEY);
	} catch {
		/* noop */
	}
}

function compute(p: Persisted): TimerState {
	const running = p.running && p.startedAt != null;
	return {
		elapsedMs: p.baselineMs + (running ? Date.now() - (p.startedAt as number) : 0),
		running: p.running,
	};
}

function createTimer() {
	let p = load();
	const { subscribe, set } = writable<TimerState>(compute(p));
	let rafId = 0;

	function tick(): void {
		set(compute(p));
		if (p.running) rafId = requestAnimationFrame(tick);
	}

	if (p.running) rafId = requestAnimationFrame(tick);

	return {
		subscribe,
		start(): void {
			if (p.running) return;
			p = { ...p, running: true, startedAt: Date.now() };
			save(p);
			set(compute(p));
			rafId = requestAnimationFrame(tick);
		},
		pause(): void {
			if (!p.running) return;
			const now = Date.now();
			const add = p.startedAt != null ? now - p.startedAt : 0;
			p = { baselineMs: p.baselineMs + add, startedAt: null, running: false };
			save(p);
			cancelAnimationFrame(rafId);
			set(compute(p));
		},
		reset(): void {
			p = { baselineMs: 0, startedAt: null, running: false };
			clear();
			cancelAnimationFrame(rafId);
			set(compute(p));
		},
	};
}

export const timer = createTimer();
