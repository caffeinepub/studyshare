import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BrowseNotesPage from './pages/BrowseNotesPage';
import ShareNotesPage from './pages/ShareNotesPage';
import ImportantNotesPage from './pages/ImportantNotesPage';
import BooksPage from './pages/BooksPage';
import NoteDetailPage from './pages/NoteDetailPage';
import ImportantNoteDetailPage from './pages/ImportantNoteDetailPage';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const browseNotesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/browse-notes',
  component: BrowseNotesPage,
});

const shareNotesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/share-notes',
  component: ShareNotesPage,
});

const importantNotesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/important-notes',
  component: ImportantNotesPage,
});

const booksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/books',
  component: BooksPage,
});

const noteDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/note/$title',
  component: NoteDetailPage,
});

const importantNoteDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/important-note/$title',
  component: ImportantNoteDetailPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  browseNotesRoute,
  shareNotesRoute,
  importantNotesRoute,
  booksRoute,
  noteDetailRoute,
  importantNoteDetailRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
