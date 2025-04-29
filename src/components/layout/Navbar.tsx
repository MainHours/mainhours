
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MessageSquare, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [navQuery, setNavQuery] = useState('');

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(navQuery.trim())}`);
      setNavQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <div className="rounded-full bg-gray-100 p-1">
              <img src="/lovable-uploads/f65d98ab-d9f7-4561-a13e-18e5a61bada7.png" alt="MainHours Logo" className="h-8 w-8 rounded-full object-none" />
            </div>
            <span className="ml-2 text-xl font-bold text-black">MainHours</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center flex-1 px-4 md:px-8">
          <form className="relative w-full max-w-sm" onSubmit={handleNavSearch}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search MainHours..." 
              className="w-full rounded-full bg-muted pl-8 md:w-[300px] lg:w-[400px]"
              value={navQuery}
              onChange={(e) => setNavQuery(e.target.value)}
            />
          </form>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/search">
              <Search className="h-5 w-5 md:hidden" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/messages">
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">Messages</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="hidden md:flex">
            <Link to="/ai">
              <span>AI Assistant</span>
            </Link>
          </Button>
          {user ? (
            <>
              <Button asChild>
                <Link to="/profile">
                  <span className="hidden md:inline">My Profile</span>
                  <span className="inline md:hidden">Profile</span>
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link to="/auth">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
