describe('gjhgjh', () => {
	it('test', () => {
		const b = {
			b: '1'
		};

		const a = {
			a: new Asd(1, b)
		};

		console.log(b.b);
		console.log(a.a.toJson());
	});
});

class Asd {
	constructor(x, y) {
		this.x = x;
		this.y = y + x;
	}

	toJson() {
		return JSON.stringify(this);
	}
}
