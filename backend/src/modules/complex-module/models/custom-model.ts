import { model } from "@medusajs/framework/utils";

const CustomModel = model.define("custom_model", {
  id: model.id({ prefix: "cm" }).primaryKey(),
  name: model.text(),
  custom_config: model.json().nullable(),
});

export default CustomModel;
