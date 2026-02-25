import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Note, ImportantNote, Book } from '../backend';

// ─── Notes ───────────────────────────────────────────────────────────────────

export function useGetAllNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNote(title: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Note>({
    queryKey: ['note', title],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return actor.getNote(title);
    },
    enabled: !!actor && !isFetching && !!title,
  });
}

export function useGetNotesBySubject(subject: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Note[]>({
    queryKey: ['notes', 'subject', subject],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotesBySubject(subject);
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

export function useAddNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      subject: string;
      description: string;
      fileContent: string;
      uploaderName: string;
      pdfContent?: string | null;
      pdfFileName?: string | null;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addNote(
        params.title,
        params.subject,
        params.description,
        params.fileContent,
        params.uploaderName,
        params.pdfContent ?? null,
        params.pdfFileName ?? null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useDeleteNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.deleteNote(title);
    },
    onSuccess: (_data, title) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.removeQueries({ queryKey: ['note', title] });
    },
  });
}

export function useAddViewCount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addViewCount(title);
    },
    onSuccess: (_data, title) => {
      queryClient.invalidateQueries({ queryKey: ['note', title] });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

// ─── Important Notes ─────────────────────────────────────────────────────────

export function useGetAllImportantNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<ImportantNote[]>({
    queryKey: ['importantNotes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllImportantNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedImportantNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<ImportantNote[]>({
    queryKey: ['importantNotes', 'featured'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedImportantNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetImportantNote(title: string) {
  const { actor, isFetching } = useActor();
  return useQuery<ImportantNote>({
    queryKey: ['importantNote', title],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return actor.getImportantNote(title);
    },
    enabled: !!actor && !isFetching && !!title,
  });
}

export function useAddImportantNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      subject: string;
      content: string;
      featured: boolean;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addImportantNote(
        params.title,
        params.subject,
        params.content,
        params.featured
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importantNotes'] });
    },
  });
}

// ─── Books ────────────────────────────────────────────────────────────────────

export function useGetAllBooks() {
  const { actor, isFetching } = useActor();
  return useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBooks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetImportantBooks() {
  const { actor, isFetching } = useActor();
  return useQuery<Book[]>({
    queryKey: ['books', 'important'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getImportantBooks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBook(title: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Book>({
    queryKey: ['book', title],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return actor.getBook(title);
    },
    enabled: !!actor && !isFetching && !!title,
  });
}

export function useAddBook() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      author: string;
      subject: string;
      description: string;
      coverImageUrl: string | null;
      downloadLink: string;
      important: boolean;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addBook(
        params.title,
        params.author,
        params.subject,
        params.description,
        params.coverImageUrl,
        params.downloadLink,
        params.important
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}
