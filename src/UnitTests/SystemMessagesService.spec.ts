/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />
import {SystemMessagesService} from '../js/services/SystemMessagesService';
declare var angular:any;
describe("Given SystemMessagesService", () => {
    var $httpBackend, fxpConfigurationService, systemMessagesService, $q, $timeout;
    beforeEach(angular.mock.module('FxPApp'));

    beforeEach(function () {
        angular.mock.module(function ($provide) {
            $provide.service("FxpConfigurationService", function () {
                this.FxpAppSettings = {
                    "FxpServiceEndPoint": "https://mocksysmsgservice"
                };
            });           
        })
    })

    beforeEach(angular.mock.inject(function (_$httpBackend_, _$q_, _$timeout_, FxpConfigurationService, SystemMessagesService) {
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $timeout = _$timeout_;
        systemMessagesService = SystemMessagesService;
        fxpConfigurationService = FxpConfigurationService;
        //fxpDataService = DataService;
    }));

    describe("When getSystemMessagesCollectionAsync is called", () => {

        it("Then it should fetch the list of system messages", function (done) {            
            
            $httpBackend.when("GET","https://mocksysmsgservice/systemmessages?pageNo=1&pageSize=10&sortOrder=Async")            
                .respond(200, {                    
                        "id": "1",
                        "messageType": "Intermittent",
                        "message": "Intermittent issue",
                        "businessCapability": [{
                            "Profile": "Profile",
                            "id": 1
                        }],
                        "businessFunction": "Data",
                        "startTime": "2017-04-04 12:30",
                        "startTimeString": "2017-04-04 12:30",
                        "endTime": "2017-04-05 12:30",
                        "endTimeString": "2017-04-05 12:30",
                        "createdOn": "2017-04-04 12:30",
                        "createdBy": "abgul@microsoft.com",
                        "lastModifiedBy": "ch@microsoft.com"
                     });

            var data = systemMessagesService.getSystemMessagesCollectionAsync(10, 1, "Async").then(function (data) {
                expect(data.data["message"]).toEqual("Intermittent issue");
            })
                .finally(done);
            $httpBackend.flush();            
        });
    });

    describe("When saveSystemMessageAsync is called", () => {

        it("Then it should save the system message", function (done) {

            $httpBackend.when("POST", "https://mocksysmsgservice/systemmessages")
                .respond(200, { "Success": "True"});

            var data = systemMessagesService.saveSystemMessageAsync().then(function (data) {
                expect(data.data["Success"]).toEqual("True");
            })
                .finally(done);
            $httpBackend.flush();
        });
    });

    describe("When deleteSystemMessageAsync is called", () => {

        it("Then it should delete the system message", function (done) {

            $httpBackend.when("DELETE", "https://mocksysmsgservice/systemmessages?id=33")
                .respond(200, { "Success": "True" });

            var data = systemMessagesService.deleteSystemMessageAsync(33).then(function (data) {
                expect(data.data["Success"]).toEqual("True");
            })
                .finally(done);
            $httpBackend.flush();
        });
    });

    describe("When getPlannedDownTimeCollection is called", () => {

        it("Then it should get the down time period", function (done) {

            $httpBackend.when("GET", "https://mocksysmsgservice/systemmessages/getplanneddowntime")
                .respond(200, { "Success": "True" });

            var data = systemMessagesService.getPlannedDownTimeCollection(33).then(function (data) {
                expect(data.data["Success"]).toEqual("True");
            })
                .finally(done);
            $httpBackend.flush();
        });
    });
});