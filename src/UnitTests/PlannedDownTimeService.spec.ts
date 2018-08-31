/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />

//import * as moment from "moment";
describe("Given PlannedDownTimeService", () => {

    var $scope;
    var $rootScope;
    var $q, deffered, $timeout, timeZoneHelper, fxpConfigurationService, systemMessagesService, momentObject, systemMessagesConsts, fxpLoggerService, plannedDownTimeService;
    var UIStrings = {
        SYSTEM_MESSAGE: "System Message",
        SYSTEM_MESSAGES: "System Messages",
        ADD: "Add",
        EDIT: "Edit",
        SAVE: "Save",
        DELETE: "Delete",
        CANCEL: "CANCEL",
        ADD_MESSAGES: "Message",
        SYSTEM_MESSAGE_DESC: "Create and manage . The alert messages can be set to show up for all pages or only on a specified page.",
        ITEMS_TO_DISPLAY: "Items to display:",
        MESSAGE: {
            TYPE: "Type",
            MESSAGE: "MESSAGE",
            WORKFLOW: "Workflow(L0)",
            FUNCTION: "Function(L1)",
            START: "Start Date/Time",
            END: "End Date/Time"
        },

        TYPE: {
            INTERMITTENT: "Intermittent",
            SYSTEM_DOWN: "System Down"
        },
        BUSINESS_CAPABILITY: "Business capability (L0)",
        BUSINESS_FUNCTION: "Business function (L1)",
        MESSAGE_TO_USER: "Message to User",
        ADD_SYSTEM_MESSAGE: "${SYSTEM_MESSAGE_UI.ADD} ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}",
        EDIT_SYSTEM_MESSAGE: "${SYSTEM_MESSAGE_UI.EDIT} ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}",
        DELETE_SYSTEM_MESSAGE: "${SYSTEM_MESSAGE_UI.DELETE} ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}",

        DELETE_CONFIRMATION: "Are you sure you want to delete this",

        ERRORS: {
            CANNOT_FETCH_SYSTEM_MESSAGE: "The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGES}s could not be fetched.",
            CANNOT_FETCH_BBUSINESS_WORKFLOW: "The business Workflows could not be fetched.",
            CANNOT_ADD_SYSTEM_MESSAGE: "The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} could not be added.",
            CANNOT_UPDATE_SYSTEM_MESSAGE: "The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} could not be updated.",
            CANNOT_DELETE_SYSTEM_MESSAGE: "The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} could not be deleted.",
            CANNOT_FETCH_PLANEDDOWNTIME: "The planned downtime messages could not be fetched.",

            BUSINESS_CAPABILITY_REQUIRED: "${SYSTEM_MESSAGE_UI.BUSINESS_CAPABILITY} is Required.",
            BUSINESS_FUNCTION_REQUIRED: "${SYSTEM_MESSAGE_UI.BUSINESS_FUNCTION} is Required.",
            MESSAGE_REQUIRED: "${SYSTEM_MESSAGE_UI.MESSAGE_TO_USER} is Required.",
            START_DATE_REQUIRED: "${SYSTEM_MESSAGE_UI.MESSAGE.START} is Required.",
            END_DATE_REQUIRED: "${SYSTEM_MESSAGE_UI.MESSAGE.END} is Required.",
            END_DATE_MIN: "${SYSTEM_MESSAGE_UI.MESSAGE.END} must be after ${SYSTEM_MESSAGE_UI.MESSAGE.START}."
        },

        SUCCESS: {
            SYSTEM_MESSAGE_ADDED: "The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} was successfully added.",
            SYSTEM_MESSAGE_UPDATED: "The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} was successfully updated.",
            SYSTEM_MESSAGE_DELETED: "The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} was successfully deleted."
        },

        LOADING_TEXTS: {
            FETCHING_MESSAGES: "Loading ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGES}",
            ADDING_MESSAGE: "Adding ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}",
            UPDATING_MESSAGE: "Updating ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}",
            DELETING_MESSAGE: "Deleting ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}"
        },

        PAGINATION: { PREV: "Prev", NEXT: "Next" }
    };
    momentObject = moment();

    beforeEach(angular.mock.module('FxPApp'));    

    beforeEach(function () {
        angular.mock.module(function ($provide) {
            $provide.service("FxpConfigurationService", function () {
                this.FxpAppSettings = {
                    "FxpServiceEndPoint": "https://mocksysmsgservice",
                    FlashPollingIntervalInMinutes: 1,
                    DisplayFlashBeforeMinutes: 2
                };
            });

            $provide.service("TimeZoneHelper", function () {
                this.convertToPacific = jasmine.createSpy("convertToPacific").and.callFake(function (a) {
                    return new Date();
                });
                this.convertToUtc = jasmine.createSpy("convertToUtc").and.callFake(function (a) {
                    return momentObject;
                });
                this.changeTimeZoneComponentToPacific = jasmine.createSpy("changeTimeZoneComponentToPacific").and.callFake(function (a) {
                    return momentObject;
                });
                this.convertUtcToLocal = jasmine.createSpy("convertUtcToLocal").and.callFake(function (a) {
                    return momentObject;
                });
            });

            $provide.service('moment', function () {
                this.utc = jasmine.createSpy("utc").and.callFake(function (a) {
                    return momentObject;
                });
                this.tz = jasmine.createSpy("tz").and.callFake(function (a) {
                    return momentObject;
                });                
            });

            $provide.service("SYSTEM_MESSAGE_UI", function () {
                return UIStrings;
            });

            $provide.service("FxpLoggerService", function () {
                this.logInformation = jasmine.createSpy("logInformation").and.callFake(function (a, b) {
                    console.log('logInformation : ' + a + ',' + b);
                });
                this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function () {
                    return {
                        addToBag: jasmine.createSpy("addToBag").and.callFake(function (a, b) {
                            console.log('propbag =>' + a + ':' + b);
                        })
                    };
                });
                this.createMetricBag = jasmine.createSpy("createMetricBag").and.callFake(function () {
                    return {
                        addToBag: jasmine.createSpy("addToBag").and.callFake(function (a, b) {
                            console.log('propbag =>' + a + ':' + b);
                        })
                    };
                });

                this.logTrace = jasmine.createSpy("logTrace").and.callFake(function (a, b) {
                    console.log('logTrace : ' + a + ',' + b);
                });
                this.logError = jasmine.createSpy("logError").and.callFake(function (a, b, c, d, e) {
                    console.log('logError : ' + a + ',' + b + ',' + c + ',' + d + ',' + e);
                });
                this.logMetric = jasmine.createSpy("logMetric").and.callFake(function (a, b, c, d) {
                    console.log('logMetric : ' + a + ',' + b + ',' + c + ',' + d);
                });
                this.logPageLoadMetrics = jasmine.createSpy("logPageLoadMetrics").and.callFake(function () {
                    console.log('logPageLoadMetrics');
                });
            });

        })
    })

    beforeEach(inject(function (_$rootScope_,_$timeout_, FxpConfigurationService, SystemMessagesService, TimeZoneHelper, SYSTEM_MESSAGE_UI, FxpLoggerService, PlannedDownTimeService) {
        $scope = _$rootScope_;
        $rootScope = _$rootScope_; 
        $timeout = _$timeout_;        
        fxpConfigurationService = FxpConfigurationService;
        systemMessagesService = SystemMessagesService;
        timeZoneHelper = TimeZoneHelper;             
        systemMessagesConsts = SYSTEM_MESSAGE_UI; 
        fxpLoggerService = FxpLoggerService; 
        plannedDownTimeService = PlannedDownTimeService;   
    }));

    beforeEach(inject(function (_$q_) {
        $q = _$q_;
        deffered = _$q_.defer();
    }));

    describe("When PlannedDownTimeService is loaded", () => {

        it("Then intervalTimeMinutes should be populated.", () => {            
            expect(plannedDownTimeService.intervalTimeMinutes).toEqual(1);
        });
        it("Then displayFlashBeforeMinutes should be populated.", () => {
            expect(plannedDownTimeService.displayFlashBeforeMinutes).toEqual(2);
        });
    });

    describe("When pollForPlannedDownTimesandUpdateFlash method is called", () => {
        var date = new Date();
        momentObject = this.moment(date);
        var systemMessage = {
            "id": "1",
            "messageType": "Intermittent",
            "message": "Intermittent issue",
            "businessCapability": [{
                "Profile": "Profile",
                "id": 1
            }],
            "businessFunction": "Data",
            "startTime": this.moment(date),
            "startTimeString": "2017-04-04 12:30",
            "endTime": this.moment(date),
            "endTimeString": "2017-04-05 12:30",
            "createdOn": this.moment(date),
            "createdBy": "abgul@microsoft.com",
            "lastModifiedBy": "ch@microsoft.com"
        };

        var systemMessages = {systemMessage};
        beforeEach(function () {            
            systemMessagesService.getPlannedDownTimeCollection = jasmine.createSpy("getPlannedDownTimeCollection").and.returnValue(deffered.promise);
            plannedDownTimeService.pollForPlannedDownTimesandUpdateFlash();          
        });

        it("Then if System Messages collection is empty, no system message should be displayed.", () => {
            deffered.resolve({
                data: systemMessage
            });
            $scope.$apply();
            expect(plannedDownTimeService.intervalTimeMinutes).toEqual(1);
        });

        it("Then if System Messages collection is returned, the collection should be retrived.", () => {
            deffered.resolve({
                data: { systemMessages }
            });
            $scope.$apply();
            expect(plannedDownTimeService.intervalTimeMinutes).toEqual(1);
        });

        it("Then if the promise is rejected, error message should be logged.", () => {
            deffered.reject("No System Records Found");
            $scope.$apply();
            expect(plannedDownTimeService.logger.logError).toHaveBeenCalledWith("Fxp.Services.PlannedDownTimeService",
                "The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGES}s could not be fetched.", "2930", "No System Records Found");
        });

    });

    describe("When cancelNextLoad method is called", () => {

        it("Then the next load should be canceled.", () => {
            plannedDownTimeService.cancelNextLoad();
        });       
    });

    describe("When nextLoad method is called", () => {

        it("Then the next load should be called.", () => {
            plannedDownTimeService.nextLoad();            
        });
    });

    describe("When updateFlash method is called", () => {
        var date = new Date();
        momentObject = this.moment(date);
        var systemMessage = {
            "id": "1",
            "messageType": "Intermittent",
            "message": "Intermittent issue",
            "businessCapability": [{
                "Profile": "Profile",
                "id": 1
            }],
            "businessFunction": "Data",
            "startTime": this.moment(date),
            "startTimeString": "2017-04-04 12:30",
            "endTime": this.moment(date),
            "endTimeString": "2017-04-05 12:30",
            "createdOn": this.moment(date),
            "createdBy": "abgul@microsoft.com",
            "lastModifiedBy": "ch@microsoft.com"
        };        

        var systemMessages = { systemMessage };       

        beforeEach(function () {
            plannedDownTimeService.currentLeftNavItem = "Profile";
            plannedDownTimeService.plannedDownTimeCollection = systemMessages;
            plannedDownTimeService.updateFlash();
        });

        it("Then if start time and end time are equal then do not update flash.", () => {           
            expect(plannedDownTimeService.isFlashVisible).toBeFalsy();
        });        
    });

    describe("When updateFlash method is called and Flash gets updated", () => {
        var date = new Date();
        momentObject = this.moment(date);       

        var systemMessage = {
            "id": "1",
            "messageType": "Intermittent",
            "message": "Intermittent issue",
            "businessCapability": [{
                "Profile": "Profile",
                "id": 1,
                "name":"Profile"
            }],
            "businessFunction": "Data",
            "startTime": this.moment(date),
            "startTimeString": "2017-04-04 12:30",
            "endTime": this.moment(date).add(1, "days"),
            "endTimeString": "2017-04-05 12:30",
            "createdOn": this.moment(date),
            "createdBy": "abgul@microsoft.com",
            "lastModifiedBy": "ch@microsoft.com"
        };        
        
        var systemMessages = { systemMessage };        

        beforeEach(function () {
            plannedDownTimeService.currentLeftNavItem = { "id": 1};            
            plannedDownTimeService.plannedDownTimeCollection = systemMessages;
            plannedDownTimeService.updateFlash();
        });

        it("Then if start time and end time are not equal then display flash.", () => {
            expect(plannedDownTimeService.isFlashVisible).toBeFalsy();
        });
        it("Then expect flash message to be populated.", () => {
            expect(plannedDownTimeService.flashMesage).not.toBeNull();
        });        
    });    
});