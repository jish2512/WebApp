import {FxpMessageService} from '../js/services/FxpMessageService';
declare var angular:any;
describe('Given FxpMessageService UT Suite', function () {
    var interval, rootScope, fxpConfiguration, fxpMessageService, $intervalSpy, $serviceIntervalSpy, fxpLogger;  
    var msgObj = {
        message: "Your profile is not mapped to a Dashboard. Please contact IT support",
        messageType: "",
        msgDate: new Date()
    };  
    
    beforeEach(function () {
        angular.mock.module('FxPApp');
        angular.mock.module(function ($provide) {            
            $provide.service("FxpConfigurationService", function () {
                var configData = {
                    "FxpMessageTimeout": "2000",
                    "FxpConfigurationStrings": {
                        "AdalAuthExcludeExtn": "\\.(html?|js|css|gif|jpe?g|png|bmp)",
                        "UIStrings": {
                            "MessageToasterTrackId": "Tracking ID: "
                        }
                    }
                };
                var propBag = function () {
                    return {
                        addToBag: function (a, b) {
                            console.log('propbag =>' + a + ':' + b);
                        }
                    };
                }
                $provide.service("FxpLoggerService", function () {
                    this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function (a, b) {
                        console.log(a + ' - ' + b);
                        return propBag();
                    });               
                    this.logEvent = jasmine.createSpy("logEvent ").and.callFake(function (a, b, c) {
                        console.log('logEvent  : ' + a + ',' + b + ',' + c);
                    });
                });
                this.FxpAppSettings = configData;
                this.FxpBaseConfiguration = configData;
                
            });
            
        });
        
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$interval_, FxpConfigurationService, FxpLoggerService, FxpMessageService) {       
        rootScope = _$rootScope_;
        interval = _$interval_;
        fxpConfiguration = FxpConfigurationService;
        fxpMessageService = FxpMessageService;
        $intervalSpy = jasmine.createSpy('$interval', _$interval_).and.callThrough();
        $serviceIntervalSpy = jasmine.createSpy('$interval', FxpMessageService.$interval).and.callThrough();
        fxpLogger = FxpLoggerService;
    }));

    describe("When calling addMessage method and pass message and messagetype as error into addmessage", function () {
        beforeEach(function () {
            msgObj.messageType = "error"
            fxpMessageService.addMessage(msgObj.message, msgObj.messageType);        });
        it('Then it should show message', function () { 
            expect(fxpMessageService.$rootScope.messageClass).toEqual("modal-show");           
        });
    });
    describe("When calling addMessage method with message, messagetype as error and tracking id", function () {
        var messageObj = {
            msgDate: null,
            MessageType: "error",
            Message: msgObj.message,
            show: true,
            doNotAutoClose: false, trackId: "ce5977a8-840a-40c7-a878-2bb9b95e09e8"
        };
        var trackid ="ce5977a8-840a-40c7-a878-2bb9b95e09e8"
        beforeEach(function () {
            messageObj.msgDate = new Date();
            fxpMessageService.addMessage(msgObj.message, "error", null, trackid);
        });
        it('Then it should show message', function () {
            expect(fxpMessageService.$rootScope.messages[0].trackId).toEqual("Tracking ID: ce5977a8-840a-40c7-a878-2bb9b95e09e8");
            expect(fxpMessageService.$rootScope.messageClass).toEqual("modal-show");
        });
    });
    describe("When calling addMessage method and pass empty message and messagetype are into addmessage", function () {
        var messageObj = {
            msgDate: null,
            MessageType: "info",
            Message: "",
            show: true,
            doNotAutoClose: false, trackId: '', uniqueTransactionId: '' 
        };
        var value;
        beforeEach(function () {
            messageObj.msgDate = new Date();                 
            fxpMessageService.addMessage(messageObj.Message, "");
        });        
        it('Then should it show blank message', function () {           
            expect(fxpMessageService.$rootScope.messages[0]).toEqual(messageObj);
            expect(fxpMessageService.$rootScope.messageClass).toEqual("modal-show");
        });
    });
    describe("When calling addMessage method with 2 same message, messagetype as error and tracking id", function () {
        var messageObj = {
            msgDate: null,
            MessageType: "error",
            Message: msgObj.message,
            show: true,
            doNotAutoClose: false, trackId: "ce5977a8-840a-40c7-a878-2bb9b95e09e8"
        };
        var trackid = "ce5977a8-840a-40c7-a878-2bb9b95e09e8";
        beforeEach(function () {
            messageObj.msgDate = new Date();
            fxpMessageService.addMessage(msgObj.message, "error", null, trackid);
            fxpMessageService.addMessage(msgObj.message, "error", null, trackid);
        });
        it('Then it should show only 1 message', function () {
            expect(fxpMessageService.$rootScope.messages.length).toEqual(1);
            expect(fxpMessageService.$rootScope.messageClass).toEqual("modal-show");
        });
    });
    describe("When calling addMessage method and pass message,messagetype as warning ", function () {
        beforeEach(function () {
            msgObj.messageType = "warning";
            spyOn(fxpMessageService, 'addMessage').and.callThrough();
            fxpMessageService.addMessage(msgObj.message, msgObj.messageType);
            var date = fxpMessageService.$rootScope.messages[0].msgDate;
            fxpMessageService.$rootScope.messages[0].msgDate = new Date(date - 6000);
            $serviceIntervalSpy.flush(6000);
        });
        it('Then it should hide warning message automatically', function () {
            expect(fxpMessageService.$rootScope.messageClass).toEqual("modal-hide");
        });
    });
    describe("When calling addMessage method and pass message,messagetype as warning and doNotClose as true ", function () {
        beforeEach(function () {
            msgObj.messageType = "warning";
            spyOn(fxpMessageService, 'addMessage').and.callThrough();
            fxpMessageService.addMessage(msgObj.message, msgObj.messageType,true);
            var date = fxpMessageService.$rootScope.messages[0].msgDate;
            fxpMessageService.$rootScope.messages[0].msgDate = new Date(date - 6000);
            $serviceIntervalSpy.flush(6000);
        });
        it('Then it should show warning message and not close it', function () {
            expect(fxpMessageService.$rootScope.messageClass).toEqual("modal-show");
        });
    });
    describe("When calling addMessage method and pass message, messagetype as success", function () {
        beforeEach(function () {
            msgObj.messageType = "success";
            spyOn(fxpMessageService, 'addMessage').and.callThrough();
            fxpMessageService.addMessage(msgObj.message, msgObj.messageType);
            var date = fxpMessageService.$rootScope.messages[0].msgDate;
            fxpMessageService.$rootScope.messages[0].msgDate = new Date(date - 6000);
            $serviceIntervalSpy.flush(6000);
        });        
        it('Then it should hide success message automatically', function () {
            expect(fxpMessageService.$rootScope.messageClass).toEqual("modal-hide");
        }); 
    });
    describe("When calling addMessage method and pass message, messagetype as information", function () {
        beforeEach(function () {
            msgObj.messageType = "info";
            spyOn(fxpMessageService, 'addMessage').and.callThrough();
            fxpMessageService.addMessage(msgObj.message, msgObj.messageType);
            var date = fxpMessageService.$rootScope.messages[0].msgDate;
            fxpMessageService.$rootScope.messages[0].msgDate = new Date(date - 6000);
            $serviceIntervalSpy.flush(6000);
        });
        it('Then it should hide information message automatically', function () { 
            expect(fxpMessageService.$rootScope.messageClass).toEqual("modal-hide");
        }); 
    });
    describe("When calling addMessage method and pass message, messagetype as information and doNotClose as true", function () {
        beforeEach(function () {
            msgObj.messageType = "info";
            spyOn(fxpMessageService, 'addMessage').and.callThrough();
            fxpMessageService.addMessage(msgObj.message, msgObj.messageType,true);
            var date = fxpMessageService.$rootScope.messages[0].msgDate;
            fxpMessageService.$rootScope.messages[0].msgDate = new Date(date - 6000);
            $serviceIntervalSpy.flush(6000);
        });
        it('Then it should show information message and not close it', function () {
            expect(fxpMessageService.$rootScope.messageClass).toEqual("modal-show");
        });
    });
    describe("When calling closeMessage method", function () {
        beforeEach(function () {
            msgObj.messageType = "error";
            fxpMessageService.$rootScope.messages.push(msgObj);
            expect(fxpMessageService.$rootScope.messages.length).toEqual(1);
            fxpMessageService.closeMessage(msgObj);
            $serviceIntervalSpy.flush(6000);
        });
        it('Then it should close message', function () {
            expect(fxpMessageService.$rootScope.messageClass).toEqual("modal-hide"); 
        });
    });
    describe("When calling addMessage method and pass message and messagetype as error into addmessage", function () {
        beforeEach(function () {
            msgObj.messageType = "error"
            fxpMessageService.addMessage(msgObj.message, msgObj.messageType);
        });
        it('Then it should log a custom event', function () {
            expect(fxpLogger.logEvent).toHaveBeenCalled();
        });
    });
});
 