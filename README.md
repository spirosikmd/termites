# termites

AngularJS base component library to build large scale web applications with component architecture in mind.

The `src` folder contains an example component, in this case a simple button. The `test` folder contains tests written for this button. To create a new component use the following structure for your JS, SCSS, HTML files and tests.

```
src
 |- component
       |- js
       |- scss
       |- templates
tests
 |- component
       |- ...
```

The `dist` folder contains the distributable components and produces a JS and CSS file. Link these files to any project to use a component. Take a look at the [example](example).

The only dependency is AngularJS.

## Getting started

Clone the repository and run `npm i`.

- `npm run start` to build once your files for development
- `npm run serve` to build files and watch for changes during development
- `npm run test` to run the tests and watch for changes
- `npm run build` to build your files for production

## Created with..

- [npm](https://www.npmjs.com/)
- [gulp](http://gulpjs.com/)
- [angular](https://angularjs.org/)
- [browserify](http://browserify.org/)
- [karma](http://karma-runner.github.io/0.13/index.html)
- [jasmine](http://jasmine.github.io/)
- [eslint](http://eslint.org/)
- [scsslint](https://github.com/brigade/scss-lint)
