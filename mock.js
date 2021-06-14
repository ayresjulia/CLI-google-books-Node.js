const mock = require("mock-fs");

/** mocking the fs.readFile function */

mock({
	files: {
		"mock.txt": "some mock test file"
	}
});
