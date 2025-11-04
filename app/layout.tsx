import '@/global.css';
import { Providers } from './providers';
import { ReactNode } from 'react';
import { AuthProvider } from '../../context/AuthContext';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        {/* Wrap <Providers> with <AuthProvider> so that auth state
          is available to all components, including your UI providers
          and all pages (children).
        */}
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
