import { Selector } from "testcafe";

export default class Login {
  constructor(t) {
    this.testController = t;
    this.inputEmailSelector = new Selector('form input[type="email"]');
    this.inputPasswordSelector = new Selector('form input[type="password"]');
    this.submitButton = new Selector('form button[type="submit"]');
  }
  async login() {
    await this.testController
      .typeText(this.inputEmailSelector, "admin@admin.nl")
      .typeText(this.inputPasswordSelector, "admin")
      .click(this.submitButton, { caretPos: 0 });
  }
}
