import express from "express";
import fs from "fs/promises";
import { getArticles, articlesFile, idGen } from "../utils/fileHandler.ts";
const admin = express.Router();

admin.get("/", (req, res) => {
  return res.status(200).json(getArticles());
});

// add new article
admin.post("/add", async (req, res) => {
  const { title, content } = req.query;
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
    res.json({
      message: "New article added successfully",
      "new article": newArticle,
    });
  } catch (error) {
    console.log(error);
  }
});

// update article with ID
admin.put("/update/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, content } = req.query;
  let isExist = false;
  try {
    let artsList = await getArticles();
    artsList.forEach((ele) => {
      if (id === ele.id) {
        ele.title = title || ele.title;
        ele.content = content || ele.content;
        ele.date = new Date();
        isExist = true;
      }
    });
    if (isExist === false) {
      return res.status(404).send(`article with ID (${id}) not found`);
    }
    fs.writeFile(articlesFile, JSON.stringify(artsList, null, 2));
  } catch (error) {
    console.error(error);
  }
  // res.send(newArt);
});

// delete article with ID
admin.delete("/delete/:id", async (req, res) => {
    try {
        const id = Number(req.params.id)
        let isExist = false;
        let artsList = await getArticles()
        artsList.forEach((ele, i:number) => {
            if (id === ele.id) {
                artsList.splice(i, 1)
                isExist = true;
            }
        });
        if (!isExist) {
            return res.status(404).send(`Article with ID (${id}) not found`);
        }
        await fs.writeFile(articlesFile, JSON.stringify(artsList, null, 2))
    } catch (error) {
        console.error(error)
    }

})

export default admin;
