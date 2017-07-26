import polyfill from './modules/polyfills';
import { docReady } from './modules/utilities';

class App {
  constructor() {
    // polyfill();

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
