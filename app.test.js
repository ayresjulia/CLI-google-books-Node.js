const { readingList } = require("./app");
const sinon = require("sinon");
const fs = require("fs");

let readFile;

beforeEach(() => {
	readFile = sinon.stub(fs, "readFile").returns({});
});
afterEach(() => {
	readFile.restore();
});

describe("app.js readFile test with mock file", () => {
	it("should return a simple string", () => {
		readingList("files/mock.txt");
		expect(readFile.calledOnceWith("files/mock.txt", "utf8")).toBeTruthy();
	});
});
