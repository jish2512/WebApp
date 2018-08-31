import{TelemetryData} from '../js/telemetry/TelemetryData';
import { FxpLogHelper } from "../js/telemetry/FxpLogHelper";

describe("Given TelemetryData UT Suite", () => {    
    var objTelemetryData, propertyBag, metricBag;  
    beforeEach(() => {
        objTelemetryData = new TelemetryData();       
        propertyBag = jasmine.createSpyObj("propertybag", ["addToBag", "getItems"]);
        metricBag = jasmine.createSpyObj("metricBag", ["addToBag", "getItems"]);               
        FxpLogHelper.getTimeStamp = jasmine.createSpy("getTimeStamp").and.callFake(function () {
            return new Date().toDateString();
        });
        FxpLogHelper.getTelemetryUniqueKey = jasmine.createSpy("getTelemetryUniqueKey").and.callFake(function () {
            return "as13sdf";
        });        
    });
    describe("When calling toJsonString method and log type is ERROR", () => {
        var teldata, res1;
        beforeEach(function () {
            objTelemetryData.logType = "Error";
            objTelemetryData.transactionID = "1";
            objTelemetryData.errorMsg = "Not Working";
            objTelemetryData.errorCode = "1111";
            objTelemetryData.propertyBag = propertyBag;
            objTelemetryData.metricBag = metricBag;
            objTelemetryData.propertyBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                var data = { val1: "property", val2: "data" };
                return data;
            });
            objTelemetryData.propertyBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                var data = { val1: "metric", val2: "data" };
                return data;
            });
            teldata = objTelemetryData.toJsonString();
            res1 = JSON.parse(teldata);
        });
        it("Then it should return Telemetrydata", () => {
            expect(teldata).not.toBeNull();            
            expect(res1.TelemetryInfo.ErrorMsg).toEqual("Not Working");
            expect(res1.TelemetryInfo.ErrorCode).toEqual("1111");
        });
    });
    describe("When calling toJsonString method and log type is WARNING", () => {
        var teldata, res1;
        beforeEach(function () {
            objTelemetryData.logType = "Warning";
            objTelemetryData.transactionID = "1";
            objTelemetryData.warnMsg = "Please check if data is right";
            objTelemetryData.propertyBag = propertyBag;
            objTelemetryData.metricBag = metricBag;
            objTelemetryData.propertyBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                var data = { val1: "property", val2: "data" };
                return data;
            });
            objTelemetryData.propertyBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                var data = { val1: "metric", val2: "data" };
                return data;
            });

            teldata = objTelemetryData.toJsonString();
            res1 = JSON.parse(teldata);
        });
        it("Then it should return Telemetrydata", () => {
            expect(teldata).not.toBeNull();           
            expect(res1.TelemetryInfo.WarnMsg).toEqual("Please check if data is right");
        });
    });
    describe("When calling toJsonString method and log type is TRACE", () => {
        var teldata, res1;
        beforeEach(function () {
            objTelemetryData.logType = "Trace";
            objTelemetryData.transactionID = "1";
            objTelemetryData.traceMsg = "message traced";
            objTelemetryData.propertyBag = propertyBag;
            objTelemetryData.metricBag = metricBag;
            objTelemetryData.propertyBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                var data = { val1: "property", val2: "data" };
                return data;
            });
            objTelemetryData.propertyBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                var data = { val1: "metric", val2: "data" };
                return data;
            });
            teldata = objTelemetryData.toJsonString();
            res1 = JSON.parse(teldata);
        });
        it("Then it should return Telemetrydata", () => {
            expect(teldata).not.toBeNull();            
            expect(res1.TelemetryInfo.TraceMsg).toEqual("message traced");
        });
    });
    describe("When calling toJsonString method and log type is INFORMATION", () => {
        var teldata, res1;
        beforeEach(function () {
            objTelemetryData.logType = "Information";
            objTelemetryData.transactionID = "1";
            objTelemetryData.infoMsg = "I am Telemetry data";
            objTelemetryData.propertyBag = propertyBag;
            objTelemetryData.metricBag = metricBag;
            objTelemetryData.propertyBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                var data = { val1: "property", val2: "data" };
                return data;
            });
            objTelemetryData.propertyBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                var data = { val1: "metric", val2: "data" };
                return data;
            });
            teldata = objTelemetryData.toJsonString();
            res1 = JSON.parse(teldata);
        });
        it("Then it should return Telemetrydata", () => { 
            expect(teldata).not.toBeNull();           
            expect(res1.TelemetryInfo.InfoMsg).toEqual("I am Telemetry data");
        });
    });
    describe("When calling toJsonString method and log type is CUSTOMEVENT", () => {
        var teldata, res1;
        beforeEach(function () {
            objTelemetryData.logType = "CustomEvent";
            objTelemetryData.transactionID = "1";
            objTelemetryData.eventName = "FXP TELEMETRY";
            objTelemetryData.propertyBag = propertyBag;
            objTelemetryData.metricBag = metricBag;
            objTelemetryData.propertyBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                var data = { val1: "property", val2: "data" };
                return data;
            });
            objTelemetryData.propertyBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                var data = { val1: "metric", val2: "data" };
                return data;
            });
            teldata = objTelemetryData.toJsonString();
            res1 = JSON.parse(teldata);
        });
        it("Then it should return Telemetrydata", () => {
            expect(teldata).not.toBeNull();            
            expect(res1.TelemetryInfo.EventName).toEqual("FXP TELEMETRY");
        });
    });
    describe("When calling toJsonString method and log type is Metric", () => {
        var teldata, res1;
        beforeEach(function () {
            objTelemetryData.logType = "Metric";
            objTelemetryData.transactionID = "1";
            objTelemetryData.metricName = "FxpMetric";
            objTelemetryData.metricValue = "007";
            objTelemetryData.propertyBag = propertyBag;
            objTelemetryData.metricBag = metricBag;
            objTelemetryData.propertyBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                var data = { val1: "property", val2: "data" };
                return data;
            });
            objTelemetryData.propertyBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                var data = { val1: "metric", val2: "data" };
                return data;
            });
            teldata = objTelemetryData.toJsonString();
            res1 = JSON.parse(teldata);        });
        it("Then it should return Telemetrydata", () => {           
            expect(teldata).not.toBeNull();
            expect(res1.TelemetryInfo.MetricName).toEqual("FxpMetric");
            expect(res1.TelemetryInfo.MetricValue).toEqual("007");         
        });
    });
    describe("When calling toJsonString method and log type is MetricBag", () => {
        var teldata, res1;
        beforeEach(function () {
            objTelemetryData.logType = "MetricBag";
            objTelemetryData.transactionID = "1";
            objTelemetryData.metricName = "FxpMetric";
            objTelemetryData.metricValue = "007";
            objTelemetryData.propertyBag = propertyBag;
            objTelemetryData.metricBag = metricBag;
            objTelemetryData.propertyBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                var data = { val1: "property", val2: "data" };
                return data;
            });
            objTelemetryData.propertyBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                var data = { val1: "metric", val2: "data" };
                return data;
            });
            teldata = objTelemetryData.toJsonString();          
            res1 = JSON.parse(teldata);
        });
        it("Then it should return Telemetrydata", () => {
            expect(teldata).not.toBeNull();
            expect(res1.TelemetryInfo.MetricName).toEqual(undefined);
            expect(res1.TelemetryInfo.MetricValue).toEqual(undefined);
        });
    });

    describe("When calling toJsonString method and metricBag's getItems is null", () => {
        var teldata, res1;
        beforeEach(function () {
            objTelemetryData.logType = "Metric";
            objTelemetryData.transactionID = "1";
            objTelemetryData.metricName = "FxpMetric";
            objTelemetryData.metricValue = "007";
            objTelemetryData.propertyBag = propertyBag;
            objTelemetryData.metricBag = metricBag;
            objTelemetryData.propertyBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                var data = { val1: "property", val2: "data" };
                return data;
            });
            objTelemetryData.metricBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                return null;
            });
            teldata = objTelemetryData.toJsonString();
            res1 = JSON.parse(teldata);
        });
        it("Then it should not return Metrics of Telemetrydata as defined", () => {
            expect(teldata).not.toBeNull();
            expect(res1.TelemetryInfo.Metrics).toEqual(null);          
        });
    });
    describe("When calling toJsonString method and propertyBag's getItems is null", () => {
        var teldata, res1;
        beforeEach(function () {
            objTelemetryData.logType = "Metric";
            objTelemetryData.transactionID = "1";
            objTelemetryData.metricName = "FxpMetric";
            objTelemetryData.metricValue = "007";
            objTelemetryData.propertyBag = propertyBag;
            objTelemetryData.metricBag = metricBag;
            objTelemetryData.propertyBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                return null;
            });
            teldata = objTelemetryData.toJsonString();
            res1 = JSON.parse(teldata);
        });
        it("Then it should not return Metrics of Telemetrydata as defined", () => {
            expect(teldata).not.toBeNull();
            expect(res1.TelemetryInfo.Properties).toEqual(null);
        });
    });
  
    describe("When calling toJsonString method and metricBag's getItems is undefined", () => {
        var teldata, res1;
        beforeEach(function () {
            objTelemetryData.logType = "Metric";
            objTelemetryData.transactionID = "1";
            objTelemetryData.metricName = "FxpMetric";
            objTelemetryData.metricValue = "007";
            objTelemetryData.propertyBag = propertyBag;
            objTelemetryData.metricBag = undefined;                                         
            teldata = objTelemetryData.toJsonString();           
            res1 = JSON.parse(teldata);
        });
        it("Then it should not return Metrics of Telemetrydata as undefined", () => {                       
            expect(teldata).not.toBeNull();
            expect(res1.TelemetryInfo.Properties).toEqual(undefined);
        });
    });
    describe("When calling toJsonString method and propertyBag's getItems is undefined", () => {
        var teldata, res1;
        beforeEach(function () {
            objTelemetryData.logType = "Metric";
            objTelemetryData.transactionID = "1";
            objTelemetryData.metricName = "FxpMetric";
            objTelemetryData.metricValue = "007";
            objTelemetryData.propertyBag = propertyBag;
            objTelemetryData.metricBag = metricBag;
            objTelemetryData.propertyBag.getItems = jasmine.createSpy("getItems").and.callFake(function () {
                return undefined;
            });
            teldata = objTelemetryData.toJsonString();
            res1 = JSON.parse(teldata);
        });
        it("Then it should not return properties of Telemetrydata as undefined", () => {
            expect(teldata).not.toBeNull();
            expect(res1.TelemetryInfo.Properties).toBeUndefined();
        });
    });
   
    describe("When calling toJsonString method and objTelemetryData is undefined", () => {        
        beforeEach(function () {
            objTelemetryData = undefined;           
        });      
        it("Then it should throw exception", () => {
            try {               
                var teldata = objTelemetryData.toJsonString(); 
            }
            catch (e) {                           
                expect(teldata).toBeUndefined();
            }
        });
    });
});