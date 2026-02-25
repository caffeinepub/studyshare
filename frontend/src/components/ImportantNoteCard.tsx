import type { ImportantNote } from '../backend';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star, Calendar } from 'lucide-react';

interface ImportantNoteCardProps {
  note: ImportantNote;
  featured?: boolean;
  onClick: () => void;
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ImportantNoteCard({ note, featured = false, onClick }: ImportantNoteCardProps) {
  if (featured) {
    return (
      <Card
        className="cursor-pointer card-hover border-2 border-accent bg-amber-light/30 group relative overflow-hidden"
        onClick={onClick}
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-accent/20 rounded-bl-full" />
        <CardHeader className="pb-2">
          <div className="flex items-start gap-2">
            <Star className="w-4 h-4 text-accent fill-accent shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">Featured</span>
              <h3 className="font-serif font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors mt-0.5">
                {note.title}
              </h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary mb-2">
            {note.subject}
          </span>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {note.content}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {formatDate(note.creationTimestamp)}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="cursor-pointer card-hover border border-border bg-card group"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif font-bold text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {note.title}
          </h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
            {note.subject}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {note.content}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {formatDate(note.creationTimestamp)}
        </div>
      </CardContent>
    </Card>
  );
}
