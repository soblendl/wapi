import type { Boom } from "@hapi/boom";
import type { Bot } from "./bot.js";
import { toError } from "../utils/index.js";

export async function logout(bot: Bot, reason?: Boom): Promise<void> {
  try {
    await bot.ws?.logout(reason?.message);
  }
  catch (e) {
    bot.emit("error", toError(e));
  }
}