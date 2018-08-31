
export class IframeBridgeService {

	static $inject = ["$injector"]
	public constructor(private $injector: angular.auto.IInjectorService) {

	}

	public callNgServiceFunc(serviceName: string, serviceFuncName: string, params: Array<any>) {
		if (this.$injector.has(serviceName)) {
			var service = this.$injector.get(serviceName);
			if (service[serviceFuncName])
				return service[serviceFuncName].apply(service, params);
			else throw new Error(`Invalid function name: ${serviceFuncName}`);
		}
		else throw new Error(`Invalid service name: ${serviceName}`);
	}
}
angular.module("NonFxpApp")
	.service("IframeBridgeService", IframeBridgeService)