/** 90 -> "1:30" */
export function fmtClock(totalSec: number): string {
	const m = Math.floor(totalSec / 60);
	const s = Math.floor(totalSec % 60);
	return `${m}:${String(s).padStart(2, "0")}`;
}

/** 経過msを分・秒・ms（ゼロ埋め）に分解。 */
export function splitTime(ms: number): { min: string; sec: string; ms: string } {
	const total = Math.max(0, Math.floor(ms));
	return {
		min: String(Math.floor(total / 60000)).padStart(2, "0"),
		sec: String(Math.floor((total % 60000) / 1000)).padStart(2, "0"),
		ms: String(total % 1000).padStart(3, "0"),
	};
}

/** 60 -> "1分", 450 -> "7分30秒", 30 -> "30秒" */
export function fmtJp(totalSec: number): string {
	const m = Math.floor(totalSec / 60);
	const s = Math.floor(totalSec % 60);
	if (m === 0) return `${s}秒`;
	if (s === 0) return `${m}分`;
	return `${m}分${s}秒`;
}

/**
 * "mm:ss" -> 秒数。コロンは省略可（末尾2桁=秒、残り=分）。
 * 例: "0100"/"100" -> 60, "30" -> 30。不正・0以下は null。
 */
export function parseMmSs(raw: string): number | null {
	const s = raw.trim();
	let min: number;
	let sec: number;
	const colon = /^(\d{1,3}):([0-5]?\d)$/.exec(s);
	if (colon) {
		min = parseInt(colon[1], 10);
		sec = parseInt(colon[2], 10);
	} else if (/^\d{1,5}$/.test(s)) {
		min = s.length > 2 ? parseInt(s.slice(0, -2), 10) : 0;
		sec = parseInt(s.slice(-2), 10);
		if (sec > 59) return null;
	} else {
		return null;
	}
	const total = min * 60 + sec;
	return total > 0 ? total : null;
}
