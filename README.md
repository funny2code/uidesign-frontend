# Web App

## Update 2023-11-16

Due to Web Containers needing specific headers, we are moving other features to different routes, so we'll use Astro's file-based-routing. 

**The problem:** We are running as a SPA so we can’t change headers after initial page load between tabs.

**Solution:** Use Astro file based routing with transition views or any other “multipage-app” features like layouts to put other tabs under other routes so only the home route gets the headers applied to it. 

**Details:** Web containers require cross-origin isolation headers https://webcontainers.io/guides/quickstart#cross-origin-isolation to allow the container to run on the page. We are already selectively adding these headers via AWS Cloudfront to only the main route of the application “/” so if we want to allow iframe embedding for other features we can put them under their own routes “/shopify”, “/create”, etc. This doesn’t require a major refactor as we can keep using existing React components for each feature and load them from different routes using Astro, also keeping the navigation bar in the same Astro layout for all pages. The major change to React code will be the navigation bar will require changing from “handleChangePage” prop-drilled state to traditional anchors “href=” to actually change routes. Only question is how good is Astro on keeping state in between routes using the current “atom” stores?

Test server with route-dependent headers (builds and runs script).
```
npm run server
```


## Intro

Astro JS uses file based routing, but most of the app is wrapped as SPA in `src/components/app/index.ts`. The only pages not in the SPA are for auth and old stuff. The `src/client` directory is code generated from embeddings API using OpenAPI.

For the `Generate` section, most tabs follow a similar behaviour and there is a lot of code duplication that can be improved and abstracted away. The `ui-streaming-api` Node app deals with storing results for `Create`, `Shopify` and `Remix`, but for tabs like `Remix` and `Copy`, the frontend stores them directly using the embeddings API client. 

```sh
src
├── client
│   ├── core
│   ├── models
│   └── services
├── client_utils
├── components
│   ├── app
│   │   ├── Admin
│   │   │   ├── Messages
│   │   │   ├── TopBarMenu
│   │   │   └── Users
│   │   ├── Generate
│   │   │   ├── Build
│   │   │   ├── Copy
│   │   │   ├── Create
│   │   │   ├── Old
│   │   │   ├── Remix
│   │   │   ├── Shopify
│   │   │   ├── TopBarMenu
│   │   │   ├── commands
│   │   │   └── components
│   │   ├── History
│   │   ├── SideBarMenu
│   │   └── utils
│   ├── auth
│   └── login
├── layouts
├── pages
│   ├── login
│   ├── success
│   └── test
└── styles
```

## Development

```sh
npm install
npm run dev
```

There are no tests as of today.

## Notes

- The `src/atoms.ts` file contains 'signals-like' global storage objects used for storing A.I. generation results. 
- The `Build` tab is lazy loaded and kept at the parent level, on the `Generate` state, to avoid re-rendering the Stackblitz VM.
- Auth session is kept on local storage for now but the plan is to set HTTP cookies on the backend soon to help manage that instead of calling `getSession` on the frontend.
- Embeddings API docs: https://api.uidesign.ai/redoc or https://api.uidesign.ai/docs using Version 2 endpoints.
- The embeddings API is also WIP so open to feedback and suggestions.

## Considerations

- Open for any changes and refactoring to other frameworks, Astro helps on performance if we were doing islands but we are basically doing the same as with NextJS with the pages directory.
- Styles are using bootstrap layout plus custom CSS under `src/styles`. We can probably change Bootstrap for Tailwind or whatever else for better styling.
- Considering placing the Admin panel in another route to avoid shipping all that JS to all clients. 

## Deployment

Using Cloudfront and S3 bucket to serve static files. NOTE: The distribution also serves other stuff so invalidate specific paths.

```sh
sh ./update-frontend.sh
```
