export class LogMetricBag {
	private metricBagInternal: any = {};
	constructor() {
	}

	addToBag(key: string, value: number) {
		this.metricBagInternal[key] = value;
	}

	getItems() {
		return this.metricBagInternal;
	}
}
