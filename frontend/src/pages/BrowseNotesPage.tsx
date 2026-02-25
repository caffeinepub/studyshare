import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, Filter, FileText, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import NoteCard from '../components/NoteCard';
import { useGetAllNotes } from '../hooks/useQueries';

const SUBJECTS = [
  'All Subjects',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'English',
  'Computer Science',
  'Other',
];

export default function BrowseNotesPage() {
  const navigate = useNavigate();
  const { data: notes, isLoading, error } = useGetAllNotes();
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All Subjects');

  const filtered = useMemo(() => {
    if (!notes) return [];
    return notes.filter((note) => {
      const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.description.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = subject === 'All Subjects' || note.subject === subject;
      return matchesSearch && matchesSubject;
    });
  }, [notes, search, subject]);

  const uniqueSubjects = useMemo(() => {
    if (!notes) return SUBJECTS;
    const fromData = Array.from(new Set(notes.map(n => n.subject)));
    const merged = Array.from(new Set(['All Subjects', ...fromData]));
    return merged;
  }, [notes]);

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-primary mb-2">
          <FileText className="w-5 h-5" />
          <span className="text-sm font-semibold uppercase tracking-wider">Student Notes</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
          Browse Notes
        </h1>
        <p className="text-muted-foreground text-lg">
          Discover notes shared by students across all subjects
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 p-4 bg-card rounded-xl border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notes by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 sm:w-52">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              {uniqueSubjects.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-muted-foreground mb-4">
          {filtered.length} note{filtered.length !== 1 ? 's' : ''} found
          {subject !== 'All Subjects' && ` in ${subject}`}
          {search && ` matching "${search}"`}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 text-destructive">
          <p>Failed to load notes. Please try again.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-semibold text-foreground mb-2">No notes found</h3>
          <p className="text-muted-foreground">
            {notes?.length === 0
              ? 'Be the first to share notes!'
              : 'Try adjusting your search or filter.'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <NoteCard
              key={note.title}
              note={note}
              onClick={() => navigate({ to: '/note/$title', params: { title: encodeURIComponent(note.title) } })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
