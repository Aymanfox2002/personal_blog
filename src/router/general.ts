import express from "express";
import { getArticles, getUsers, usersFile } from "../utils/fileHandler.ts";
import fs from "fs/promises";
import bcrypt from "bcrypt";

const public_users = express.Router();

// register new user
public_users.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).send("each username and password are required!");
  }

  try {
    let usersList = await getUsers();
    let isExist = usersList.some((user: any) => user.username === username);
    if (isExist) {
      return res.send(`User with name ${username} already exist`);
    }

    // .hash() method is used to hash the password before storing it in the users.json file. The second argument (10) is the salt rounds, which determines the complexity of the hashing algorithm. A higher number means more security but also more processing time.
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUsersList = [...usersList, { username, hashedPassword }];
    await fs.writeFile(usersFile, JSON.stringify(newUsersList, null, 2));
    return res.redirect("/home/login");
  } catch (error) {
    console.log(error);
  }
});

// Register page layout
public_users.get("/register", (req, res) => {
  res.render("register");
});

// login user
public_users.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const usersList = await getUsers();
  // validate input
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required!",
    });
  }
  // validate credentials
  let user = usersList.find((user: any) => user.username === username);
  if (!user) {
    return res.status(400).json({
      message: "User not found!",
    });
  }
  try {
    /**
     * The .compare() method is used to compare the provided password with the hashed password. we use await here because bcrypt.compare() is an asynchronous operation that returns a promise, and we want to wait for the result before proceeding.
     */
    if (await bcrypt.compare(password, user.hashedPassword)) {
      req.session.userName = username;
      res.redirect("/home/admin");
    } else {
      return res.status(400).json({
        message: "Invalid password!",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// login page layout
public_users.get("/login", (req, res) => {
  res.render("login");
});

// home page layout
public_users.get("/", async (req, res) => {
  const articles = await getArticles();
  res.render("index", { articles }); // Express looks in /views and finds users.ejs
});

// get article with ID ❗❗
public_users.get("/articles/:id", async (req, res) => {
  const id = Number(req.params.id);
  const articlesList = await getArticles();
  const article = articlesList.find((ele: any) => ele.id === id);

  if (article) {
    return res.render("article", { article });
  }
  return res.status(404).send(`Article with ID "${id}" not found`);
});

export default public_users;
