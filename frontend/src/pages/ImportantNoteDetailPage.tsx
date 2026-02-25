import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Star, Calendar, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetImportantNote } from '../hooks/useQueries';

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ImportantNoteDetailPage() {
  const { title } = useParams({ from: '/important-note/$title' });
  const navigate = useNavigate();
  const decodedTitle = decodeURIComponent(title);
  const { data: note, isLoading, error } = useGetImportantNote(decodedTitle);

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl animate-fade-in">
      <Button
        variant="ghost"
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate({ to: '/important-notes' })}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Important Notes
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
          <Button variant="outline" className="mt-4" onClick={() => navigate({ to: '/important-notes' })}>
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
              {note.featured && (
                <span className="flex items-center gap-1 text-xs font-semibold text-amber bg-amber/10 px-2.5 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-amber" />
                  Featured
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {note.title}
            </h1>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {formatDate(note.creationTimestamp)}
            </div>
          </div>

          {/* Content */}
          <div className="bg-card rounded-xl border border-border p-6 paper-texture">
            <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              Note Content
            </div>
            <div className="prose prose-sm max-w-none text-foreground">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground bg-transparent p-0 border-0">
                {note.content}
              </pre>
            </div>
          </div>
        </article>
      ) : null}
    </div>
  );
}
