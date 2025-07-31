export interface ChatMessages {
    userQuery: string;
    botReply: any;
    AudioUrl: string;
    dtm: any;
    video: string;
    language: languageCheck;
}

export enum languageCheck{
    ENGLISH = 'English',
    HINDI = 'Hindi'
}