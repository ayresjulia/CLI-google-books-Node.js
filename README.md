# CLI Google Books API App

## :bulb: Description

Command Line Application made in Node.js which allows user  to create Book Reading List

## :book: Features

- user can type in a query and view a list of 5 books matching that query

- each book in the list includes id, author, title, and publishing company
  
- user is able to save a book to a local “Reading List”
  
- view a “Reading List” with all the books the user has selected

## :pencil: Installation

- clone repository using command line

```terminal
$git clone https://github.com/ayresjulia/CLI-google-books-Node.js.git
```

- install all requirements

```terminal
$npm install
```

- run the app

```terminal
$node app.js
```

- run tests

```terminal
$npm test
```

## :key: API used

[Google Books API](https://www.googleapis.com/books)

## :computer: Tech Stack

- Platform: Node.js
  
- Libraries/modules: Axios | Readline | fs | process | sinon

- Testing: Jest - unittest

## :battery: Work Process - strengths

- Node.js is a very-well documented platform and makes writing the application a breeze!
  
- File system and Readline are both amazing modules that allow minimal code for what seem to be complex actions.
  
- Documentation is very important in any code, and I have added descriptions to every function in the code.

- Mock tests with Jest are super helpful here, they have helped me to mock file system in order to test reading the file.
  
## :microscope: Work Process - opportunities

- The app could definitely benefit from more testing. Testing was the hardest part as some code is nested while working with readline.

- Working in readline was my first, and I have learned a lot! I am planning to research a proper way to test readline code in the future.

- The app has only few features for the user, and can definitely be expanded more.
  