const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username;
  })
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}


const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password);
  })
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid login. Check username and password"});
  }
});

// Add a book review
regd_users.post("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  let username = "";
  if (req.session.authorization) {
    username = req.session.authorization['username'];
  } else {
    return res.status(403).json({message: "User not logged in"})
  }
  const new_review = req.body.review;
  const isbn = req.params.isbn;
  
  if (books[isbn]){
    let reviews = books[isbn].reviews;
    let review = reviews[username];
    
    if (review){
        review = new_review;
        return res.status(200).send(`New review succesfully updated for ${username}`);
    } else {
        reviews[username] = new_review
        return res.status(200).send(`New review succesfully added for ${username}`);
    }
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    let username = "";
    if (req.session.authorization) {
      username = req.session.authorization['username'];
    } else {
      return res.status(403).json({message: "User not logged in"})
    }
    const new_review = req.body.review;
    const isbn = req.params.isbn;
    
    if (books[isbn]){
      let reviews = books[isbn].reviews;
      let review = reviews[username];
      
      if (review){
          review = new_review;
          return res.status(200).send(`New review succesfully updated for ${username}`);
      } else {
          reviews[username] = new_review
          return res.status(200).send(`New review succesfully added for ${username}`);
      }
    }
});
  
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    let username = "";
    if (req.session.authorization) {
      username = req.session.authorization['username'];
    } else {
      return res.status(403).json({message: "User not logged in"})
    }
    const isbn = req.params.isbn;
    
    if (books[isbn]){
        let reviews = books[isbn].reviews;
        delete reviews[username];
        res.send(`Review for username ${username} deleted.`);
    }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
  