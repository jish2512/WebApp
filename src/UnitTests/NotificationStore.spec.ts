/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />
import{NotificationStore}from '../js/services/NotificationStore';
declare var angular:any;
describe("Given NotificationStore UT Suite", () => {
    var $rootScope, $state, $q, $timeout, notificationService, notificationStore, notifications;

    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(function () {
        notifications = [{
            "EventId": "66282b8e-6689-4c5e-85dc-fe25701062e3",
            "WebNotificationId": 10085
        },
            {
                "EventId": "66282b8e-6689-4c5e-85dc-fe25701062e6",
                "WebNotificationId": 10086
            }];

        angular.mock.module(function ($provide) {
            $provide.service("NotificationService", function () {
                this.getUnreadNotificationsCount = jasmine.createSpy("getUnreadNotificationsCount").and.callFake(function () {
                    return {
                        then: function (callback) {
                            return callback(3);
                        }
                    }
                });
                this.getNotifications = jasmine.createSpy("getNotifications").and.callFake(function (a, b) {
                    return {
                        then: function (callback) {                            
                            return callback(notifications);
                        }
                    }
                });
                this.deleteNotification = jasmine.createSpy("deleteNotification").and.callFake(function (a) {
                    return {
                        then: function (callback) {
                            var response = { "Success": true };
                            return callback(response);
                        }
                    }
                });
                this.deleteAllNotification = jasmine.createSpy("deleteAllNotification").and.callFake(function () {
                    return {
                        then: function (callback) {
                            var response = { "Success": true };
                            return callback(response);
                        }
                    }
                });
                this.markNotificationAsRead = jasmine.createSpy("markNotificationAsRead").and.callFake(function (a) {
                    return {
                        then: function (callback) {
                            var response = { "Success": true };
                            return callback(response);
                        }
                    }
                });
                this.markAllNotificationsAsRead = jasmine.createSpy("markAllNotificationsAsRead").and.callFake(function () {
                    return {
                        then: function (callback) {
                            var response = { "Success": true };
                            return callback(response);
                        }
                    }
				});
				this.publishNotifications = jasmine.createSpy("publishNotifications").and.callFake(function () {
					return {
						then: function (callback) {
							var response = { "Success": true };
							return callback(response);
						}
					}
				});
				this.publishNotificationsRolesRoleGroup = jasmine.createSpy("publishNotificationsRolesRoleGroup").and.callFake(function () {
					return {
						then: function (callback) {
							var response = { "Success": true };
							return callback(response);
						}
					}
				});
            });
        });
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$state_, _$q_, _$timeout_, NotificationService, _NotificationStore_) {
        $rootScope = _$rootScope_;
        $state = _$state_;
        $q = _$q_;
        $timeout = _$timeout_;
        notificationService = NotificationService;
        notificationStore = _NotificationStore_;
    }));

    describe("When getUnreadNotificationCount method is called", () => {

        it("Then it should fetch the count of unread notification for the user", function (done) {
            notificationStore.getUnreadNotificationCount().then(function (data) {
                expect(data).toEqual(3);
            })
                .finally(done);
            $timeout.flush();
        });
        it("Then it should reject with error, if getUnreadNotificationCount of notificationService thrown error", function (done) {
            var error;
            notificationService.getUnreadNotificationsCount = jasmine.createSpy("getUnreadNotificationsCount").and.callFake(function () {
                var defer = $q.defer();
                error = {
                    messege: "Error in NotificationService"
                };
                defer.reject(error);
                return defer.promise;
            });
            notificationStore.getUnreadNotificationCount().then(function (data) {
            }, function (ex) {
                expect(ex.messege).toEqual(error.messege);
            })
                .finally(done);
            $timeout.flush();
        });
    });
    describe("When getNotifications method is called", () => {

        it("Then it should return the notifications", function (done) {
            notificationStore.getNotifications(1, 2).then(function (data) {
                expect(data).toEqual(notifications);
            })
                .finally(done);
            $timeout.flush();
        });
        it("Then it should reject with error, if getNotifications of notificationService thrown error", function (done) {
            var error;
            notificationService.getNotifications = jasmine.createSpy("getNotifications").and.callFake(function (a, b) {
                var defer = $q.defer();
                error = {
                    messege: "Error in NotificationService"
                };
                defer.reject(error);
                return defer.promise;
            });
            notificationStore.getNotifications(1, 2).then(function (data) {
            }, function (ex) {
                expect(ex.messege).toEqual(error.messege);
            })
                .finally(done);
            $timeout.flush();
        });
    });
    describe("When deleteNotification method is called to delete particular notification", () => {

        it("Then it should delete the particular notification", function (done) {
            notificationStore.deleteNotification(1).then(function (data) {
                expect(data["Success"]).toEqual(true);
            })
                .finally(done);
            $timeout.flush();
        });
        it("Then it should reject with error, if deleteNotification of notificationService thrown error", function (done) {
            var error;
            notificationService.deleteNotification = jasmine.createSpy("deleteNotification").and.callFake(function (a) {
                var defer = $q.defer();
                error = {
                    messege: "Error in NotificationService"
                };
                defer.reject(error);
                return defer.promise;
            });
            notificationStore.deleteNotification(1).then(function (data) {
            }, function (ex) {
                expect(ex.messege).toEqual(error.messege);
            })
                .finally(done);
            $timeout.flush();
        });
    });
    describe("When deleteNotification method is called to delete all notifications", () => {

        it("Then it should delete the all notifications", function (done) {
            notificationStore.deleteNotification(-1).then(function (data) {
                expect(data["Success"]).toEqual(true);
            })
                .finally(done);
            $timeout.flush();
        });
        it("Then it should reject with error, if deleteNotification of notificationService thrown error", function (done) {
            var error;
            notificationService.deleteAllNotification = jasmine.createSpy("deleteAllNotification").and.callFake(function () {
                var defer = $q.defer();
                error = {
                    messege: "Error in NotificationService"
                };
                defer.reject(error);
                return defer.promise;
            });
            notificationStore.deleteNotification(-1).then(function (data) {
            }, function (ex) {
                expect(ex.messege).toEqual(error.messege);
            })
                .finally(done);
            $timeout.flush();
        });
    });
    describe("When markNotificationAsRead method is called", () => {

        it("Then it should mark as read the particular notification", function (done) {
            notificationStore.markNotificationAsRead(1).then(function (data) {
                expect(data["Success"]).toEqual(true);
            })
                .finally(done);
            $timeout.flush();
        });
        it("Then it should reject with error, if markNotificationAsRead of notificationService thrown error", function (done) {
            var error;
            notificationService.markNotificationAsRead = jasmine.createSpy("markNotificationAsRead").and.callFake(function (a) {
                var defer = $q.defer();
                error = {
                    messege: "Error in NotificationService"
                };
                defer.reject(error);
                return defer.promise;
            });
            notificationStore.markNotificationAsRead(1).then(function (data) {
            }, function (ex) {
                expect(ex.messege).toEqual(error.messege);
            })
                .finally(done);
            $timeout.flush();
        });
    });
    describe("When markNotificationAsRead method is called to mark all notifications as read", () => {

        it("Then it should mark all notifications as read", function (done) {
            notificationStore.markNotificationAsRead().then(function (data) {
                expect(data["Success"]).toEqual(true);
            })
                .finally(done);
            $timeout.flush();
        });
        it("Then it should reject with error, if markAllNotificationAsRead of notificationService thrown error", function (done) {
            var error;
            notificationService.markAllNotificationsAsRead = jasmine.createSpy("markAllNotificationsAsRead").and.callFake(function () {
                var defer = $q.defer();
                error = {
                    messege: "Error in NotificationService"
                };
                defer.reject(error);
                return defer.promise;
            });
            notificationStore.markNotificationAsRead().then(function (data) {
            }, function (ex) {
                expect(ex.messege).toEqual(error.messege);
            })
                .finally(done);
            $timeout.flush();
        });
	});
	describe("When publishNotifications method is called", () => {

		it("Then it should return the notifications", function (done) {
			notificationStore.publishNotifications([]).then(function (data) {
				expect(data["Success"]).toEqual(true);
			})
				.finally(done);
			$timeout.flush();
		});
		it("Then it should reject with error, if publishNotifications of notificationService thrown error", function (done) {
			var error;
			notificationService.publishNotifications = jasmine.createSpy("publishNotifications").and.callFake(function (a, b) {
				var defer = $q.defer();
				error = {
					messege: "Error in NotificationService"
				};
				defer.reject(error);
				return defer.promise;
			});
			notificationStore.publishNotifications([]).then(function (data) {
			}, function (ex) {
				expect(ex.messege).toEqual(error.messege);
			})
				.finally(done);
			$timeout.flush();
		});
	});
	describe("When publishNotificationsRolesRoleGroup method is called", () => {

		it("Then it should return the notifications", function (done) {
			notificationStore.publishNotificationsRolesRoleGroup([]).then(function (data) {
				expect(data["Success"]).toEqual(true);
			})
				.finally(done);
			$timeout.flush();
		});
		it("Then it should reject with error, if publishNotificationsRolesRoleGroup of notificationService thrown error", function (done) {
			var error;
			notificationService.publishNotificationsRolesRoleGroup = jasmine.createSpy("publishNotificationsRolesRoleGroup").and.callFake(function (a, b) {
				var defer = $q.defer();
				error = {
					messege: "Error in NotificationService"
				};
				defer.reject(error);
				return defer.promise;
			});
			notificationStore.publishNotificationsRolesRoleGroup([]).then(function (data) {
			}, function (ex) {
				expect(ex.messege).toEqual(error.messege);
			})
				.finally(done);
			$timeout.flush();
		});
	});
});