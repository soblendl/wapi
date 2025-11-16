import makeWASocket from "baileys";
import type { Bot } from "./bot.js";
import os from "node:os";
import { connection, creds, message } from "./events/index.js";
import { toError } from "../utils/index.js";

export async function login(bot: Bot, method: "qr" | "otp"): Promise<void> {
  try {
    const auth = await bot.auth.init();
    bot.ws = makeWASocket({
      auth,
      browser: [os.platform(), "Firefox", os.release()],
      logger: bot.logger.child({ name: `WASocket ${bot.uuid} ` }),
      qrTimeout: 60_000,
      connectTimeoutMs: 60_000,
      markOnlineOnConnect: true,
      defaultQueryTimeoutMs: undefined,
      syncFullHistory: false,
      shouldSyncHistoryMessage: () => (false),
      generateHighQualityLinkPreview: true,
      linkPreviewImageThumbnailWidth: 1_980,
      shouldIgnoreJid: (jid) => {
        return false;
      },
    });
    creds(bot);
    connection(bot, method);
    message(bot);
  }
  catch (e) {
    bot.emit("error", toError(e));
  }
}