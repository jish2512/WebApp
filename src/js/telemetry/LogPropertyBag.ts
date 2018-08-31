export class LogPropertyBag {
	private propBagInternal: any = {};
	constructor() {
	}

	addToBag(key: string, value: string): void {
		this.propBagInternal[key] = value;
	}

	getItems(): any {
		return this.propBagInternal;
	}
	addRange(propertyBag: LogPropertyBag) {
		var properties = propertyBag.getItems();

		for (var property in properties) {
			this.addToBag(property, properties[property]);
		}
	}

	removeFromBag(key: string) {
		delete this.propBagInternal[key];
	}

}
