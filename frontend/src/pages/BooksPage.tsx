import { useState, useRef, useMemo } from 'react';
import { Search, BookOpen, SlidersHorizontal, PlusCircle, Loader2, FileText, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
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
}

const EMPTY_FORM: BookFormState = {
  title: '',
  author: '',
  subject: '',
  description: '',
};

export default function BooksPage() {
  const { data: books, isLoading, error } = useGetAllBooks();
  const addBook = useAddBook();

  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState(ALL_SUBJECTS_OPTION);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [form, setForm] = useState<BookFormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<BookFormState & { pdf: string }>>({});

  // PDF state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      return matchesSearch && matchesSubject;
    });
  }, [books, search, subject]);

  function handlePdfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setFormErrors(prev => ({ ...prev, pdf: 'Only PDF files are allowed.' }));
      return;
    }
    setPdfFile(file);
    setFormErrors(prev => ({ ...prev, pdf: undefined }));

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      // result is "data:application/pdf;base64,<base64string>"
      const base64 = result.split(',')[1];
      setPdfBase64(base64);
    };
    reader.readAsDataURL(file);
  }

  function removePdf() {
    setPdfFile(null);
    setPdfBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function validateForm(): boolean {
    const errors: Partial<BookFormState & { pdf: string }> = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.author.trim()) errors.author = 'Author is required';
    if (!form.subject) errors.subject = 'Subject is required';
    if (!form.description.trim()) errors.description = 'Description is required';
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
        pdfBase64: pdfBase64 ?? null,
        pdfFileName: pdfFile?.name ?? null,
      },
      {
        onSuccess: () => {
          toast.success(`"${form.title}" has been added to the library!`);
          resetForm();
          setUploadOpen(false);
        },
        onError: () => {
          toast.error('Failed to upload book. Please try again.');
        },
      }
    );
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setPdfFile(null);
    setPdfBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleOpenChange(open: boolean) {
    if (!open) resetForm();
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
              Add a new study book to the library. Upload a PDF file along with the book details.
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

            {/* PDF Upload */}
            <div className="space-y-1.5">
              <Label htmlFor="book-pdf">
                PDF File{' '}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>

              {pdfFile ? (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-border">
                  <FileText className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{pdfFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removePdf}
                    className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove PDF"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="book-pdf"
                  className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <FileText className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground text-center">
                    Click to select a PDF file
                  </span>
                  <span className="text-xs text-muted-foreground/70">PDF only</span>
                  <input
                    id="book-pdf"
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="sr-only"
                    onChange={handlePdfChange}
                  />
                </label>
              )}

              {formErrors.pdf && (
                <p className="text-xs text-destructive">{formErrors.pdf}</p>
              )}
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
