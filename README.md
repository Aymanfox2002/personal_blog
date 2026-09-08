# personal_blog
personal blog to write and publish articles on various topics.

**Prerequisites**
- Node.js (v16+ recommended)
- npm

**Install**
Run from the project root:

```bash
npm install
```

**Run (development)**
Recommended (uses `nodemon` with `ts-node`):

```bash
npx nodemon --exec ts-node src/app.ts
```

You can also try the project's start script:

```bash
npm start
```

If `npm start` fails to run TypeScript files directly, use the `npx nodemon` command above.

**Run (direct, no watcher)**
```bash
npx ts-node src/app.ts
```

**Build & Run (production)**
This project is configured for runtime TypeScript (noEmit). To produce JS output and run with Node, update `tsconfig.json` to allow emitting (remove `"noEmit": true` or add an `outDir`), then:

```bash
# compile
npx tsc --project tsconfig.json

# run compiled output
node dist/app.js
```

**App details**
- Default port: 5000
- Main entry: src/app.ts
- Views directory: src/views (EJS templates)
- Data files: data/articles.json, data/users.json

**Notes**
- No environment variables are required by default.
- If you run into TypeScript runtime issues, ensure `ts-node` and `nodemon` are installed (they are listed in `package.json`).

If you'd like, I can add a `dev` script to `package.json` that runs `nodemon --exec ts-node src/app.ts` for convenience.

**Features & How to use**
- User registration: `POST /home/register` with JSON body `{ "username": "<name>", "password": "<pw>" }`.
- Login (creates a session cookie): `POST /home/login` with JSON body `{ "username": "<name>", "password": "<pw>" }`.
- Browse in a browser: open `http://localhost:5000/home` to view the public article list.
- View a single article (JSON): `GET /home/articles/:id`.
- Admin (protected) routes (require login/session cookie): mounted under `/home/admin`:
	- `GET /home/admin/users` — list all users.
	- `POST /home/admin/add?title=...&content=...` — add a new article (uses query parameters).
	- `PUT /home/admin/update/:id?title=...&content=...` — update an article's title/content.
	- `DELETE /home/admin/delete/:id` — delete an article.

Examples (using `curl` and a cookie jar):

```bash
# register
curl -X POST -H "Content-Type: application/json" -d '{"username":"alice","password":"password"}' http://localhost:5000/home/register

# login and save session cookie
curl -c cookie.txt -X POST -H "Content-Type: application/json" -d '{"username":"alice","password":"password"}' http://localhost:5000/home/login

# add an article (use saved cookie)
curl -b cookie.txt -X POST "http://localhost:5000/home/admin/add?title=Hello&content=This%20is%20an%20article"

# list users (admin)
curl -b cookie.txt http://localhost:5000/home/admin/users

# get article with id 1
curl http://localhost:5000/home/articles/1
```

Notes:
- Admin endpoints use the session created by `POST /home/login`. Use `-c` and `-b` in `curl` to persist and send the cookie.
- The admin article endpoints expect data via query parameters (not JSON body).
- Data is stored in `data/articles.json` and `data/users.json`.

If you want, I can add a `dev` script to `package.json` and example Postman collection for these endpoints.
