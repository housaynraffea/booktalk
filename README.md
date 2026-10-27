# BookTalk

(This project is actively being developed, so changes can come to the README-file too.)

**BookTalk** is a 'social' book-reviewing website where users can search for and *review* books that they have read (by putting *1-5 stars* and an *optional description* of the review), and where other users can also *comment* on the reviews. Other people can also *like* the reviews, which eventually appear on the user's own profile page. The reviews the user liked are only available for them on their own profile page, not to others. On the homepage, you can see *recommended books* (for you), and *popular books* (for everyone). The user can decide if they want to remove these two features from the homepage in the website's *settings*. Other things you can do in the *settings* page are (for example), change your profile picture, username and password.

BookTalk uses (or will use) the monthly dumps from the Open Library API for the following features in the project:

- Searching for books (either by book title, book author or book publisher)
- Showing the book cover, book title, book description (if available), book author and the book publisher for:
  - Reviews from users that use said book
  - Home-page's "For you"-section (Cover only)
  - Home-page's "Popular"-section (Cover only)
  - The "Favourite book" for a user's profile page (Cover only)
  - The list of reviews on books that a user has made, available on their profile page (Cover only)
  - The private list of liked reviews, available (privately) on a user's profile page (Cover only)

BookTalk is inspired by letterboxd.

Unfortunately, since I know this is public, and since I know that many people can come in and post Issues and Pull Requests to this GitHub project, I cannot accept any requests or changes from other users as this is an academic project for USN (University of South-Eastern Norway). I am the only one that can authorize and make changes to this GitHub repository.

## Technology used

- Software: VSCodium (telemetry-free version of Visual Studio Code) or just Visual Studio Code
  - Extensions: Live Server, Prettier, Error Lens
- Framework: React + Vite
- Programming language: TypeScript
- Linter: Oxlint

## Get started

### Project structure

```
.
├── client/                      Client-side (React + Vite & TypeScript)
│   ├── index.html               Main app entry
│   ├── public/                  Static assets
│   └── src/
│       ├── main.tsx             Main app render
│       ├── pages/               Route-level pages
│       ├── features/
│       │   ├── auth/            Login page, login entry point, useSession hook
│       │   └── routes/          AppRoutes: the app's route table
│       ├── common/
│       │   ├── components/      Shared UI components
│       │   ├── hooks/           Shared hooks
│       │   ├── utils/           Helpers
│       │   ├── types/           Shared TypeScript types
│       │   ├── constants/       Shared constants
│       │   ├── context/         React context providers
│       │   ├── assets/          Images, fonts, etc.
│       │   └── styles/          Global and shared CSS
│       └── api/
├── server/                      Server-side (PostgreSQL Database connections)
    ├── index.ts                 Main file for the server
    └── .env.example             Example environment file
```

Imports across the client's folders use the `@/` alias, which maps to `src/`
(for example `@/common/components/navbar`). It's configured in both
`vite.config.ts` and `tsconfig.app.json` for the client-side code, so make sure that both files are synced there.

### Scripts

#### Client

The client (by default) listens on port 5173.

| Command           | What it does                                  |
| ----------------- | ----------------------------------------------|
| `npm run dev`     | Start the Vite dev server                     |
| `npm run build`   | Type-check (`tsc -b`) and build for production|
| `npm run preview` | Serve the production build locally            |
| `npm run lint`    | Lint with oxlint                              |

#### Server

(This part is still in development!)
The server listens on port 3000.

| Command           | What it does     |
| ----------------- | -----------------|
| `npm run dev`     | Starts the server|

#### Project

The `concurrently` npm package allows executing multiple commands, concurrently. This is especially great if a developer has more than one project in a repo, since it would be a hassle to have (for example) two terminals running at the same time to run both the client and the server. Simply running this command in the root will launch both the client and the server;

| Command           | What it does                       |
| ----------------- | -----------------------------------|
| `npm run dev`     | Starts both the client & the server|

(This is why you see the `package.json` file on the root folder for the repo. It's important as it makes running two commands separately less of a hassle for me.)

### API

This project is planned to have APIs of its own. In the future, the API methods will be shown here.

## Website

Link to the website: [BookTalk](https://housaynraffea.github.io/booktalk/)
