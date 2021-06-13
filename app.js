/** CLI app using Node.js
 * 
 * User can type in a query and view a list of 5 books matching that query.
 * 
 * Each item in the list includes id, author, title, and publishing company.
 * 
 * A user is able to save a book to a “Reading List”
 * 
 * View a “Reading List” with all the books the user has selected. */

const readline = require("readline");
const axios = require("axios");
const fs = require("fs");
const process = require("process");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const BASE_URL = "https://www.googleapis.com/books/v1/";

/** read reading-list.txt and print it out. */

const readingList = (path) => {
	fs.readFile(path, "utf8", (err, data) => {
		if (err) {
			console.error(`Error reading ${path}: ${err}`);
			process.exit(1);
		} else {
			console.log(data);
		}
	});
};
