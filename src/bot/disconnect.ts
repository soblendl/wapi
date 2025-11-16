import { Boom } from "@hapi/boom";
import type { Bot } from "./bot.js";
import { toError } from "../utils/index.js";

export async function disconnect(bot: Bot, reason?: Boom): Promise<void> {
  try {
    reason ??= new Boom("Intentional disconnection.", { statusCode: 204 });
    bot.ws?.end(reason);
  }
  catch (e) {
    bot.emit("error", toError(e));
  }
}