import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ReadingPage } from './pages/ReadingPage';
import { ListeningPage } from './pages/ListeningPage';
import { WritingPage } from './pages/WritingPage';
import { PracticePage } from './pages/PracticePage';
import { ProgressPage } from './pages/ProgressPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { ProfileAuthPage } from './pages/ProfileAuthPage';

function MainRouter() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const { isAdmin } = useAuth();

  // Listen to popstate for back/forward browser button navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setCurrentPath(path);
  };

  // Sync dynamic document titles for SEO
  useEffect(() => {
    if (currentPath === '/') {
      document.title = 'IELTS PRACTICE HUB | Master Reading, Listening & Writing';
    } else if (currentPath.startsWith('/reading')) {
      document.title = 'IELTS Reading Practice Library | IELTS PRACTICE HUB';
    } else if (currentPath.startsWith('/listening')) {
      document.title = 'IELTS Listening Audio Tests | IELTS PRACTICE HUB';
    } else if (currentPath.startsWith('/writing')) {
      document.title = 'IELTS Writing Studio & Band Diagnostic | IELTS PRACTICE HUB';
    } else if (currentPath.startsWith('/practice')) {
      document.title = 'Targeted IELTS Weakness Drills | IELTS PRACTICE HUB';
    } else if (currentPath.startsWith('/progress')) {
      document.title = 'Candidate Score Analytics & Band History | IELTS PRACTICE HUB';
    } else if (currentPath.startsWith('/about')) {
      document.title = 'About IELTS Test Format & Band Descriptors | IELTS PRACTICE HUB';
    } else if (currentPath.startsWith('/admin')) {
      document.title = 'Admin Content Management | IELTS PRACTICE HUB';
    } else if (currentPath.startsWith('/profile')) {
      document.title = 'Candidate Profile & Target Band | IELTS PRACTICE HUB';
    }
  }, [currentPath]);

  // Route matching
  const renderCurrentPage = () => {
    if (currentPath === '/') {
      return <HomePage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/reading')) {
      const parts = currentPath.split('/');
      const slug = parts[2] || undefined;
      return <ReadingPage initialTopicSlug={slug} />;
    }

    if (currentPath.startsWith('/listening')) {
      const parts = currentPath.split('/');
      const slug = parts[2] || undefined;
      return <ListeningPage initialTestSlug={slug} />;
    }

    if (currentPath.startsWith('/writing')) {
      const parts = currentPath.split('/');
      const slug = parts[2] || undefined;
      return <WritingPage initialTaskSlug={slug} />;
    }

    if (currentPath.startsWith('/practice')) {
      return <PracticePage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/progress')) {
      return <ProgressPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/about')) {
      return <AboutPage />;
    }

    if (currentPath.startsWith('/admin')) {
      return <AdminPage />;
    }

    if (currentPath.startsWith('/login')) {
      return <ProfileAuthPage mode="login" onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/register')) {
      return <ProfileAuthPage mode="register" onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/forgot-password')) {
      return <ProfileAuthPage mode="forgot-password" onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/profile')) {
      return <ProfileAuthPage mode="profile" onNavigate={navigate} />;
    }

    // Default fallback
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0c10] text-slate-900 dark:text-slate-100 transition-colors">
      <Header currentPath={currentPath} onNavigate={navigate} />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}
