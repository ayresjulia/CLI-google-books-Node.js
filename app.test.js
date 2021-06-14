const { readingList, fetchData } = require("./app");
const sinon = require("sinon");
const fs = require("fs");
const axios = require("axios");

jest.mock("axios");

describe("app.js readFile test with mock file", () => {
	it("should return a simple string", () => {
		let readFile = sinon.stub(fs, "readFile").returns({});
		readingList("files/mock.txt");
		expect(readFile.calledOnceWith("files/mock.txt", "utf8")).toBeTruthy();
	});
});

describe("mocking axios request to Google Books Api", () => {
	it("returns data from api", async () => {
		let fetched = {
			data: [ { id: 1, book: "test" }, { id: 2, book: "test" } ]
		};
		axios.get.mockResolvedValue(fetched);
		const res = await fetchData("cooking");
		expect(res).toEqual(fetched);
	});
	it("error returning data from api", async () => {
		let fetched = {};
		axios.get.mockResolvedValue(fetched);
		const res = await fetchData("cooking");
		expect(res).not.toEqual(fetched);
	});
});
