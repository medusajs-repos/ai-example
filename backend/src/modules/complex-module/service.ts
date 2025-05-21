import { MedusaService } from "@medusajs/framework/utils";
import CustomModel from "./models/custom-model";
import myWorkflow from "./workflows/custom-flow";

export class CustomModule extends MedusaService({
  CustomModel,
}) {
  private customDataStorage;

  constructor({ customDataStorage }) {
    super(...arguments);

    this.customDataStorage = customDataStorage;
  }

  async ping() {
    const pingResponse = await this.customDataStorage.ping();
    return pingResponse;
  }

  async runWorkflowAndGetCategories(input) {
    return await myWorkflow.run({ input });
  }
}
