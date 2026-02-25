import { Link } from '@tanstack/react-router';
import { BookOpen, FileText, Star, ArrowRight, Users, BookMarked, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllNotes, useGetAllBooks } from '../hooks/useQueries';

const features = [
  {
    icon: FileText,
    title: 'Browse Notes',
    description: 'Explore thousands of student-shared notes across all subjects. Filter by topic and find exactly what you need.',
    to: '/browse-notes',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    cta: 'Browse Notes',
  },
  {
    icon: Star,
    title: 'Important Notes',
    description: 'Access curated, high-quality notes handpicked by educators. Featured notes are highlighted for quick access.',
    to: '/important-notes',
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    cta: 'View Important Notes',
  },
  {
    icon: BookOpen,
    title: 'Study Books',
    description: 'Discover a curated library of study books and resources. Access them directly with a single click.',
    to: '/books',
    color: 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400',
    cta: 'Explore Books',
  },
];

export default function HomePage() {
  const { data: notes, isLoading: notesLoading } = useGetAllNotes();
  const { data: books, isLoading: booksLoading } = useGetAllBooks();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/generated/hero-banner.dim_1400x500.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full mb-4">
              <GraduationCapIcon />
              Your Academic Companion
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Learn Smarter,<br />
              <span className="text-amber-200">Together</span>
            </h1>
            <p className="text-white/85 text-lg md:text-xl mb-8 leading-relaxed">
              StudyHub is your go-to platform for sharing notes, discovering important study materials, and accessing curated books — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg">
                <Link to="/browse-notes">
                  Browse Notes <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/10 backdrop-blur-sm">
                <Link to="/share-notes">Share Your Notes</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              icon={<FileText className="w-5 h-5" />}
              label="Notes Shared"
              value={notesLoading ? null : (notes?.length ?? 0)}
              color="text-blue-600"
            />
            <StatCard
              icon={<BookOpen className="w-5 h-5" />}
              label="Books Available"
              value={booksLoading ? null : (books?.length ?? 0)}
              color="text-teal-600"
            />
            <StatCard
              icon={<Star className="w-5 h-5" />}
              label="Curated Resources"
              value={booksLoading ? null : (books?.filter(b => b.important).length ?? 0)}
              color="text-amber-600"
            />
            <StatCard
              icon={<Users className="w-5 h-5" />}
              label="Subjects Covered"
              value={notesLoading ? null : (new Set(notes?.map(n => n.subject) ?? []).size)}
              color="text-purple-600"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
            Everything You Need to Excel
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Three powerful tools to supercharge your studies
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.to} className="border border-border card-hover group">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{feature.description}</p>
                <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                  <Link to={feature.to}>
                    {feature.cta} <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 border-y border-border">
        <div className="container mx-auto px-4 py-14 text-center">
          <BookMarked className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
            Have notes to share?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Help your fellow students by uploading your notes. Every contribution makes the community stronger.
          </p>
          <Button asChild size="lg">
            <Link to="/share-notes">
              Share Your Notes <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Developer Credit Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-full px-5 py-2.5">
            <Code2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-300 font-sans">
              Developed by{' '}
              <span className="font-semibold font-serif text-amber-900 dark:text-amber-200">
                Sahil Kumar
              </span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Crafted with dedication for students everywhere
          </p>
        </div>
      </section>
    </div>
  );
}

function GraduationCapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="flex flex-col items-center text-center gap-1">
      <div className={`${color} mb-1`}>{icon}</div>
      {value === null ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        <span className="text-3xl font-bold text-foreground font-serif">{value}</span>
      )}
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
