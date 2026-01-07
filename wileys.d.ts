declare module 'wileys' {
  import type { Agent } from 'http';
  import type { URL } from 'url';
  import type { Readable } from 'stream';
  import { Boom } from '@hapi/boom';
  import { proto as WAProto } from './WAProto';

  export { WAProto };
  export { WAProto as proto };
  export type JidServer = 's.whatsapp.net' | 'g.us' | 'broadcast' | 'call' | 'lid';

  export function initAuthCreds(): AuthenticationCreds;
  export function makeWASocket(config: Partial<SocketConfig>): any;
  export function downloadMediaMessage(
    message: WAMessage,
    type: 'buffer' | 'stream',
    options: {},
    ctx?: any
  ): Promise<Buffer | any>;
  export type KeyPair = { public: Uint8Array; private: Uint8Array };
  export type SignedKeyPair = {
    keyPair: KeyPair;
    signature: Uint8Array;
    keyId: number;
    timestampS?: number;
  };
  export type ProtocolAddress = {
    name: string;
    deviceId: number;
  };
  export type SignalIdentity = {
    identifier: ProtocolAddress;
    identifierKey: Uint8Array;
  };
  export type LIDMapping = {
    pn: string;
    lid: string;
  };
  export type LTHashState = {
    version: number;
    hash: Buffer;
    indexValueMap: {
      [indexMacBase64: string]: { valueMac: Uint8Array | Buffer };
    };
  };
  export type SignalCreds = {
    readonly signedIdentityKey: KeyPair;
    readonly signedPreKey: SignedKeyPair;
    readonly registrationId: number;
  };
  export type AccountSettings = {
    unarchiveChats: boolean;
    defaultDisappearingMode?: Pick<WAProto.IConversation, 'ephemeralExpiration' | 'ephemeralSettingTimestamp'>;
  };
  export type AuthenticationCreds = SignalCreds & {
    readonly noiseKey: KeyPair;
    readonly pairingEphemeralKeyPair: KeyPair;
    advSecretKey: string;
    me?: Contact;
    account?: WAProto.IADVSignedDeviceIdentity;
    signalIdentities?: SignalIdentity[];
    myAppStateKeyId?: string;
    firstUnuploadedPreKeyId: number;
    nextPreKeyId: number;
    lastAccountSyncTimestamp?: number;
    platform?: string;
    processedHistoryMessages: MinimalMessage[];
    accountSyncCounter: number;
    accountSettings: AccountSettings;
    registered: boolean;
    pairingCode: string | undefined;
    lastPropHash: string | undefined;
    routingInfo: Buffer | undefined;
    additionalData?: any | undefined;
  };
  export type SignalDataTypeMap = {
    'pre-key': KeyPair;
    session: Uint8Array;
    'sender-key': Uint8Array;
    'sender-key-memory': { [jid: string]: boolean };
    'app-state-sync-key': WAProto.Message.IAppStateSyncKeyData;
    'app-state-sync-version': LTHashState;
    'lid-mapping': string;
    'device-list': string[];
    tctoken: { token: Buffer; timestamp?: string };
  };
  export type SignalDataSet = { [T in keyof SignalDataTypeMap]?: { [id: string]: SignalDataTypeMap[T] | null } };
  type Awaitable<T> = T | Promise<T>;
  export type SignalKeyStore = {
    get<T extends keyof SignalDataTypeMap>(type: T, ids: string[]): Awaitable<{ [id: string]: SignalDataTypeMap[T] }>;
    set(data: SignalDataSet): Awaitable<void>;
    clear?(): Awaitable<void>;
  };
  export type SignalKeyStoreWithTransaction = SignalKeyStore & {
    isInTransaction: () => boolean;
    transaction<T>(exec: () => Promise<T>, key: string): Promise<T>;
  };
  export type TransactionCapabilityOptions = {
    maxCommitRetries: number;
    delayBetweenTriesMs: number;
  };
  export type SignalAuthState = {
    creds: SignalCreds;
    keys: SignalKeyStore | SignalKeyStoreWithTransaction;
  };
  export type AuthenticationState = {
    creds: AuthenticationCreds;
    keys: SignalKeyStore;
  };
  export type GroupParticipant = Contact & {
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
    admin?: 'admin' | 'superadmin' | null;
  };
  export type ParticipantAction = 'add' | 'remove' | 'promote' | 'demote' | 'modify';
  export type RequestJoinAction = 'created' | 'revoked' | 'rejected';
  export type RequestJoinMethod = 'invite_link' | 'linked_group_join' | 'non_admin_add' | undefined;
  export interface GroupMetadata {
    id: string;
    notify?: string;
    addressingMode?: WAMessageAddressingMode;
    owner: string | undefined;
    ownerPn?: string | undefined;
    owner_country_code?: string | undefined;
    subject: string;
    subjectOwner?: string;
    subjectOwnerPn?: string;
    subjectTime?: number;
    creation?: number;
    desc?: string;
    descOwner?: string;
    descOwnerPn?: string;
    descId?: string;
    descTime?: number;
    linkedParent?: string;
    restrict?: boolean;
    announce?: boolean;
    memberAddMode?: boolean;
    joinApprovalMode?: boolean;
    isCommunity?: boolean;
    isCommunityAnnounce?: boolean;
    size?: number;
    participants: GroupParticipant[];
    ephemeralDuration?: number;
    inviteCode?: string;
    author?: string;
    authorPn?: string;
  }
  export interface WAGroupCreateResponse {
    status: number;
    gid?: string;
    participants?: [{ [key: string]: {} }];
  }
  export interface GroupModificationResponse {
    status: number;
    participants?: { [key: string]: {} };
  }
  export type WAPrivacyValue = 'all' | 'contacts' | 'contact_blacklist' | 'none';
  export type WAPrivacyOnlineValue = 'all' | 'match_last_seen';
  export type WAPrivacyGroupAddValue = 'all' | 'contacts' | 'contact_blacklist';
  export type WAReadReceiptsValue = 'all' | 'none';
  export type WAPrivacyCallValue = 'all' | 'known';
  export type WAPrivacyMessagesValue = 'all' | 'contacts';
  export type WAPresence = 'unavailable' | 'available' | 'composing' | 'recording' | 'paused';
  export const ALL_WA_PATCH_NAMES: readonly ["critical_block", "critical_unblock_low", "regular_high", "regular_low", "regular"];
  export type WAPatchName = (typeof ALL_WA_PATCH_NAMES)[number];
  export interface PresenceData {
    lastKnownPresence: WAPresence;
    lastSeen?: number;
  }
  export type BotListInfo = {
    jid: string;
    personaId: string;
  };
  export type ChatMutation = {
    syncAction: WAProto.ISyncActionData;
    index: string[];
  };
  export type WAPatchCreate = {
    syncAction: WAProto.ISyncActionValue;
    index: string[];
    type: WAPatchName;
    apiVersion: number;
    operation: WAProto.SyncdMutation.SyncdOperation;
  };
  export type Chat = WAProto.IConversation & {
    lastMessageRecvTimestamp?: number;
  };
  export type ChatUpdate = Partial<Chat & {
    conditional: (bufferedData: BufferedEventData) => boolean | undefined;
    timestamp?: number;
  }>;
  export type LastMessageList = MinimalMessage[] | WAProto.SyncActionValue.ISyncActionMessageRange;
  export type ChatModification =
    | { archive: boolean; lastMessages: LastMessageList }
    | { pushNameSetting: string }
    | { pin: boolean }
    | { mute: number | null }
    | { clear: boolean; lastMessages: LastMessageList }
    | { deleteForMe: { deleteMedia: boolean; key: WAMessageKey; timestamp: number } }
    | { star: { messages: { id: string; fromMe?: boolean }[]; star: boolean } }
    | { markRead: boolean; lastMessages: LastMessageList }
    | { delete: true; lastMessages: LastMessageList }
    | { contact: WAProto.SyncActionValue.IContactAction | null }
    | { disableLinkPreviews: WAProto.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction }
    | { addLabel: any }
    | { addChatLabel: any }
    | { removeChatLabel: any }
    | { addMessageLabel: any }
    | { removeMessageLabel: any }
    | { quickReply: any };
  export type InitialReceivedChatsState = {
    [jid: string]: {
      lastMsgRecvTimestamp?: number;
      lastMsgTimestamp: number;
    };
  };
  export type InitialAppStateSyncOptions = {
    accountSettings: AccountSettings;
  };
  export interface Contact {
    id: string;
    lid?: string;
    phoneNumber?: string;
    name?: string;
    notify?: string;
    verifiedName?: string;
    imgUrl?: string | null;
    status?: string;
  }
  export type WAConnectionState = 'open' | 'connecting' | 'close';
  export type ConnectionState = {
    connection: WAConnectionState;
    lastDisconnect?: {
      error: Boom | Error | undefined;
      date: Date;
    };
    isNewLogin?: boolean;
    qr?: string;
    receivedPendingNotifications?: boolean;
    legacy?: {
      phoneConnected: boolean;
      user?: Contact;
    };
    isOnline?: boolean;
  };
  export type WAMessage = WAProto.IWebMessageInfo & {
    key: WAMessageKey;
    messageStubParameters?: any;
    category?: string;
    retryCount?: number;
  };
  export type WAMessageContent = WAProto.IMessage;
  export type WAContactMessage = WAProto.Message.IContactMessage;
  export type WAContactsArrayMessage = WAProto.Message.IContactsArrayMessage;
  export type WAMessageKey = WAProto.IMessageKey & {
    remoteJidAlt?: string;
    participantAlt?: string;
    server_id?: string;
    addressingMode?: string;
    isViewOnce?: boolean;
  };
  export type WATextMessage = WAProto.Message.IExtendedTextMessage;
  export type WAContextInfo = WAProto.IContextInfo;
  export type WALocationMessage = WAProto.Message.ILocationMessage;
  export type WAGenericMediaMessage =
    | WAProto.Message.IVideoMessage
    | WAProto.Message.IImageMessage
    | WAProto.Message.IAudioMessage
    | WAProto.Message.IDocumentMessage
    | WAProto.Message.IStickerMessage;
  export const WAMessageStubType: typeof WAProto.WebMessageInfo.StubType;
  export const WAMessageStatus: typeof WAProto.WebMessageInfo.Status;
  export type WAMediaPayloadURL = { url: URL | string };
  export type WAMediaPayloadStream = { stream: Readable };
  export type WAMediaUpload = Buffer | WAMediaPayloadStream | WAMediaPayloadURL;
  export type MessageType = keyof WAProto.Message;
  export enum WAMessageAddressingMode {
    PN = 'pn',
    LID = 'lid'
  }
  export type MessageWithContextInfo =
    | 'imageMessage' | 'contactMessage' | 'locationMessage' | 'extendedTextMessage' | 'documentMessage'
    | 'audioMessage' | 'videoMessage' | 'call' | 'contactsArrayMessage' | 'liveLocationMessage'
    | 'templateMessage' | 'stickerMessage' | 'groupInviteMessage' | 'templateButtonReplyMessage'
    | 'productMessage' | 'listMessage' | 'orderMessage' | 'listResponseMessage' | 'buttonsMessage'
    | 'buttonsResponseMessage' | 'interactiveMessage' | 'interactiveResponseMessage' | 'pollCreationMessage'
    | 'requestPhoneNumberMessage' | 'messageHistoryBundle' | 'eventMessage' | 'newsletterAdminInviteMessage'
    | 'albumMessage' | 'stickerPackMessage' | 'pollResultSnapshotMessage' | 'messageHistoryNotice';
  export type DownloadableMessage = { mediaKey?: Uint8Array | null; directPath?: string | null; url?: string | null };
  export type MessageReceiptType = 'read' | 'read-self' | 'hist_sync' | 'peer_msg' | 'sender' | 'inactive' | 'played' | undefined;
  export type MediaConnInfo = {
    auth: string;
    ttl: number;
    hosts: { hostname: string; maxContentLengthBytes: number }[];
    fetchDate: Date;
  };
  export interface WAUrlInfo {
    'canonical-url': string;
    'matched-text': string;
    title: string;
    description?: string;
    jpegThumbnail?: Buffer;
    highQualityThumbnail?: WAProto.Message.IImageMessage;
    originalThumbnailUrl?: string;
  }
  type Mentionable = { mentions?: string[] };
  type Contextable = { contextInfo?: WAProto.IContextInfo };
  type ViewOnce = { viewOnce?: boolean };
  type Editable = { edit?: WAMessageKey };
  type WithDimensions = { width?: number; height?: number };
  export type PollMessageOptions = {
    name: string;
    selectableCount?: number;
    values: string[];
    messageSecret?: Uint8Array;
    toAnnouncementGroup?: boolean;
  };
  export type EventMessageOptions = {
    name: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    location?: WALocationMessage;
    call?: 'audio' | 'video';
    isCancelled?: boolean;
    isScheduleCall?: boolean;
    extraGuestsAllowed?: boolean;
    messageSecret?: Uint8Array;
  };
  type SharePhoneNumber = { sharePhoneNumber: boolean };
  type RequestPhoneNumber = { requestPhoneNumber: boolean };
  export type AnyMediaMessageContent = (
    | ({ image: WAMediaUpload; caption?: string; jpegThumbnail?: string } & Mentionable & Contextable & WithDimensions)
    | ({ video: WAMediaUpload; caption?: string; gifPlayback?: boolean; jpegThumbnail?: string; ptv?: boolean } & Mentionable & Contextable & WithDimensions)
    | { audio: WAMediaUpload; ptt?: boolean; seconds?: number }
    | ({ sticker: WAMediaUpload; isAnimated?: boolean } & WithDimensions)
    | ({ document: WAMediaUpload; mimetype: string; fileName?: string; caption?: string } & Contextable)
  ) & { mimetype?: string } & Editable;
  export type ButtonReplyInfo = { displayText: string; id: string; index: number };
  export type GroupInviteInfo = { inviteCode: string; inviteExpiration: number; text: string; jid: string; subject: string };
  export type WASendableProduct = Omit<WAProto.Message.ProductMessage.IProductSnapshot, 'productImage'> & { productImage: WAMediaUpload };
  export type AnyRegularMessageContent = (
    | ({ text: string; linkPreview?: WAUrlInfo | null } & Mentionable & Contextable & Editable)
    | AnyMediaMessageContent
    | { event: EventMessageOptions }
    | ({ poll: PollMessageOptions } & Mentionable & Contextable & Editable)
    | { contacts: { displayName?: string; contacts: WAProto.Message.IContactMessage[] } }
    | { location: WALocationMessage }
    | { react: WAProto.Message.IReactionMessage }
    | { buttonReply: ButtonReplyInfo; type: 'template' | 'plain' }
    | { groupInvite: GroupInviteInfo }
    | { listReply: Omit<WAProto.Message.IListResponseMessage, 'contextInfo'> }
    | { pin: WAMessageKey; type: WAProto.PinInChat.Type; time?: 86400 | 604800 | 2592000 }
    | { product: WASendableProduct; businessOwnerJid?: string; body?: string; footer?: string }
    | SharePhoneNumber
    | RequestPhoneNumber
  ) & ViewOnce;
  export type AnyMessageContent =
    | AnyRegularMessageContent
    | { forward: WAMessage; force?: boolean }
    | { delete: WAMessageKey }
    | { disappearingMessagesInChat: boolean | number }
    | { limitSharing: boolean };
  export type GroupMetadataParticipants = Pick<GroupMetadata, 'participants'>;
  type MinimalRelayOptions = { messageId?: string; useCachedGroupMetadata?: boolean };
  export type MessageRelayOptions = MinimalRelayOptions & {
    participant?: { jid: string; count: number };
    additionalAttributes?: { [_: string]: string };
    additionalNodes?: any[];
    useUserDevicesCache?: boolean;
    statusJidList?: string[];
  };
  export type MiscMessageGenerationOptions = MinimalRelayOptions & {
    timestamp?: Date;
    quoted?: WAMessage;
    ephemeralExpiration?: number | string;
    mediaUploadTimeoutMs?: number;
    statusJidList?: string[];
    backgroundColor?: string;
    font?: number;
    broadcast?: boolean;
  };
  export type MessageGenerationOptionsFromContent = MiscMessageGenerationOptions & { userJid: string };
  export type WAMediaUploadFunction = (
    encFilePath: string,
    opts: { fileEncSha256B64: string; mediaType: any; timeoutMs?: number }
  ) => Promise<{ mediaUrl: string; directPath: string; meta_hmac?: string; ts?: number; fbid?: number }>;
  export type MediaGenerationOptions = {
    logger?: any;
    mediaTypeOverride?: any;
    upload: WAMediaUploadFunction;
    mediaCache?: CacheStore;
    mediaUploadTimeoutMs?: number;
    options?: RequestInit;
    backgroundColor?: string;
    font?: number;
  };
  export type MessageContentGenerationOptions = MediaGenerationOptions & {
    getUrlInfo?: (text: string) => Promise<WAUrlInfo | undefined>;
    getProfilePicUrl?: (jid: string, type: 'image' | 'preview') => Promise<string | undefined>;
    getCallLink?: (type: 'audio' | 'video', event?: { startTime: number }) => Promise<string | undefined>;
    jid?: string;
  };
  export type MessageGenerationOptions = MessageContentGenerationOptions & MessageGenerationOptionsFromContent;
  export type MessageUpsertType = 'append' | 'notify';
  export type MessageUserReceipt = WAProto.IUserReceipt;
  export type WAMessageUpdate = { update: Partial<WAMessage>; key: WAMessageKey };
  export type WAMessageCursor = { before: WAMessageKey | undefined } | { after: WAMessageKey | undefined };
  export type MessageUserReceiptUpdate = { key: WAMessageKey; receipt: MessageUserReceipt };
  export type MediaDecryptionKeyInfo = { iv: Buffer; cipherKey: Buffer; macKey?: Buffer };
  export type MinimalMessage = Pick<WAMessage, 'key' | 'messageTimestamp'>;
  export type WAVersion = [number, number, number];
  export type WABrowserDescription = [string, string, string];
  export type CacheStore = {
    get<T>(key: string): Promise<T> | T | undefined;
    set<T>(key: string, value: T): Promise<void> | void | number | boolean;
    del(key: string): void | Promise<void> | number | boolean;
    flushAll(): void | Promise<void>;
  };
  export type SocketConfig = {
    waWebSocketUrl: string | URL;
    connectTimeoutMs: number;
    defaultQueryTimeoutMs: number | undefined;
    keepAliveIntervalMs: number;
    agent?: Agent;
    logger: any;
    version: WAVersion;
    browser: WABrowserDescription;
    fetchAgent?: Agent;
    printQRInTerminal: boolean;
    emitOwnEvents: boolean;
    customUploadHosts: MediaConnInfo['hosts'];
    retryRequestDelayMs: number;
    maxMsgRetryCount: number;
    qrTimeout?: number;
    auth: AuthenticationState;
    shouldSyncHistoryMessage: (msg: WAProto.Message.IHistorySyncNotification) => boolean;
    transactionOpts: TransactionCapabilityOptions;
    markOnlineOnConnect: boolean;
    mediaCache?: CacheStore;
    msgRetryCounterCache?: CacheStore;
    userDevicesCache?: CacheStore;
    callOfferCache?: CacheStore;
    linkPreviewImageThumbnailWidth: number;
    syncFullHistory: boolean;
    fireInitQueries: boolean;
    generateHighQualityLinkPreview: boolean;
    shouldIgnoreJid: (jid: string) => boolean | undefined;
    patchMessageBeforeSending: (
      msg: WAProto.IMessage,
      recipientJids: string[]
    ) => WAProto.IMessage;
    appStateMacVerification: { patch: boolean; snapshot: boolean };
    options: RequestInit;
    getMessage: (key: WAMessageKey) => Promise<WAProto.IMessage | undefined>;
    cachedGroupMetadata: (jid: string) => Promise<GroupMetadata | undefined>;
  };
  export type BaileysEventMap = {
    'connection.update': Partial<ConnectionState>;
    'creds.update': Partial<AuthenticationCreds>;
    'messaging-history.set': {
      chats: Chat[];
      contacts: Contact[];
      messages: WAMessage[];
      isLatest?: boolean;
    };
    'chats.upsert': Chat[];
    'chats.update': ChatUpdate[];
    'chats.delete': string[];
    'presence.update': { id: string; presences: { [participant: string]: PresenceData } };
    'contacts.upsert': Contact[];
    'contacts.update': Partial<Contact>[];
    'messages.delete': { keys: WAMessageKey[] } | { jid: string; all: true };
    'messages.update': WAMessageUpdate[];
    'messages.media-update': { key: WAMessageKey; media?: { ciphertext: Uint8Array; iv: Uint8Array }; error?: Boom }[];
    'messages.upsert': { messages: WAMessage[]; type: MessageUpsertType };
    'messages.reaction': { key: WAMessageKey; reaction: WAProto.IReaction }[];
    'message-receipt.update': MessageUserReceiptUpdate[];
    'groups.upsert': GroupMetadata[];
    'groups.update': Partial<GroupMetadata>[];
    'group-participants.update': {
      id: string;
      participants: string[];
      action: ParticipantAction;
    };
    'blocklist.set': { blocklist: string[] };
    'blocklist.update': { blocklist: string[]; type: 'add' | 'remove' };
  };
  export type BufferedEventData = {
    historySets: {
      chats: { [jid: string]: Chat };
      contacts: { [jid: string]: Contact };
      messages: { [uqId: string]: WAMessage };
      empty: boolean;
      isLatest: boolean;
    };
    chatUpserts: { [jid: string]: Chat };
    chatUpdates: { [jid: string]: ChatUpdate };
    chatDeletes: Set<string>;
    contactUpserts: { [jid: string]: Contact };
    contactUpdates: { [jid: string]: Partial<Contact> };
    messageUpserts: { [key: string]: { type: MessageUpsertType; message: WAMessage } };
    messageUpdates: { [key: string]: WAMessageUpdate };
    messageDeletes: { [key: string]: WAMessageKey };
    messageReactions: { [key: string]: { key: WAMessageKey; reactions: WAProto.IReaction[] } };
    messageReceipts: { [key: string]: { key: WAMessageKey; userReceipt: WAProto.IUserReceipt[] } };
    groupUpdates: { [jid: string]: Partial<GroupMetadata> };
  };
  export type BaileysEvent = keyof BaileysEventMap;
  export interface BaileysEventEmitter {
    on<T extends keyof BaileysEventMap>(event: T, listener: (arg: BaileysEventMap[T]) => void): this;
    off<T extends keyof BaileysEventMap>(event: T, listener: (arg: BaileysEventMap[T]) => void): this;
    removeAllListeners<T extends keyof BaileysEventMap>(event?: T): this;
    emit<T extends keyof BaileysEventMap>(event: T, arg: BaileysEventMap[T]): boolean;
  }
}