//from rich harris yootils
/**
 * Generates a `scale` function that maps from `domain` to `range`.
 * `scale.inverse()` returns a function that maps from `range` to `domain`
 * @param {[number, number]} domain
 * @param {[number, number]} range
 */
 export default function linear(domain, range) {
	const d0 = domain[0];
	const r0 = range[0];
	const m = (range[1] - r0) / (domain[1] - d0);
	// console.log('range',range)

	/** @param {number} num */
	function scale(num) {
		// console.log('r0',r0)
		return r0 + (num - d0) * m;
	}
	// console.log('range',range)

	scale.inverse = () => linear(range, domain);
	return scale;
}
