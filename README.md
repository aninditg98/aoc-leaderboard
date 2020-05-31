# react-typescript-fullstack-starter

A starter template for a Full-Stack application with react, typescript, webpack,
and babel

## Installation

**1.** Clone or Download the repository

```
git clone https://github.com/frendon001/react-typescript-fullstack-starter.git
```

**2.** Install libraries in root directory:

```
npm ci
```

## Run in Development mode

```
npm run dev
```

-   Use `localhost:8080` in browser
-   Build happens automatically
-   Webpack dev server is used for the frontend with hot reloading
    -   Does not require server rending
-   Backend server is run by nodemon

## Run in Production mode

```
npm run build
npm run start
```

-   Use `localhost:3030` in browser
-   Webpack build is run in 'production' mode
-   The html file is served by the express server for all GET requests where the
    path does not start with `/api`

## Technologies Used

-   React
-   Axios
-   Node
-   Express
-   Typescript
-   Babel
-   Webpack
-   Prettier
-   ESLint

## Testing

-   TBD

## Troubleshooting

If validation script fails `npm run validate`.

-   Try running the formatting script to automatically fix formatting issues:
    `npm run format`

If there are issues with VSCode not respecting the tsconfig.json

-   Try overriding the default version of Typescript in VSCode by adding the
    following setting.json configuration on your workspace
-   This will allow VSCode to use the Typescript version specified on the
    project's package.json instead of the default VSCode version

```JSON
{
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

# Authors

-   Fausto Rendon (https://github.com/frendon001)
