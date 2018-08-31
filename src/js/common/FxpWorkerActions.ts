import { ApplicationConstants } from "./ApplicationConstants";
import { CommonUtils } from "../utils/CommonUtils";

export class FxpWorkerActions {

	private static _fxpouchdbworker: FxpWorkerActions;
	public pcworker;

	constructor() {
		FxpWorkerActions._fxpouchdbworker = this;
	}

	public static getWorkerInstance(): FxpWorkerActions {
		if (CommonUtils.isNullOrEmpty(this._fxpouchdbworker)) {
			this._fxpouchdbworker = new FxpWorkerActions();
		}
		return this._fxpouchdbworker;
	}

	public startFxpWebWorker(): void {
		if (typeof (Worker) !== "undefined" && typeof (this.pcworker) == "undefined") {
			this.pcworker = new Worker(ApplicationConstants.WorkerFilepath);
		}
		else {
			console.log("Worker is not supported ");
		}
	}

	public sendMessage(data): void {
		if (this.pcworker != undefined) {
			this.pcworker.postMessage(data) // Start worker with sync                
		}
		else {
			this.startFxpWebWorker();
			this.pcworker.postMessage(data)
		}
	}

	public stopFxpWebWorker(): void {
		//Stop the web worker
		if (this.pcworker != undefined) {
			this.pcworker.terminate();
		}
	}

}