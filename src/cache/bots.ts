import type { UUID } from "node:crypto";
import type { Bot } from "../bot/bot.js";

export const bots = new Map<UUID, Bot>();