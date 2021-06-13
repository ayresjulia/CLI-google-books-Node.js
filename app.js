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

const q1 = "HELLO!! TYPE A SEARCH TERM FOR A BOOK: ";
const q2 = "\nTO ADD TO YOUR READING LIST, ENTER BOOK ID: ";
const readList = "reading-list.txt";
const idError = "***OOPS. BOOK ID IS INVALID.***";
const finalMsg = "\nBYE BYE!!!";

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

/** handle output: write to file if out given. */

const handleOutput = (text, out) => {
	if (out) {
		fs.writeFile(readList, `\n${text}`, { encoding: "utf8", flag: "a" }, (err) => {
			if (err) {
				console.log(err);
				process.exit(1);
			}
		});
	} else {
		console.log(text);
	}
};

/** questions for the user */

rl.question(q1, async (term) => {
	axios
		.get(`${BASE_URL}volumes?&q=${term}`)
		.then((res) => {
			let books = res.data.items.slice(0, 5);
			let filteredBookInfo = books.map(({ id, volumeInfo }) => {
				let author = volumeInfo["authors"] === undefined ? "N/A" : volumeInfo["authors"][0];
				let title = volumeInfo["title"] || "N/A";
				let publisher = volumeInfo["publisher"] || "N/A";
				console.log(
					`ID: ${id}, Author: ${author}, Title: ${title}, Publishing company: ${publisher}`
				);
				return `ID: ${id}, Author: ${author}, Title: ${title}, Publishing company: ${publisher}`;
			});

			return filteredBookInfo;
		})
		.then((books) => {
			rl.question(q2, (id) => {
				let targetBookInfo = books.find((book) => book.includes(bookStr));

				if (targetBookInfo) {
					handleOutput(targetBookInfo, readList);
					console.log(`Book with ID: ${id} was successfully saved`);
				} else {
					console.error(idError);
				}
			});
		})
		.catch((err) => console.log("rejected!", err));
});

rl.on("close", () => {
	console.log(finalMsg);
	process.exit(0);
});
