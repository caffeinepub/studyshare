import { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Upload, CheckCircle, AlertCircle, PenLine, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAddNote } from '../hooks/useQueries';

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

interface FormState {
  title: string;
  subject: string;
  description: string;
  fileContent: string;
  uploaderName: string;
}

const INITIAL_FORM: FormState = {
  title: '',
  subject: '',
  description: '',
  fileContent: '',
  uploaderName: '',
};

export default function ShareNotesPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [success, setSuccess] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addNote = useAddNote();

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPdfError(null);

    if (!file) {
      setPdfFile(null);
      setPdfBase64(null);
      return;
    }

    if (file.type !== 'application/pdf') {
      setPdfError('Only PDF files are accepted.');
      setPdfFile(null);
      setPdfBase64(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setPdfFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      // Strip the data URL prefix (e.g. "data:application/pdf;base64,")
      const base64 = result.split(',')[1];
      setPdfBase64(base64);
    };
    reader.onerror = () => {
      setPdfError('Failed to read the PDF file. Please try again.');
      setPdfFile(null);
      setPdfBase64(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
    setPdfBase64(null);
    setPdfError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // At least one of text content or PDF must be provided
  const isValid =
    form.title.trim() &&
    form.subject &&
    form.description.trim() &&
    form.uploaderName.trim() &&
    (form.fileContent.trim() || pdfBase64);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      await addNote.mutateAsync({
        title: form.title.trim(),
        subject: form.subject,
        description: form.description.trim(),
        fileContent: form.fileContent.trim(),
        uploaderName: form.uploaderName.trim(),
        pdfContent: pdfBase64 ?? null,
        pdfFileName: pdfFile?.name ?? null,
      });
      setSuccess(true);
      setForm(INITIAL_FORM);
      setPdfFile(null);
      setPdfBase64(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      // error handled by mutation state
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-primary mb-2">
          <PenLine className="w-5 h-5" />
          <span className="text-sm font-semibold uppercase tracking-wider">Contribute</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
          Share Your Notes
        </h1>
        <p className="text-muted-foreground text-lg">
          Help fellow students by sharing your study notes
        </p>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-300">Notes shared successfully!</p>
            <p className="text-sm text-green-700 dark:text-green-400 mt-0.5">
              Your notes are now available for other students.{' '}
              <button
                className="underline font-medium"
                onClick={() => navigate({ to: '/browse-notes' })}
              >
                Browse all notes →
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {addNote.isError && (
        <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">
            Failed to share notes. A note with this title may already exist. Please try a different title.
          </p>
        </div>
      )}

      <Card className="border border-border shadow-card">
        <CardHeader className="pb-2">
          <h2 className="font-serif font-bold text-xl text-foreground">Note Details</h2>
          <p className="text-sm text-muted-foreground">
            Fill in the required fields and optionally attach a PDF
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Calculus Chapter 3 Notes"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject *</Label>
                <Select value={form.subject} onValueChange={(v) => handleChange('subject', v)}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="uploaderName">Your Name *</Label>
              <Input
                id="uploaderName"
                placeholder="e.g., Alex Johnson"
                value={form.uploaderName}
                onChange={(e) => handleChange('uploaderName', e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Brief description of what these notes cover..."
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={2}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fileContent">
                Note Content{!pdfBase64 && ' *'}
              </Label>
              <Textarea
                id="fileContent"
                placeholder={
                  pdfBase64
                    ? 'Optional — you have a PDF attached. You can also add text notes here.'
                    : 'Paste or type your full note content here...'
                }
                value={form.fileContent}
                onChange={(e) => handleChange('fileContent', e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                {form.fileContent.length} characters
                {!pdfBase64 && (
                  <span className="ml-1 text-muted-foreground/70">
                    — required unless a PDF is attached
                  </span>
                )}
              </p>
            </div>

            {/* PDF Upload */}
            <div className="space-y-2">
              <Label htmlFor="pdfUpload">
                Attach PDF{form.fileContent.trim() ? '' : ' *'}
              </Label>
              <div className="flex flex-col gap-2">
                {pdfFile ? (
                  <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
                    <FileText className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground flex-1 truncate">
                      {pdfFile.name}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {(pdfFile.size / 1024).toFixed(1)} KB
                    </span>
                    <button
                      type="button"
                      onClick={handleRemovePdf}
                      className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove PDF"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="pdfUpload"
                    className="flex items-center gap-3 border-2 border-dashed border-border hover:border-primary/50 rounded-lg px-4 py-4 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Click to upload a PDF
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF files only · Max recommended size: 5 MB
                      </p>
                    </div>
                  </label>
                )}
                <input
                  ref={fileInputRef}
                  id="pdfUpload"
                  type="file"
                  accept="application/pdf,.pdf"
                  className="sr-only"
                  onChange={handlePdfChange}
                />
                {pdfError && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {pdfError}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
              disabled={!isValid || addNote.isPending}
            >
              {addNote.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Share Notes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
