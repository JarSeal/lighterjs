# Lighter JS

A light weight and class based vanilla JS UI framework, with Component, Router, and State handling.

## Install

```
yarn add lighterjs -d
```

## Component example

```html
...
<body>
  <div id="root"></div>
</body>
...
```

```javascript
import { Component } from 'lighterjs';

const appRoot = new Component({ attachId: 'root', text: 'Hello world!" });
appRoot.draw();
// Renders the text "Hello world!" on the page.
```
