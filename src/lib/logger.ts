import { Logger } from "tslog";

export const logger = new Logger({
  hideLogPositionForProduction: true,
  type: "pretty",
});