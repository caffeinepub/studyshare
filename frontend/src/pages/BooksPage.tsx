import { useState, useMemo } from 'react';
import { Search, BookOpen, SlidersHorizontal, Star, PlusCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import BookCard from '../components/BookCard';
import { useGetAllBooks, useAddBook } from '../hooks/useQueries';
import { toast } from 'sonner';

const SUBJECTS = [
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

const ALL_SUBJECTS_OPTION = 'All Subjects';

interface BookFormState {
  title: string;
  author: string;
  subject: string;
  description: string;
  accessLink: string;
  coverImageUrl: string;
  important: boolean;
}

const EMPTY_FORM: BookFormState = {
  title: '',
  author: '',
  subject: '',
  description: '',
  accessLink: '',
  coverImageUrl: '',
  important: false,
};

export default function BooksPage() {
  const { data: books, isLoading, error } = useGetAllBooks();
  const addBook = useAddBook();

  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState(ALL_SUBJECTS_OPTION);
  const [showImportantOnly, setShowImportantOnly] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [form, setForm] = useState<BookFormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<BookFormState>>({});

  const uniqueSubjects = useMemo(() => {
    if (!books) return [ALL_SUBJECTS_OPTION, ...SUBJECTS];
    const fromData = Array.from(new Set(books.map(b => b.subject)));
    return [ALL_SUBJECTS_OPTION, ...fromData];
  }, [books]);

  const filtered = useMemo(() => {
    if (!books) return [];
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        book.description.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = subject === ALL_SUBJECTS_OPTION || book.subject === subject;
      const matchesImportant = !showImportantOnly || book.important;
      return matchesSearch && matchesSubject && matchesImportant;
    });
  }, [books, search, subject, showImportantOnly]);

  const importantCount = useMemo(() => books?.filter(b => b.important).length ?? 0, [books]);

  function validateForm(): boolean {
    const errors: Partial<BookFormState> = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.author.trim()) errors.author = 'Author is required';
    if (!form.subject) errors.subject = 'Subject is required';
    if (!form.description.trim()) errors.description = 'Description is required';
    if (!form.accessLink.trim()) errors.accessLink = 'Access link is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    addBook.mutate(
      {
        title: form.title.trim(),
        author: form.author.trim(),
        subject: form.subject,
        description: form.description.trim(),
        coverImageUrl: form.coverImageUrl.trim() || null,
        downloadLink: form.accessLink.trim(),
        important: form.important,
      },
      {
        onSuccess: () => {
          toast.success(`"${form.title}" has been added to the library!`);
          setForm(EMPTY_FORM);
          setFormErrors({});
          setUploadOpen(false);
        },
        onError: () => {
          toast.error('Failed to upload book. Please try again.');
        },
      }
    );
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setForm(EMPTY_FORM);
      setFormErrors({});
    }
    setUploadOpen(open);
  }

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-primary mb-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Library</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
            Study Books
          </h1>
          <p className="text-muted-foreground text-lg">
            Curated study books and resources for every subject
          </p>
        </div>
        <Button
          className="gap-2 shrink-0"
          onClick={() => setUploadOpen(true)}
        >
          <PlusCircle className="w-4 h-4" />
          Upload Book
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-card rounded-xl border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search books by title, author, or description..."
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

      {/* Important filter toggle */}
      {importantCount > 0 && (
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setShowImportantOnly(!showImportantOnly)}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-colors ${
              showImportantOnly
                ? 'bg-accent text-accent-foreground border-accent'
                : 'bg-card text-muted-foreground border-border hover:border-accent hover:text-accent'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showImportantOnly ? 'fill-current' : ''}`} />
            Important Books ({importantCount})
          </button>
        </div>
      )}

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-muted-foreground mb-4">
          {filtered.length} book{filtered.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 text-destructive">
          <p>Failed to load books. Please try again.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-semibold text-foreground mb-2">No books found</h3>
          <p className="text-muted-foreground">
            {books?.length === 0
              ? 'No books have been added yet. Be the first to upload one!'
              : 'Try adjusting your search or filter.'}
          </p>
          {books?.length === 0 && (
            <Button className="mt-4 gap-2" onClick={() => setUploadOpen(true)}>
              <PlusCircle className="w-4 h-4" />
              Upload First Book
            </Button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((book) => (
            <BookCard key={book.title} book={book} />
          ))}
        </div>
      )}

      {/* Upload Book Dialog */}
      <Dialog open={uploadOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Upload a Book</DialogTitle>
            <DialogDescription>
              Add a new study book to the library. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="book-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="book-title"
                placeholder="e.g. Concepts of Physics"
                value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              />
              {formErrors.title && (
                <p className="text-xs text-destructive">{formErrors.title}</p>
              )}
            </div>

            {/* Author */}
            <div className="space-y-1.5">
              <Label htmlFor="book-author">
                Author <span className="text-destructive">*</span>
              </Label>
              <Input
                id="book-author"
                placeholder="e.g. H.C. Verma"
                value={form.author}
                onChange={(e) => setForm(f => ({ ...f, author: e.target.value }))}
              />
              {formErrors.author && (
                <p className="text-xs text-destructive">{formErrors.author}</p>
              )}
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <Label htmlFor="book-subject">
                Subject <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.subject}
                onValueChange={(val) => setForm(f => ({ ...f, subject: val }))}
              >
                <SelectTrigger id="book-subject">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.subject && (
                <p className="text-xs text-destructive">{formErrors.subject}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="book-description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="book-description"
                placeholder="Brief description of the book..."
                rows={3}
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              />
              {formErrors.description && (
                <p className="text-xs text-destructive">{formErrors.description}</p>
              )}
            </div>

            {/* Access Link */}
            <div className="space-y-1.5">
              <Label htmlFor="book-link">
                Access / Download Link <span className="text-destructive">*</span>
              </Label>
              <Input
                id="book-link"
                type="url"
                placeholder="https://example.com/book.pdf"
                value={form.accessLink}
                onChange={(e) => setForm(f => ({ ...f, accessLink: e.target.value }))}
              />
              {formErrors.accessLink && (
                <p className="text-xs text-destructive">{formErrors.accessLink}</p>
              )}
            </div>

            {/* Cover Image URL (optional) */}
            <div className="space-y-1.5">
              <Label htmlFor="book-cover">
                Cover Image URL <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="book-cover"
                type="url"
                placeholder="https://example.com/cover.jpg"
                value={form.coverImageUrl}
                onChange={(e) => setForm(f => ({ ...f, coverImageUrl: e.target.value }))}
              />
            </div>

            {/* Important checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="book-important"
                checked={form.important}
                onCheckedChange={(checked) =>
                  setForm(f => ({ ...f, important: checked === true }))
                }
              />
              <Label htmlFor="book-important" className="cursor-pointer font-normal">
                Mark as Important Book
              </Label>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={addBook.isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={addBook.isPending} className="gap-2">
                {addBook.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Upload Book
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
