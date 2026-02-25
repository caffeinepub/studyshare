import type { Book } from '../backend';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Star, ExternalLink, User } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

const subjectColors: Record<string, string> = {
  Mathematics: 'bg-blue-100 text-blue-800',
  Physics: 'bg-purple-100 text-purple-800',
  Chemistry: 'bg-green-100 text-green-800',
  Biology: 'bg-emerald-100 text-emerald-800',
  History: 'bg-amber-100 text-amber-800',
  Geography: 'bg-teal-100 text-teal-800',
  English: 'bg-rose-100 text-rose-800',
  'Computer Science': 'bg-indigo-100 text-indigo-800',
};

function getSubjectColor(subject: string): string {
  return subjectColors[subject] || 'bg-secondary text-secondary-foreground';
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Card className={`card-hover border flex flex-col h-full ${book.important ? 'border-accent border-2' : 'border-border'}`}>
      {/* Cover */}
      <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg flex items-center justify-center overflow-hidden">
        {book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <BookOpen className="w-16 h-16 text-primary/40" />
        )}
        {book.important && (
          <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-full p-1">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
        )}
      </div>

      <CardHeader className="pb-1 pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif font-bold text-base text-foreground line-clamp-2 flex-1">
            {book.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <User className="w-3.5 h-3.5" />
          <span className="line-clamp-1">{book.author}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1">
        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${getSubjectColor(book.subject)}`}>
          {book.subject}
        </span>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {book.description}
        </p>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          className="w-full gap-2"
          onClick={() => window.open(book.downloadLink, '_blank', 'noopener,noreferrer')}
        >
          <ExternalLink className="w-4 h-4" />
          Access Book
        </Button>
      </CardFooter>
    </Card>
  );
}
