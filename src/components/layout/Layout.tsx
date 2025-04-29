
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <div className="hidden md:block w-64 border-r">
          <Sidebar className="h-full" />
        </div>
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
};
