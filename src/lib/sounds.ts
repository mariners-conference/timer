// 通知音（Tone.js 合成）。最後=チャイム×3 / 途中=マリンバ×1。
import * as Tone from "tone";

let audioReady = false;

/** 初回ユーザー操作中に呼んで AudioContext を起動する。 */
export async function ensureAudio(): Promise<void> {
	if (audioReady) return;
	await Tone.start();
	audioReady = true;
}

function autoDispose(node: { dispose: () => void }, ms = 2500): void {
	setTimeout(() => {
		try {
			node.dispose();
		} catch {
			/* noop */
		}
	}, ms);
}

function makePoly(type: "sine" | "square" | "triangle" | "sawtooth", volume: number, ms = 2500): Tone.PolySynth {
	const p = new Tone.PolySynth(Tone.Synth).toDestination();
	p.set({ oscillator: { type } } as Parameters<typeof p.set>[0]);
	p.volume.value = volume;
	autoDispose(p, ms);
	return p;
}

function playMarimba(): void {
	const p = makePoly("triangle", -8);
	const now = Tone.now();
	["C5", "G5", "C6"].forEach((n, i) => p.triggerAttackRelease(n, "16n", now + i * 0.12));
}

function playChimeOnce(time: number): void {
	const p = makePoly("triangle", -10, 5000);
	["E5", "B5", "E6"].forEach((n, i) => p.triggerAttackRelease(n, "8n", time + i * 0.18));
}

/** isLast: 最後=チャイム×3（各回の間に一拍） / それ以外=マリンバ×1。 */
export function playMarkSound(isLast: boolean): void {
	try {
		if (isLast) {
			const now = Tone.now();
			for (let i = 0; i < 3; i++) playChimeOnce(now + i * 1.2);
		} else {
			playMarimba();
		}
	} catch {
		/* noop */
	}
}
