import { Selector } from "testcafe";

export default class RemoveEntry {
  constructor(t) {
    this.controller = t;
    this.entry = new Selector(".entries__single");
  }

  async remove() {
    await this.controller.click(this.entry);
    const deleteButton = await new Selector(".entries__delete");
    await this.controller.click(deleteButton);
    const promptButton = await new Selector(
      '.modal__prompt button[name="action-btn"]'
    );
    await this.controller.click(promptButton);
  }
}
