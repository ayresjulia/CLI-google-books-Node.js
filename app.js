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

/** readline interface setup for reading input stream in console */

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

/** Google Books Api base url */

const BASE_URL = "https://www.googleapis.com/books/v1/";

/** user text throughout the app */

const q1 = "HELLO!! TYPE A SEARCH TERM FOR A BOOK: ";
const q2 = "\nTO ADD TO YOUR READING LIST, ENTER BOOK ID: ";
const q3 = "\nRETRIEVE YOUR READING LIST? y/n : ";
const readList = "reading-list.txt";
const bookNameError = "***OOPS. NO BOOKS AVAILABLE WITH THAT NAME.***";
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

/** retrieve reading list question and closing message. */

const getReadingList = () => {
	rl.question(q3, async (answer) => {
		if (answer === "y") {
			readingList(readList);
			setTimeout(() => {
				rl.close();
			}, 2000);
		} else {
			rl.close();
		}
	});
};

/** fetching data from Google Books Api w error handling */

const fetchData = async (query) => {
	try {
		let res = await axios.get(`${BASE_URL}volumes?&q=${query}`);
		if (res.data.totalItems === 0) {
			console.error(bookNameError);
			rl.close();
		}
		return res;
	} catch (err) {
		console.log(err);
	}
};

/** questions for the user */

rl.question(q1, async (term) => {
	term.replace(/ /g, "+"); // for multi-word query string
	let books = await fetchData(term);

	if (books) {
		let booksNum = res.data.items.slice(0, 5);
		let filteredBookInfo = booksNum.map(({ id, volumeInfo }) => {
			// safety in case info is missing from api
			let author = volumeInfo["authors"] === undefined ? "N/A" : volumeInfo["authors"][0];
			let title = volumeInfo["title"] || "N/A";
			let publisher = volumeInfo["publisher"] || "N/A";
			console.log(
				`ID: ${id}, Author: ${author}, Title: ${title}, Publishing company: ${publisher}`
			);
			return `ID: ${id}, Author: ${author}, Title: ${title}, Publishing company: ${publisher}`;
		});

		rl.question(q2, (id) => {
			// find target book by id and get a string of required values to save to Reading List
			let bookStr = `ID: ${id},`;
			let targetBookInfo = filteredBookInfo.find((book) => book.includes(bookStr));

			if (targetBookInfo) {
				handleOutput(targetBookInfo, readList);
				console.log(`Book with ID: ${id} was successfully saved`);
			} else {
				console.error(idError);
			}
			getReadingList();
		});
	}
});

/** closing readline stream and exiting the app */

rl.on("close", () => {
	console.log(finalMsg);
	process.exit(0);
});

module.exports = { readingList, fetchData };
