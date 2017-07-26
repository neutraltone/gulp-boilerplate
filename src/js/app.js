// import polyfill from './modules/polyfills';
// import { docReady, hasClass } from './modules/utilities';

class App {
  constructor() {
    polyfill();

    console.info('Script initalised');

    this.addEventListeners();
    this.addInitializers();
  }

  addEventListeners() {

  }

  addInitializers() {

  }
}

docReady(() => {
  const app = new App();
});
