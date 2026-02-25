import type { Note } from '../backend';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, User, Calendar, ExternalLink, FileText } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface NoteCardProps {
  note: Note;
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

const subjectColors: Record<string, string> = {
  Mathematics: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Physics: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  Chemistry: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  Biology: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  History: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  Geography: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  English: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  'Computer Science': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
};

function getSubjectColor(subject: string): string {
  return subjectColors[subject] || 'bg-secondary text-secondary-foreground';
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
  const navigate = useNavigate();

  function handleOpenNote(e: React.MouseEvent) {
    e.stopPropagation();
    if (note.pdfContent) {
      const dataUri = `data:application/pdf;base64,${note.pdfContent}`;
      window.open(dataUri, '_blank');
    } else {
      navigate({ to: '/note/$title', params: { title: encodeURIComponent(note.title) } });
    }
  }

  return (
    <Card
      className="cursor-pointer card-hover border border-border bg-card group flex flex-col"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-bold text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {note.title}
            </h3>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${getSubjectColor(note.subject)}`}>
            {note.subject}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col flex-1">
        {note.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {note.description}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {note.uploaderName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(note.uploadTimestamp)}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {note.viewCount.toString()}
          </span>
        </div>
        {/* Open Note button */}
        <div className="mt-auto pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-primary border-primary/30 hover:bg-primary/10 hover:border-primary"
            onClick={handleOpenNote}
          >
            {note.pdfContent ? (
              <>
                <FileText className="w-3.5 h-3.5" />
                Open PDF
              </>
            ) : (
              <>
                <ExternalLink className="w-3.5 h-3.5" />
                Open Note
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
