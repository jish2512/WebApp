export interface IFluxAction {
	// Invoke the repository to create record. Then invoke the dipacher.
	create(payload: any): any;

	// Invoke the repository to update record. Then invoke the dipacher.
	update(payload: any): any;

	// Invoke the repository to delete record. Then invoke the dipacher.
	delete(payload: any): any;
}