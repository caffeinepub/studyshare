import { useEffect, useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Eye, User, Calendar, BookOpen, Download, FileText, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useGetNote, useAddViewCount, useDeleteNote } from '../hooks/useQueries';
import { toast } from 'sonner';

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function downloadPdf(base64: string, fileName: string) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function openPdfInTab(base64: string) {
  const dataUri = `data:application/pdf;base64,${base64}`;
  window.open(dataUri, '_blank');
}

export default function NoteDetailPage() {
  const { title } = useParams({ from: '/note/$title' });
  const navigate = useNavigate();
  const decodedTitle = decodeURIComponent(title);
  const { data: note, isLoading, error } = useGetNote(decodedTitle);
  const addViewCount = useAddViewCount();
  const deleteNote = useDeleteNote();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (note) {
      addViewCount.mutate(decodedTitle);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.title]);

  function handleDelete() {
    deleteNote.mutate(decodedTitle, {
      onSuccess: () => {
        toast.success('Note deleted successfully');
        navigate({ to: '/browse-notes' });
      },
      onError: () => {
        toast.error('Failed to delete note. Please try again.');
        setDeleteOpen(false);
      },
    });
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl animate-fade-in">
      <Button
        variant="ghost"
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate({ to: '/browse-notes' })}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Browse Notes
      </Button>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-destructive">Note not found or failed to load.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate({ to: '/browse-notes' })}>
            Go Back
          </Button>
        </div>
      ) : note ? (
        <article>
          {/* Header */}
          <div className="mb-6 pb-6 border-b border-border">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {note.subject}
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {note.title}
            </h1>
            {note.description && (
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                {note.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {note.uploaderName}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(note.uploadTimestamp)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {note.viewCount.toString()} views
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Open Note / Open PDF button */}
            {note.pdfContent ? (
              <Button
                variant="default"
                className="gap-2"
                onClick={() => openPdfInTab(note.pdfContent!)}
              >
                <ExternalLink className="w-4 h-4" />
                Open PDF in Browser
              </Button>
            ) : (
              <Button
                variant="outline"
                className="gap-2"
                disabled
              >
                <BookOpen className="w-4 h-4" />
                Text Note (see below)
              </Button>
            )}

            {/* Delete Note button */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="gap-2 ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Note
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete <strong>"{note.title}"</strong>. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleteNote.isPending}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleteNote.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteNote.isPending ? 'Deleting…' : 'Yes, Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* PDF Download Section */}
          {note.pdfContent && note.pdfFileName && (
            <div className="flex items-center gap-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-800/40 shrink-0">
                <FileText className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  PDF Attachment
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 truncate">
                  {note.pdfFileName}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/40 shrink-0"
                onClick={() => downloadPdf(note.pdfContent!, note.pdfFileName!)}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          )}

          {/* Text Content */}
          {note.fileContent && (
            <div className="bg-card rounded-xl border border-border p-6 paper-texture">
              <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                Note Content
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground bg-transparent p-0 border-0">
                  {note.fileContent}
                </pre>
              </div>
            </div>
          )}

          {/* No content fallback */}
          {!note.fileContent && !note.pdfContent && (
            <div className="text-center py-10 text-muted-foreground">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No content available for this note.</p>
            </div>
          )}
        </article>
      ) : null}
    </div>
  );
}
