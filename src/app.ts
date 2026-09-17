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
    // secret should be a long, random string in a real application, it means that the session data will be signed with this secret to prevent tampering
    secret: "fingerprint_customer",
    // resave means that the session will be saved back to the session store, even if it was never modified during the request. This can be useful for implementing "rolling sessions", where the session expiration is reset on each request. However, it can also lead to unnecessary writes to the session store if the session data hasn't changed, so it should be used with caution.
    resave: true,
    // saveUninitialized simply means that a session will be stored in the session store even if it is new and has not been modified. This can be useful for implementing "login sessions", where a session is created for a user as soon as they visit the site, even if they haven't logged in yet. However, it can also lead to unnecessary storage of empty sessions, so it should be used with caution.
    saveUninitialized: true,
  }),
);

// Extend the SessionData interface to include userName, without this, TypeScript will throw an error when you try to access req.session.userName
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
  // console.log(__dirname); 
  console.log("Server is running on http://localhost:" + PORT);
});
