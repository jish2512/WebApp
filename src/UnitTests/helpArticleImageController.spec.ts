/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />
import {HelpArticleImageController} from '../js/controllers/HelpArticleImageController';
declare var angular:any;
describe("Given HelpArticleImageController", function () {
	var helpArticleImageController, uibModalInstance, source;

	beforeEach(angular.mock.module('FxPApp'));
	beforeEach(angular.mock.module('ui.router'));
	beforeEach(function () {		
		angular.mock.module(function ($provide) {
			$provide.service("$uibModalInstance", function () {
				this.dismiss = jasmine.createSpy("dismiss").and.callFake(function () {
					return {
						result: {
							then: function (callback) {
								return callback({ "Success": true });
							}
						}
					};
				});
				this.close = jasmine.createSpy("close").and.callFake(function () {
					return {
						result: {
							then: function (callback) {
								return callback({ "Success": true });
							}
						}
					};
				});
			});
		});
	});
	beforeEach(angular.mock.inject(function ($uibModalInstance, _$controller_) {
		helpArticleImageController = _$controller_
		uibModalInstance = $uibModalInstance;
		source = "";
	}));
	describe("When closeModal is called", () => {
		var controller;
		beforeEach(function () {
			controller = helpArticleImageController("HelpArticleImageController", {
				source: source
			});
			controller.closeModal();
		});
		it("$uibModalInstance.dismiss to be called", () => {
			expect(uibModalInstance.dismiss).toHaveBeenCalled();
		})
	});
});
