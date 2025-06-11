import { Modules } from "@medusajs/framework/utils";
import {
  createStep,
  createWorkflow,
  StepResponse,
} from "@medusajs/framework/workflows-sdk";

const step1 = createStep("get-product-categories", async (input: any, context) => {
  const productModule = context.container.resolve(Modules.PRODUCT);

  return new StepResponse({
    input,
    product_categories: await productModule.listProductCategories(),
  });
});

const myWorkflow = createWorkflow("custom-workflows", function (input: any) {
  step1(input);
});

export default myWorkflow;
