import express from "express";
import fs from "fs/promises";
import {
  getArticles,
  articlesFile,
  idGen,
  getUsers,
} from "../utils/fileHandler.ts";
import session from "express-session";
const admin = express.Router();

// get all articles
admin.get("/", async (req, res) => {
  const articles = await getArticles();
  return res.render("dashboard", { articles });
});

// add new article
admin.post("/add", async (req, res) => {
  const { title, content } = req.body;
  let articlesList = await getArticles();
  const newArticle = {
    id: await idGen(),
    title: title,
    date: new Date(),
    content: content,
  };
  const newArticles = [...articlesList, newArticle];

  try {
    fs.writeFile(articlesFile, JSON.stringify(newArticles, null, 2));
    res.redirect("/home/admin");
  } catch (error) {
    console.log(error);
  }
});

admin.get("/add", (req, res) => {
  res.render("add");
});
// update article with ID
admin.post("/update/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, content } = req.body;
  let isExist = false;
  try {
    let artsList = await getArticles();
    artsList.forEach(
      (ele: { id: number; title: any; content: any; date: Date }) => {
        if (id === ele.id) {
          ele.title = title || ele.title;
          ele.content = content || ele.content;
          ele.date = new Date();
          isExist = true;
        }
      },
    );
    if (isExist === false) {
      return res.status(404).send(`article with ID (${id}) not found`);
    }
    fs.writeFile(articlesFile, JSON.stringify(artsList, null, 2));
    res.redirect("/home/admin");
  } catch (error) {
    console.error(error);
  }
});

admin.get("/update/:id", async (req, res) => {
  const id: number = Number(req.params.id);
  const articles = await getArticles();
  const article = articles.find((ele: any) => ele.id === id);
  const title = article.title;
  const content = article.content;
  res.render("edit", { idVal: req.params.id, title, content });
});

// delete article with ID
admin.post("/delete/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    let isExist = false;
    let artsList = await getArticles();
    artsList.forEach((ele: { id: number }, i: number) => {
      if (id === ele.id) {
        artsList.splice(i, 1);
        isExist = true;
      }
    });
    if (!isExist) {
      return res.status(404).send(`Article with ID (${id}) not found`);
    }
    await fs.writeFile(articlesFile, JSON.stringify(artsList, null, 2));
    res.redirect("/home/admin");
  } catch (error) {
    console.error(error);
  }
});

// logout
admin.post("/logout", (req, res) => {
  req.session.destroy;
  res.redirect("/home");
});

export default admin;
