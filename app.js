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
const userText = require("./__helpers__/userText");

/** readline interface setup for reading input stream in console */

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

/** Google Books Api base url */

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

/** handle output: write to file if out given. */

const handleOutput = (text, out) => {
	fs.readFile(userText.READ_LIST, "utf8", (err, data) => {
		if (err) console.error(`Error reading ${path}: ${err}`);
		// check for book dups
		if (!data.includes(text)) {
			fs.writeFile(out, `\n${text}`, { encoding: "utf8", flag: "a" }, (err) => {
				if (err) {
					console.log(err);
					process.exit(1);
				} else {
					console.log(userText.NEW_BOOK);
					getReadingList();
				}
			});
		} else {
			console.error(userText.BOOK_EXISTS);
			getReadingList();
		}
	});
};

/** retrieve reading list question and closing message. */

const getReadingList = () => {
	rl.question(userText.Q3, (answer) => {
		if (answer === "y") {
			readingList(userText.READ_LIST);
			setTimeout(() => {
				rl.close();
			}, 2000);
		} else {
			// restart the app
			main();
		}
	});
};

/** fetching data from Google Books Api w error handling */

const fetchData = async (query) => {
	try {
		let res = await axios.get(`${BASE_URL}volumes?&q=${query}`);
		if (res.data.totalItems === 0) {
			console.error(userText.BOOK_NAME_ERR);
			main();
		} else {
			return res;
		}
	} catch (err) {
		// filter error data for easier read
		if (err.response) {
			console.log("ERROR: ", err.response.status, err.response.statusText);
		} else {
			console.log("ERROR: ", err);
		}
	}
};

/** questions for the user */

const main = () => {
	rl.question(userText.Q1, async (term) => {
		let books = await fetchData(term);
		// custom message for empty query
		if (term === "" || term === " ") {
			console.error(userText.NO_INPUT);
			main();
		}

		term.replace(/ /g, "+"); // for multi-word query string

		// if term resp with zero books
		if (books) {
			if (books.data.totalItems !== 0) {
				let booksNum = books.data.items.slice(0, 5);
				let filteredBookInfo = booksNum.map(({ id, volumeInfo }) => {
					// safety in case info is missing from api
					let author =
						volumeInfo["authors"] === undefined ? "N/A" : volumeInfo["authors"][0];
					let title = volumeInfo["title"] || "N/A";
					let publisher = volumeInfo["publisher"] || "N/A";
					console.log(
						`ID: ${id}, Author: ${author}, Title: ${title}, Publishing company: ${publisher}`
					);
					return `ID: ${id}, Author: ${author}, Title: ${title}, Publishing company: ${publisher}`;
				});

				rl.question(userText.Q2, (id) => {
					// find target book by id and get a string of required values to save to Reading List
					let bookStr = `ID: ${id},`;
					let targetBookInfo = filteredBookInfo.find((book) => book.includes(bookStr));

					if (targetBookInfo) {
						handleOutput(targetBookInfo, userText.READ_LIST);
					} else {
						console.error(userText.ID_ERR);
						main();
					}
				});
			} else {
				console.error(userText.FINAL_MSG);
				rl.close();
			}
		}
	});
};

main();

/** closing readline stream and exiting the app */
const exitApp = () => {
	rl.on("close", async () => {
		console.log(userText.FINAL_MSG);
		await process.exit(0);
	});
};

module.exports = { readingList, fetchData };
