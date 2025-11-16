import { toError } from "../../utils/helpers.js";
import type { Bot } from "../bot.js";

export function creds(bot: Bot): void {
  try {
    bot.ws?.ev.on("creds.update", async () => {
      try {
        await bot.auth.save();
      }
      catch (e) {
        bot.emit("error", toError(e));
      }
    });
  }
  catch (e) {
    bot.emit("error", toError(e));
  }
}