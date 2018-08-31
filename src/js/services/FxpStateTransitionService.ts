import { Subject } from "rxjs";
import { CommonUtils } from '../utils/CommonUtils';
import { FxpConstants } from "../common/ApplicationConstants";
import { StateService } from "@uirouter/core";

export class FxpStateTransitionService {
	private $transitions;
	private subjects: any = [];
	constructor(private $injector: angular.auto.IInjectorService, private stateService: StateService) {
		this.$transitions = this.$injector.get('$transitions');
		this.$transitions.onStart({}, this.onStartStateChangeHandler.bind(this));
		this.$transitions.onSuccess({}, this.onSuccessStateChangeHandler.bind(this));
		this.$transitions.onError({}, this.onErrorStateChangeHandler.bind(this));
		this.stateService.onInvalid(this.onInvalidStateHandler.bind(this));
		this.subjects = [
			{ id: FxpConstants.StateEvents.OnStart, subject: new Subject() },
			{ id: FxpConstants.StateEvents.onSuccess, subject: new Subject() },
			{ id: FxpConstants.StateEvents.onError, subject: new Subject() },
			{ id: FxpConstants.StateEvents.onInvalid, subject: new Subject() }];
	}

	onStartStateChangeHandler(transition: any): void {
		var self = this;		
		self.subjects.filter(event => event.id === FxpConstants.StateEvents.OnStart)[0].subject.next(self.getStateInfo(transition));
	}

	onSuccessStateChangeHandler(transition: any): void {
		var self = this;
		self.subjects.filter(event => event.id === FxpConstants.StateEvents.onSuccess)[0].subject.next(self.getStateInfo(transition));
	}

	onErrorStateChangeHandler(transition: any): void {
		var self = this;
		self.subjects.filter(event => event.id === FxpConstants.StateEvents.onError)[0].subject.next(self.getStateInfo(transition));
	}

	onInvalidStateHandler(toState: any, fromState: any, injector: any): void {
		var self = this;
		self.subjects.filter(event => event.id === FxpConstants.StateEvents.onInvalid)[0].subject.next({ toState: toState, fromState: fromState, injector: injector });
	}	

	getStateInfo(transition: any): any {
		let stateInfo = {
			toState: transition.to(),
			toParams: transition.params('to'),
			fromState: transition.from(),
			fromParams: transition.params('from'),
			error: transition.error()
		};
		return stateInfo;
	}

	onStateChangeStart(callback): Subject<any> {
		var self = this;
		return self.subjects.filter(event => event.id === FxpConstants.StateEvents.OnStart)[0].subject.subscribe(callback);		
	}
	onStateChangeSuccess(callback): Subject<any> {
		var self = this;
		return self.subjects.filter(event => event.id === FxpConstants.StateEvents.onSuccess)[0].subject.subscribe(callback);
	}
	onStateChangeFailure (callback): Subject<any> {
		var self = this;
		return self.subjects.filter(event => event.id === FxpConstants.StateEvents.onError)[0].subject.subscribe(callback);
	}
	onStateNotFound(callback): Subject<any> {
		var self = this;
		return self.subjects.filter(event => event.id === FxpConstants.StateEvents.onInvalid)[0].subject.subscribe(callback);
	}

	offStateChangeStart(observer):void{
		var self =this;
		var currentSubject = self.subjects.filter(event => event.id === FxpConstants.StateEvents.OnStart)[0].subject;
		currentSubject.observers.filter(x => x == observer)[0].unsubscribe();		
	}

	offStateChangeSuccess(observer):void{
		var self =this;
		var currentSubject = self.subjects.filter(event => event.id === FxpConstants.StateEvents.onSuccess)[0].subject;
		currentSubject.observers.filter(x => x == observer)[0].unsubscribe();		
	}

	offStateChangeFailure(observer):void{
		var self =this;
		var currentSubject = self.subjects.filter(event => event.id === FxpConstants.StateEvents.onError)[0].subject;
		currentSubject.observers.filter(x => x == observer)[0].unsubscribe();		
	}
	
	offStateNotFound(observer):void{
		var self =this;
		var currentSubject = self.subjects.filter(event => event.id === FxpConstants.StateEvents.onInvalid)[0].subject;
		currentSubject.observers.filter(x => x == observer)[0].unsubscribe();
	}
} 