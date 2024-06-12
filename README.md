# Shift Manager Web Application

This is a project created by PUM-06 with the purpose of comparing CSR and SSR rendering. The project an React application using TypeScript. The application is created using vite. The project also uses ESLint and prettier to ensure a certain code standard. Below is the starting guide for setting up the project on your own system. Note that you Node.js installed to run this project. It can be downloaded here

```bash
https://nodejs.org/en/download
```

## Getting Started

To get started, follow these steps:

1. Clone the repository:

```bash
git clone https://gitlab.liu.se/kandidat_vt24/client-group/client-rendered-frontend.
```

2. Make sure you are in the project directory, else navigate to project directory:

```bash
cd client-rendered-frontend
```

3. Install the dependencies:

```bash
npm install
```

4. Set up VScode settings
   Press `ctrl + shift + p` and go to `> Prefrences: Open Workspace Settings (JSON)`.
   This ensures all project memebers use the same settings for ESLint
   Paste the following code below and save.

```bash
{
  "editor.defaultFormatter": "rvest.vs-code-prettier-eslint",
  "editor.formatOnType": false,
  "editor.formatOnPaste": false,
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "file", // required to format on save
  "files.autoSave":
  "vs-code-prettier-eslint.prettierLast": true // set as "true" to run 'prettier' last not first
}
```

5. Set up API-key:

Create a file in the root directory named `.env.development` containing:

```
VITE_API_KEY='put api key here'
```

6. Start the development server:

```bash
npm run dev
```

This will start the development server and open the application in your default browser.

## Available Scripts

In the project directory, you can run the following scripts:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the production-ready application.
- `npm run serve`: Serves the production build locally.

You will mainly use `npm run dev`. When the application is running it will automatically re-render on save.

## Folder Structure

Inside the `./src` you can find the main files used for development. The rest of files inside `root` is mostly used for configuration and can for the most part be ignored.

## Testing

A test file must contain '.test' in the filename to work. To run the all testfiles the command

```bash
npx vitest
```
