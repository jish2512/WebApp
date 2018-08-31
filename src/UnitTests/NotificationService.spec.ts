/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />
import{NotificationService}from '../js/services/NotificationService';
declare var angular:any;
describe("Given NotificationService", () => {
    var $httpBackend, fxpConfigurationService, fxpDataService, notificationService, $q, $timeout;
    beforeEach(angular.mock.module('FxPApp'));

    beforeEach(function () {
        angular.mock.module(function ($provide) {
            $provide.service("FxpConfigurationService", function () {
                this.FxpAppSettings = {
					"NotificationServiceEndpoint": "https://mocknotifservice",
					"FxpServiceEndPoint":"https://mocknotifservice"
                };
            });

            $provide.service("DataService", function () {
                this.get = jasmine.createSpy("get").and.callFake(function (url, parentDeferred) {
                    var defered = $q.defer();
                    console.log(url);

                    $timeout(function () {
                        switch (url) {
                            case "https://mocknotifservice/webnotifications/unreadcountforuser":
                                defered.resolve(4);
                                break;
                            case "https://mocknotifservice/webnotifications?skipRecordCount=0&batchSize=2&status=unread&offset=123":
                                defered.resolve([{ "From": "Test" }, { "From": "Test2" }]);
                                break;
                        }
                    }, 1000);

                    return defered.promise;
                });
            });
        })
    })

    beforeEach(angular.mock.inject(function (_$httpBackend_, _$q_, _$timeout_, FxpConfigurationService, DataService, _NotificationService_) {
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $timeout = _$timeout_;
        notificationService = _NotificationService_;
        fxpConfigurationService = FxpConfigurationService;
        fxpDataService = DataService;
    }));

    describe("When getUnreadNotificationsCount is called", () => {
        var result = 1;

        it("Then it should fetch the count of unread notification for the user", function (done) {
            notificationService.getUnreadNotificationsCount().then(function (data) {
                expect(data).toEqual(4);
            })
                .finally(done);

            $timeout.flush();
        });
    });

    describe("When get all notification is called", () => {

        it("Then it should fetch all the notitications for the user", function (done) {
            notificationService.getNotifications(0, 2, 'unread', 123).then(function (data) {
                expect(data[0]["From"]).toEqual("Test");
            })
                .finally(done);

            $timeout.flush();
        });
    });

    describe("When deleteNotification is called", () => {

        it("Then it should delete the notitication successfully.", function (done) {
            $httpBackend.expectDELETE("https://mocknotifservice/webnotifications/2")
                .respond(200, { "Success": "True" });

            notificationService.deleteNotification(2).then(function (data) {
                expect(data.data["Success"]).toEqual("True");
            })
                .finally(done);

            $httpBackend.flush();
        });
    });

    describe("When deleteAllNotification is called", () => {

        it("Then it should delete all the notitication for the user successfully.", function (done) {
            $httpBackend.expectDELETE("https://mocknotifservice/webnotifications")
                .respond(200, { "Success": "True" });

            notificationService.deleteAllNotification().then(function (data) {
                expect(data.data["Success"]).toEqual("True");
            })
                .finally(done);

            $httpBackend.flush();
        });
    });

    describe("When markNotificationAsRead is called", () => {

        it("Then it should mark the notitication as read successfully", function (done) {
            $httpBackend.expectPATCH("https://mocknotifservice/webnotifications/1")
                .respond(200, { "Success": "True" });

            notificationService.markNotificationAsRead(1).then(function (data) {
                expect(data.data["Success"]).toEqual("True");
            })
                .finally(done);

            $httpBackend.flush();
        });
    });

    describe("When markAllNotificationsAsRead is called", () => {

        it("Then it should mark all notitications as read successfully", function (done) {
            $httpBackend.expectPATCH("https://mocknotifservice/webnotifications/markallasread")
                .respond(200, { "Success": "True" });

            notificationService.markAllNotificationsAsRead().then(function (data) {
                expect(data.data["Success"]).toEqual("True");
            })
                .finally(done);

            $httpBackend.flush();
        });
	});

	describe("When publishNotifications is called", () => {

		it("Then it should publish notification successfully", function (done) {
			$httpBackend.expectPOST("https://mocknotifservice/webnotifications/publish")
				.respond(200, { "Success": "True" });

			notificationService.publishNotifications().then(function (data) {
				expect(data.data["Success"]).toEqual("True");
			})
				.finally(done);

			$httpBackend.flush();
		});
	});
	describe("When publishNotificationsRolesRoleGroup is called", () => {

		it("Then it should publish notification for Roles and Role Groups successfully", function (done) {
			$httpBackend.expectPOST("https://mocknotifservice/notification")
				.respond(200, { "Success": "True" });

			notificationService.publishNotificationsRolesRoleGroup().then(function (data) {
				expect(data.data["Success"]).toEqual("True");
			})
				.finally(done);

			$httpBackend.flush();
		});
	});
});