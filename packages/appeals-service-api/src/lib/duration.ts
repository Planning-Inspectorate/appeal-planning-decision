// ms in time units
const SECONDS = 1000;
const MINUTES = SECONDS * 60;

/**
 * Convert a ms duration into a readable string
 */
export function msToDurationString(ms: number): string {
	if (ms === 0) {
		return '0';
	}
	if (ms < SECONDS) {
		return `${ms}ms`;
	}
	const s = Math.floor((ms / SECONDS) % 60);
	const mins = Math.floor((ms / MINUTES) % 60);

	if (mins === 0) {
		return `${s}s`;
	}
	const suffix = mins > 1 ? 'mins' : 'min';
	if (s === 0) {
		return `${mins}${suffix}`;
	}
	return `${mins}${suffix} ${s}s`;
}
