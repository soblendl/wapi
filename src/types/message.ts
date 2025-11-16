export type ChatType = "private" | "group" | "unknown";
export interface IChat {
  jid: string;
  pn?: string;
  type: ChatType;
  addressing: "pn" | "lid" | "unknown";
  name: string;
}
export interface IFrom {
  jid: string;
  pn: string;
  name: string;
}
export type MessageType = "conversation" | "extendedTextMessage" | "imageMessage" | "videoMessage" | "audioMessage" | "documentMessage" | "stickerMessage" | "unknown";