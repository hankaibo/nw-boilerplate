# demo

...

# Quick start

Make sure you have [Node.js](https://nodejs.org),[Python](https://www.python.org/),GCC installed, then type the following commands known to every Node developer...

```
yarn install
yarn start
```

...and you have a running desktop application on your screen.

_Side note:_ [Windows build tools](https://www.npmjs.com/package/windows-build-tools)

_Side note:_ [NW using native node modules](http://docs.nwjs.io/en/latest/For%20Users/Advanced/Use%20Native%20Node%20Modules/)

# Structure of the project

The application consists of two main folders...

`src` - files within this folder get transpiled or compiled (because NW can't use them directly).

`app` - contains all static assets which don't need any pre-processing. Put here images, CSSes, HTMLs, etc.

The build process compiles the content of the `src` folder and puts it into the `app` folder, so after the build has finished, your `app` folder contains the full, runnable application.

Treat `src` and `app` folders like two halves of one bigger thing.

The drawback of this design is that `app` folder contains some files which should be git-ignored and some which shouldn't (see `.gitignore` file). But this two-folders split makes development builds much, much faster.

# Development

## Starting the app

```
npm start
```

## The build pipeline

Build process uses [Webpack](https://webpack.js.org/). The entry-points are `src/app.js`. Webpack will follow all `import` statements starting from those files and compile code of the whole dependency tree into one `.js` file for each entry point.

[Babel](http://babeljs.io/) is also utilised, but mainly for its great error messages. NW under the hood runs latest Chromium, hence most of the new JavaScript features are already natively supported.

## Environments

Environmental variables are done in a bit different way (not via `process.env`). Env files are plain JSONs in `config` directory, and build process dynamically links one of them as an `env` module. You can import it wherever in code you need access to the environment.

```js
import env from 'env';
console.log(env.name);
```

## Upgrading NW version

To do so edit `package.json`:

```json
"dependencies": {
  "nw": "0.33.3-sdk"
}
```

_Side note:_ [NW authors recommend](https://nwjs.io/blog/) to use fixed version here.

## Adding npm modules to your app

Remember to respect the split between `dependencies` and `devDependencies` in `package.json` file. Your distributable app will contain modules listed in `dependencies` after running the release script.

_Side note:_ If the module you want to use in your app is a native one (not pure JavaScript but compiled binary) you should first run `npm install name_of_npm_module` and then `npm run postinstall` to rebuild the module for NW. You need to do this once after you're first time installing the module. Later on, the postinstall script will fire automatically with every `npm install`.

# Making a release

To package your app into an installer use command:

```
npm run release
```

Once the packaging process finished, the `dist` directory will contain your distributable file.

We use [nw-builder](https://github.com/nwjs-community/nw-builder) to handle the packaging process. It has a lot of [customization options](https://github.com/nwjs-community/nw-builder#options), which you can declare under `"build"` key in `package.json`.
