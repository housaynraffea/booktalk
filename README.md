# BookTalk

(This project is actively being developed, so changes can come to the README-file too.)

**BookTalk** is a 'social' book-reviewing website where users can search for and *review* books that they have read (by putting *1-5 stars* and an *optional description* of the review), and where other users can also *comment* on the reviews. Other people can also *like* the reviews, which eventually appear on the user's own profile page. The reviews the user liked are only available for them on their own profile page, not to others. On the homepage, you can see *recommended books* (for you), and *popular books* (for everyone). The user can decide if they want to remove these two features from the homepage in the website's *settings*. Other things you can do in the *settings* page are (for example), change your profile picture, username and password.

BookTalk is inspired by letterboxd.

## Technology used

- Software: VSCodium (telemetry-free version of Visual Studio Code)
  - Extensions: Live Server, Prettier, Error Lens
- Framework: React med Vite
- Programming language: TypeScript
- Linter: Oxlint

## Get started

### Scripts

| Command           | What it does                                   |
| ----------------- | -----------------------------------------------|
| `npm run dev`     | Start the Vite dev server                      |
| `npm run build`   | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Serve the production build locally             |
| `npm run lint`    | Lint with oxlint                               |

## Website

Link to the website: [BookTalk](https://housaynraffea.github.io/booktalk/)
