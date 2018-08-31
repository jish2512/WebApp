//import { IRepository } from "../interfaces/IRepository";

////module Fxp.Common {
////    export abstract class FluxActionBase {
////        private _repository: Fxp.Interfaces.IRepository;

////        constructor(repository: Fxp.Interfaces.IRepository) {
////            this._repository = repository;
////        }

////        public create(payload: any): void {
////            this._repository.create(payload).then(this.invokeDispatcher(payload.ActionType, payload.Data));
////        }

////        public update(payload: any): void {
////            this._repository.update(payload).then(this.invokeDispatcher(payload.ActionType, payload.Data));
////        }

////        public delete(payload: any): void {
////            this._repository.delete(payload).then(this.invokeDispatcher(payload.ActionType, payload.Data));
////        }

////        private invokeDispatcher(actionType: Fxp.Common.FluxActionTypes, data: any): any {
////            Dispatchers.Dispatcher.getCurrentInstance().dispatch({
////                actionType: actionType,
////                data: data
////            });
////        }

////    }
////}



//export abstract class FluxActionBase {
//	private _repository: IRepository;

//	constructor(repository: IRepository) {
//		this._repository = repository;
//	}

//	public create(payload: any): void {
//		this._repository.create(payload).then(this.invokeDispatcher(payload.ActionType, payload.Data));
//	}

//	public update(payload: any): void {
//		this._repository.update(payload).then(this.invokeDispatcher(payload.ActionType, payload.Data));
//	}

//	public delete(payload: any): void {
//		this._repository.delete(payload).then(this.invokeDispatcher(payload.ActionType, payload.Data));
//	}

//	private invokeDispatcher(actionType: Fxp.Common.FluxActionTypes, data: any): any {
//		Dispatchers.Dispatcher.getCurrentInstance().dispatch({
//			actionType: actionType,
//			data: data
//		});
//	}

//}