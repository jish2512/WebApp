import { GlobalExceptionHandler } from "../js/telemetry/GlobalExceptionHandler";

function showSystemDownOverlay() {
	console.log("");
}
describe("Given Global Exception Logger Test Suite", () => {
	var worker = null;
	var fxpworkeractions;
	beforeEach(function () {
		window["FxpBaseConfiguration"] = {
			"Telemetry": {
				"InstrumentationKey": "bdaceesd2d-2b6asd-41b6-8454-f0e155db2721"
			}
		};
		window["FxpAppSettings"] = {
			"EnvironmentName": "Dev",
			"ApplicationName": "Fxp",
			"EnableHttps": false,
			"ServiceOffering": "Enterprise Services Experience",
			"FXPPageTitle": "Enterprise Services Experience",
			"ServiceLine": "Field Experience",
			"Program": "Field Experience Foundation",
			"Capability": "Fxp",
			"LoggedByApplication": "Enterprise Service Experience Platform",
			"ComponentName": "Fxp Services",
			"ApplicationTitle": "Services Field Experience"
		};
		spyOn(console, "log").and.callThrough();
		spyOn(console, "error").and.callThrough();
	});
	describe("When logEvent is called", () => {
		beforeEach(function () {
			GlobalExceptionHandler.logEvent({ TestError: "Error" },"Fxp.Test", false);
		});
		it("Then it should log in console", () => {
			expect(console.log).toHaveBeenCalledWith("Logged Global Event");
		});
	});
	describe("When logError is called", () => {
		beforeEach(function () {
			var error = new Error();
			error.message = 'FxP App Boot Failure';
			GlobalExceptionHandler.logError(error, { TestError: "Error" }, "Fxp.Test");
		});
		it("Then it should log in console", () => {
			expect(console.log).toHaveBeenCalledWith("Logged Exception");
		});
	});
	describe("When logFxpBootFailure is called", () => {
		beforeEach(function () {
			var error = new Error();
			error.message = 'FxP App Boot Failure';
			GlobalExceptionHandler.logFxpBootFailure({ TestError: "Error" },"Fxp.Test", false,"System Down","Test",'');
		});
		it("Then it should log in console", () => {
			expect(console.log).toHaveBeenCalledWith("Logged Global Event");
		});
	});
});