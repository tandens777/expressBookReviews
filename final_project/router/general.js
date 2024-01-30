const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (username && password){
    if (!isValid(username)) {
      users.push({"username":username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  await res.send(JSON.stringify({books},null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  //res.send(JSON.stringify({books[isbn]},null, 4));
  await res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const author = req.params.author;
  let filtered_books = [];
  Object.values(books).forEach((value, index, array)=>{
    if (value.author === author) {
        filtered_books = [...filtered_books, value];
    }
  })
  await res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const title = req.params.title;
  let filtered_books = [];
  Object.values(books).forEach((value, index, array)=>{
    if (value.title === title) {
        filtered_books.push(value);
    }
  })
  await res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  let reviews = books[isbn].reviews;
  res.send(reviews);
});

module.exports.general = public_users;
