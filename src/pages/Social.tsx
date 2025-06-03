
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Wrench, Sparkles } from 'lucide-react';

const Social = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        {!isMobile && (
          <div className="hidden md:block w-64 border-r">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
              <div className="relative">
                <Wrench className="h-24 w-24 text-muted-foreground/50 animate-pulse" />
                <Sparkles className="h-8 w-8 text-mainhours-purple absolute -top-2 -right-2 animate-bounce" />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-foreground">
                  Under Construction
                </h1>
                <p className="text-xl text-muted-foreground max-w-md">
                  Something big is yet to come!
                </p>
                <div className="w-32 h-1 bg-gradient-to-r from-mainhours-purple to-blue-500 rounded-full mx-auto animate-pulse"></div>
              </div>
              
              <div className="text-sm text-muted-foreground mt-8">
                We're working hard to bring you an amazing social experience
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Social;
