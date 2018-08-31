import { ComponentType } from './ComponentType'; 

export abstract class EventData {
	public ComponentType: ComponentType;
	public EventType: string;
	public Xcv: string;
	public UserRoleName: string;
}