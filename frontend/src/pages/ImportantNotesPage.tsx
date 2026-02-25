import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Star, Search, SlidersHorizontal, BookMarked } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import ImportantNoteCard from '../components/ImportantNoteCard';
import { useGetAllImportantNotes, useGetFeaturedImportantNotes } from '../hooks/useQueries';

export default function ImportantNotesPage() {
  const navigate = useNavigate();
  const { data: allNotes, isLoading: allLoading } = useGetAllImportantNotes();
  const { data: featuredNotes, isLoading: featuredLoading } = useGetFeaturedImportantNotes();
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All Subjects');

  const isLoading = allLoading || featuredLoading;

  const uniqueSubjects = useMemo(() => {
    if (!allNotes) return ['All Subjects'];
    const subjects = Array.from(new Set(allNotes.map(n => n.subject)));
    return ['All Subjects', ...subjects];
  }, [allNotes]);

  const nonFeaturedFiltered = useMemo(() => {
    if (!allNotes) return [];
    return allNotes.filter((note) => {
      if (note.featured) return false;
      const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = subject === 'All Subjects' || note.subject === subject;
      return matchesSearch && matchesSubject;
    });
  }, [allNotes, search, subject]);

  const filteredFeatured = useMemo(() => {
    if (!featuredNotes) return [];
    return featuredNotes.filter((note) => {
      const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = subject === 'All Subjects' || note.subject === subject;
      return matchesSearch && matchesSubject;
    });
  }, [featuredNotes, search, subject]);

  const handleNoteClick = (title: string) => {
    navigate({ to: '/important-note/$title', params: { title: encodeURIComponent(title) } });
  };

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-amber mb-2">
          <Star className="w-5 h-5 fill-amber" />
          <span className="text-sm font-semibold uppercase tracking-wider text-amber">Curated</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
          Important Notes
        </h1>
        <p className="text-muted-foreground text-lg">
          Handpicked, high-quality notes curated for your success
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 p-4 bg-card rounded-xl border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search important notes..."
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

      {isLoading ? (
        <div className="space-y-8">
          <div>
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Featured Section */}
          {filteredFeatured.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-amber fill-amber" />
                <h2 className="font-serif font-bold text-xl text-foreground">Featured Notes</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFeatured.map((note) => (
                  <ImportantNoteCard
                    key={note.title}
                    note={note}
                    featured
                    onClick={() => handleNoteClick(note.title)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* All Important Notes */}
          {nonFeaturedFiltered.length > 0 && (
            <section>
              <h2 className="font-serif font-bold text-xl text-foreground mb-4">All Important Notes</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nonFeaturedFiltered.map((note) => (
                  <ImportantNoteCard
                    key={note.title}
                    note={note}
                    onClick={() => handleNoteClick(note.title)}
                  />
                ))}
              </div>
            </section>
          )}

          {filteredFeatured.length === 0 && nonFeaturedFiltered.length === 0 && (
            <div className="text-center py-20">
              <BookMarked className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">No important notes yet</h3>
              <p className="text-muted-foreground">
                {allNotes?.length === 0
                  ? 'Important notes will appear here once added.'
                  : 'Try adjusting your search or filter.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
