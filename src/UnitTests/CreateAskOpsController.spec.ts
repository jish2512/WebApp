/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />
import {CreateAskOpsController} from '../js/controllers/createAskOpsController';
declare var angular:any;
describe("Given createAskOpsController", function () {
	var $rootScope, fxpLoggerService, $window, createAskOpsController, uibModalInstance, settingsService, fxpMessage, $q, $timeout, defaultRequestType;

	beforeEach(angular.mock.module('FxPApp'));
	beforeEach(angular.mock.module('ui.router'));
	beforeEach(function () {
		var propBag = function () {
			return {
				addToBag: function (a, b) {
					console.log('propbag =>' + a + ':' + b);
				}
			};
		};
		angular.mock.module(function ($provide) {
			$provide.service("FxpLoggerService", function () {
				this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function (a, b) {
					console.log(a + ' - ' + b);
					return propBag();
				});
				this.logError = jasmine.createSpy("logError").and.callFake(function (a, b, c, d, e) {
					console.log('logError : ' + a + ',' + b + ',' + c + ',' + d + ',' + e);
				});
				this.logEvent = jasmine.createSpy("logEvent ").and.callFake(function (a, b, c) {
					console.log('logEvent  : ' + a + ',' + b + ',' + c);
				});
				this.logPageLoadMetrics = jasmine.createSpy("logPageLoadMetrics").and.callFake(function (a) {
					console.log('logPageLoadMetrics  : ' + a);
				});
			});
			$provide.service("FxpMessageService", function () {
				this.addMessage = jasmine.createSpy("addMessage").and.callFake(function (a, b) {
					console.log('addMessage: ' + a + '' + b);
				});
			});
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
			$provide.service("SettingsService", function () {
				this.getSettings = jasmine.createSpy("saveContext").and.callFake(function () {
					return {
						then: function (callback) {
							return callback({
								data: [{
									settingValue: "[{\"DisplayText\":\"User Account Request for Subcons and Non-ES Resources\",\"Description\":\"\",\"ShortURL\":\"https://aka.ms/subconaccntrequest\",\"LongURL\":\"https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D809926bddbcd0f888ecf546adc961966%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541\"},{\"DisplayText\":\"SAP User Account Request\",\"Description\":\"\",\"ShortURL\":\"https://aka.ms/sapuseraccntrequest\",\"LongURL\":\"https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D9f2aae79db014f888ecf546adc96191c%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541\"},{\"DisplayText\":\"Credit and Rebill Request\",\"Description\":\"Credit or Rebill. EBS ID, Account Name, Invoice #, Original Invoice Value, Dates, rates and # of Hours, expense amount, FF Amount and Milestone Type Credit:  Cancellation or Credit, Rebill SO/WBS Information.\",\"ShortURL\":\"https://aka.ms/credit-rebill\",\"LongURL\":\"https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D5bba6a75db414f888ecf546adc96199b%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541\"},{\"DisplayText\":\"Customer Invoice Request\",\"Description\":\"Adhoc or batch request. For Adhoc include SO/WBS Information, Account Name, Invoice Cutoff date and Invoice Date, For batch include Primary Billing Office, # of Invoices Requested, Invoice cutoff date and Invoice date.\",\"ShortURL\":\"https://aka.ms/custinvoicerequest\",\"LongURL\":\"https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D7a2b26bddb414f888ecf546adc961963%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541\"},{\"DisplayText\":\"Time Entry/Adjust/Transfer on Behalf\",\"Description\":\"Labor Policy Exception Approval ID.\",\"ShortURL\":\"https://aka.ms/time-entry-adjust-transfer\",\"LongURL\":\"https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D951cea7ddb814f888ecf546adc96194e%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541\"},{\"DisplayText\":\"Expense Entry/Transfer on Behalf\",\"Description\":\"Labor Policy Exception Approval ID.\",\"ShortURL\":\"https://aka.ms/expense-entry-transfer\",\"LongURL\":\"https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D1bbcaa79dbc14f888ecf546adc961946%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541\"},{\"DisplayText\":\"Delegation on Behalf\",\"Description\":\"Name of the Project Manager, Delegate Project manager, Start and End date, Confirmation email from approver and Line Manger.\",\"ShortURL\":\"https://aka.ms/delegationrequest\",\"LongURL\":\"https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D1f4de6f1db054f888ecf546adc9619e7%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541\"},{\"DisplayText\":\"Identify transactions for supplier credit note\",\"Description\":\"\",\"ShortURL\":\"https://aka.ms/supplier-creditnote-transactions\",\"LongURL\":\"https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D0a5e22b9db454f888ecf546adc961986%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541\"},{\"DisplayText\":\"Request update of Task ID for subcon delivery (Error Scenario)\",\"Description\":\"\",\"ShortURL\":\"https://aka.ms/updatetask_id\",\"LongURL\":\"https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D60bee275db854f888ecf546adc96198b%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541\"},{\"DisplayText\":\"Work Complete (Milestone Confirmation)\",\"Description\":\"Work Complete Date.\",\"ShortURL\":\"https://aka.ms/milestone-confirm\",\"LongURL\":\"https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D828f2ef1dbc54f888ecf546adc961992%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541\"},{\"DisplayText\":\"Request Assistance from Project Controller\",\"Description\":\"\",\"ShortURL\":\"https://aka.ms/project_controller_assist\",\"LongURL\":\"https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D89efe23ddbc54f888ecf546adc96192f%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541\"},{\"DisplayText\":\"Request update to PO\",\"Description\":\"\",\"ShortURL\":\"https://aka.ms/update_po\",\"LongURL\":\"https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D8f20b635db094f888ecf546adc96195c%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541\"},{\"DisplayText\":\"Maintenance actions for EM/ADE resource changes\",\"Description\":\"Resource Name, New Resource Name, EBS ID, Project Name, Planned Start, Planned Finish and Planned hours.\",\"ShortURL\":\"https://aka.ms/em_ade_maintenance\",\"LongURL\":\"https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3Df390be79db094f888ecf546adc96190b%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541\"},{\"DisplayText\":\"Other Request\",\"Description\":\"\",\"ShortURL\":\"https://aka.ms/other_request\",\"LongURL\":\"https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D2c9beef1db814f888ecf546adc961939%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541\"}]"
								}]
							}
							);
						}
					}
				});
			});
		});
	});
	beforeEach(angular.mock.inject(function (_$rootScope_, _$window_, FxpLoggerService, $uibModalInstance, SettingsService, FxpMessageService, _$controller_, _$q_, _$timeout_) {
		$rootScope = _$rootScope_.$new();
		$window = _$window_;
		fxpLoggerService = FxpLoggerService;
		uibModalInstance = $uibModalInstance
		createAskOpsController = _$controller_;
		settingsService = SettingsService;
		fxpMessage = FxpMessageService;
		$q = _$q_;
		$timeout = _$timeout_;
		defaultRequestType = null;
	}));
	describe("When createAskOpsController is loaded", () => {
		var controller;
		beforeEach(function () {
			controller = createAskOpsController("CreateAskOpsController", {
				$rootScope: $rootScope,
				$window: $window,
				FxpLoggerService: fxpLoggerService,
				defaultRequestType: defaultRequestType
			});
		});
		it("getSettings to be called", () => {
			expect(settingsService.getSettings).toHaveBeenCalled();
		});
		it("requestTypeData should not be empty", () => {
			expect(controller.requestTypeData.length).not.toEqual(0);
		});
	});
	describe("When createAskOpsController is loaded and getSettings service throws error.", () => {
		var controller;
		beforeEach(function () {
			settingsService.getSettings = jasmine.createSpy("getSettings").and.callFake(function () {
				var defer = $q.defer();
				var errwithoutcode = {
					status: "404",
					statusText: "Not Found",
					data: ""
				};
				defer.reject(errwithoutcode);
				return defer.promise;
			});
			controller = createAskOpsController("CreateAskOpsController", {
				$rootScope: $rootScope,
				$window: $window,
				defaultRequestType: defaultRequestType
			});
			$timeout.flush();
		});
		it("fxpMessage.addMessage to be called", () => {
			expect(fxpMessage.addMessage).toHaveBeenCalled();
		});
		it("fxpLoggerService.logError to be called", () => {
			expect(fxpLoggerService.logError).toHaveBeenCalled();
		});
	});
	describe("When closeModal is called", () => {
		var controller;
		beforeEach(function () {
			controller = createAskOpsController("CreateAskOpsController", {
				$rootScope: $rootScope,
				$window: $window,
				FxpLoggerService: fxpLoggerService,
				defaultRequestType: defaultRequestType
			});
			controller.closeModal();
		});
		it("$uibModalInstance.dismiss to be called", () => {
			expect(uibModalInstance.dismiss).toHaveBeenCalled();
		})
	});
	describe("When openPage is called", () => {
		var controller;
		beforeEach(function () {
			$window.open = jasmine.createSpy("open").and.callFake(function (a, b) {
				console.log(a);
			});
			controller = createAskOpsController("CreateAskOpsController", {
				$rootScope: $rootScope,
				$window: $window,
				FxpLoggerService: fxpLoggerService,
				defaultRequestType: defaultRequestType
			});
			controller.currentRequestType = {
				"DisplayText": "User Account Request for Subcons and Non-ES Resources",
				"Description": "",
				"ShortURL": "https://aka.ms/subconaccntrequest",
				"LongURL": "https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D809926bddbcd0f888ecf546adc961966%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541"
			}
			spyOn(controller, "closeModal").and.callThrough();
			controller.openPage();
		});
		it("$window.open to be called", () => {
			expect($window.open).toHaveBeenCalled();
		})
		it("fxpLoggerService.logEvent to be called", () => {
			expect(fxpLoggerService.logEvent).toHaveBeenCalled();
		});
		it("closeModal to be called", () => {
			expect(controller.closeModal).toHaveBeenCalled();
		});
	});
});
