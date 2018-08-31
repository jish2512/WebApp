import { Subject } from 'rxjs';
import { IRootScope } from '../interfaces/IRootScope';
import { CommonUtils } from '../utils/CommonUtils';

export class FxpEventBroadCastService {
	private subject: Subject<any>;
	private subjects: any = [];
	constructor(private $rootScope: IRootScope) {
	}
	private broadCastSubject(eventName: string, value: any) {
		var self = this;
		var eventIndex = CommonUtils.getIndexOfObject(self.subjects, "eventName", eventName);
		if (eventIndex > -1) {
			self.subjects[eventIndex].subject.onNext(value);
		} else {
			let event = {
				eventName: eventName,
				subject: self.getSubjectInstance()
			}
			self.subjects.push(event);
		}
	}
	private subscribeToSubject(eventName: string): Subject<any> {
		var self = this;
		var eventIndex = CommonUtils.getIndexOfObject(self.subjects, "eventName", eventName);
		if (eventIndex > -1) {
			return self.subjects[eventIndex].subject;
		} else {
			let event = {
				eventName: eventName,
				subject: self.getSubjectInstance()
			}
			self.subjects.push(event);
			return event.subject;
		}
	}
	private unsubscribeSubject(eventName: string) {
		var self = this;
		var eventIndex = CommonUtils.getIndexOfObject(self.subjects, "eventName", eventName);
		if (eventIndex > -1) {
			self.subjects[eventIndex].subject.unsubscribe();
		}
	}
	public On(eventName: string, callBack: any) {
		var self = this;
		self.$rootScope.$on(eventName, callBack);
	}
	public broadCast(eventName: string, value: any) {
		var self = this;
		self.$rootScope.$broadcast(eventName, value);
	}
	public emit(eventName: string, callBack: any) {
		var self = this;
		self.$rootScope.$emit(eventName, callBack);
	}
	private off(eventName: string) {
		//var self = this;
		//self.$rootScope.$broadcast(eventName,value);		
	}

	private getSubjectInstance(): any {
		var subject = new Subject();
		return subject;
	}

}