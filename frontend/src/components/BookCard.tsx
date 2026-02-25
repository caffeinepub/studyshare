import { BookOpen, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Book } from '../backend';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  function handleOpenBook() {
    if (!book.pdfBase64) return;
    const dataUri = `data:application/pdf;base64,${book.pdfBase64}`;
    window.open(dataUri, '_blank');
  }

  return (
    <div className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5">
      {/* Cover placeholder */}
      <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border-b border-border">
        <BookOpen className="w-14 h-14 text-primary/30" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-serif font-semibold text-foreground text-base leading-snug line-clamp-2 flex-1">
              {book.title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
          <Badge variant="secondary" className="text-xs mb-2">
            {book.subject}
          </Badge>
          {book.description && (
            <p className="text-xs text-muted-foreground line-clamp-3 mt-1">
              {book.description}
            </p>
          )}
          {book.pdfFileName && (
            <p className="text-xs text-primary/70 mt-2 flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              {book.pdfFileName}
            </p>
          )}
        </div>

        {/* Action */}
        <Button
          size="sm"
          className="w-full gap-2 mt-auto"
          disabled={!book.pdfBase64}
          onClick={handleOpenBook}
          title={book.pdfBase64 ? 'Open PDF in browser' : 'No PDF available'}
        >
          <BookOpen className="w-4 h-4" />
          {book.pdfBase64 ? 'Open Book' : 'No PDF Available'}
        </Button>
      </div>
    </div>
  );
}
