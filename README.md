# Blueshift-JS

Blueshift-JS is a modernized version of the original blueshift.js event tracking client. It is to be published as a public npm module for Blueshift customers to import and integrate into their builds. It is designed to be compatible in node and browser contexts, as well as cross platform build systems like Expo.

## Getting Started

Clone the repository to your local machine, then run `npm install`

## Development

Run `npm run dev`
A browser window will open at http://localhost:8080/ and live update anytime you modify the source code of the module.

## Production Build

To build the module for production, run `npm run build`

This command will create a dist directory with a production-ready main.js file.

## Loading (This won't work until is published)

You can load the library in two ways:

### In Node.js

First, install the module `npm install blueshift-js`
Then, require and use it in your application:

```
const blueshift = require('blueshift-js');
```

### In the browser

Include the script in your HTML:

```
<script src="path-to-blueshift-js/main.js"></script>
```

## Configuration

You can configure Blueshift-JS with environment variables. Create a .env file at the root of your project and add your API key and hostname:

```
API_KEY=your-api-key
HOSTNAME=your-hostname
```

Alternatively you can also configure the client at runtime, via:

```
blueshift.initialize('your-api-key', 'your-hostname');
```

### Usage

Once loaded and configured, you use the blueshift module like so:

```
blueshift.track('test', { test: 'hello world' });
blueshift.identify({ email: 'testuser@getblueshift.com' });
```
