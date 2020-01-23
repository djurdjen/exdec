import { Selector } from "testcafe";

export default class AddEntry {
  constructor(t) {
    this.controller = t;
    this.descriptionField = new Selector(
      '.create__form input[name="description"]'
    );
    this.transportField = new Selector(
      '.create__form select[name="transport-type"]'
    );
    this.submitEntryButton = new Selector('button[name="send-entry"]');
  }

  async fill({ transport }) {
    const transportOption = new Selector(
      `.create__form select[name="transport-type"] option[value="${transport}"]`
    );
    await this.controller
      .typeText(this.descriptionField, "Test")
      .click(this.transportField)
      .click(transportOption);

    const valueField = await new Selector(
      `.create__form input[name="${
        transport === "car" ? "kilometres" : "ticket-price"
      }"]`
    );

    await this.controller
      .typeText(valueField, "20")
      .click(this.submitEntryButton);
  }
}
