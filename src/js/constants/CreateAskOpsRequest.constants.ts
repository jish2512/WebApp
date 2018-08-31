export class CreateAskOpsModalConstant {
	public static ModalOptions = {
		"templateUrl": "../../templates/fxpCreateAskOpsRequestModal.html",
		"windowClass": "create-askops-request-modal contextual-help",
		"keyboard": true,
		"backdrop": "static",
		"controller": "CreateAskOpsController",
		"controllerAs": "aoCtrl",
		"bindToController": true,
		"ariaLabelledBy": "modal-title",
		"ariaDescribedBy": "modal-description",
		"resolve": {}
	};
}