/// <reference path="../typings/jasmine.d.ts" />

import { TestAngular } from './sampleTest';

function test(a, b) {
	return a + b;
}

describe("A suite is just a function", function () {
	it("and so is a spec", function () {
		expect(test(20, 38)).toEqual(58);
	});
	it("and string", function () {
		expect('Jishnu').toEqual('Jishnu');
	});
	it("test", function () {
		var b = TestAngular.Add(21, 69);
		expect(b).toEqual(90);
	});
});