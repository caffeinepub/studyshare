import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ImportantNote {
    title: string;
    featured: boolean;
    content: string;
    subject: string;
    creationTimestamp: Time;
}
export interface Book {
    title: string;
    subject: string;
    description: string;
    author: string;
    pdfBase64?: string;
    pdfFileName?: string;
}
export type Time = bigint;
export interface Note {
    title: string;
    uploaderName: string;
    subject: string;
    pdfContent?: string;
    description: string;
    uploadTimestamp: Time;
    viewCount: bigint;
    fileContent: string;
    pdfFileName?: string;
}
export interface backendInterface {
    addBook(title: string, author: string, subject: string, description: string, pdfBase64: string | null, pdfFileName: string | null): Promise<void>;
    addImportantNote(title: string, subject: string, content: string, featured: boolean): Promise<void>;
    addNote(title: string, subject: string, description: string, fileContent: string, uploaderName: string, pdfContent: string | null, pdfFileName: string | null): Promise<void>;
    addViewCount(title: string): Promise<void>;
    deleteNote(title: string): Promise<void>;
    getAllBooks(): Promise<Array<Book>>;
    getAllImportantNotes(): Promise<Array<ImportantNote>>;
    getAllNotes(): Promise<Array<Note>>;
    getBook(title: string): Promise<Book>;
    getFeaturedImportantNotes(): Promise<Array<ImportantNote>>;
    getImportantNote(title: string): Promise<ImportantNote>;
    getNote(title: string): Promise<Note>;
    getNotesBySubject(subject: string): Promise<Array<Note>>;
}
