import express from "express";
import articlesList from "../../data/articles.json" with { type: "json" };
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
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUsersList = [...usersList, { username, hashedPassword }];
    await fs.writeFile(usersFile, JSON.stringify(newUsersList, null, 2));
    return res.send("New user added successfully!");
  } catch (error) {
    console.log(error);
  }
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
    if (await bcrypt.compare(password, user.hashedPassword)) {
      req.session.userName = username;
      return res.status(200).json({
        message: "Login successful",
      });
    } else {
      return res.status(400).json({
        message: "Invalid password!",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// get all articles
public_users.get("/", async (req, res) => {
  const data = await getArticles();
  return res.send(data);
});

// get article with ID ❗❗
public_users.get("/articles/:id", (req, res) => {
  const id = Number(req.params["id"]);
  articlesList.forEach((ele) => {
    console.log(ele.id, id);
    if (ele.id === id) {
      console.log(ele);
      return res.send(ele);
    }
  });
  return res.status(404).send(`Article with ID "${id}" not found`);
});

export default public_users;
