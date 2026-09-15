import express from "express";
import genl_routes from "./router/general.ts";
import admin_routes from "./router/admin.ts";
import session from "express-session";
import { requireAuth } from "./middleware/auth.ts";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  }),
);

declare module "express-session" {
  interface SessionData {
    userName: string;
  }
}

// protected routes
app.use("/home/admin", requireAuth);

app.use("/home", genl_routes);
app.use("/home/admin", admin_routes);

// 1- Set the directory for your static files
const __dirname = import.meta.dirname;

// Set the directory for your views
app.set("views", path.join(__dirname, "views"));

// Set the view engine to ejs
app.set("view engine", "ejs");

const PORT = 5000;

app.listen(PORT, () => {
  console.log(__dirname); 
  console.log("Server is running on http://localhost:" + PORT);
});
