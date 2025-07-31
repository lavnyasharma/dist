export interface ChatMessages {
    userQuery: string;
    botReply: unknown;
    AudioUrl: string;
    dtm: unknown;
    video: string;
    language: languageCheck;
}

export enum languageCheck{
    ENGLISH = 'English',
    HINDI = 'Hindi'
}