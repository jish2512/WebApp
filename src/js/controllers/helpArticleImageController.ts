export class HelpArticleImageController {
	constructor(
		private $uibModalInstance: any,
		private source: any
	) { }

	closeModal() {
		var self = this;
		self.$uibModalInstance.dismiss()
	}
}