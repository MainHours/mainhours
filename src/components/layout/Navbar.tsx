
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Activity, Settings, Moon, Sun, Newspaper, Bell, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/hooks/useTheme';
import { Toggle } from '@/components/ui/toggle';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [navQuery, setNavQuery] = useState('');
  const { theme, setTheme } = useTheme();

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

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <div className="rounded-full bg-gray-100 p-1">
              <img alt="MainHours Logo" className="h-8 w-8 rounded-full object-contain" src="/lovable-uploads/5cb4fa6b-e749-498c-858b-aabb4e4cdc50.png" />
            </div>
            <span className="ml-2 text-xl font-bold text-black dark:text-white">MainHours</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center flex-1 px-4 md:px-8">
          <form className="relative w-full max-w-sm" onSubmit={handleNavSearch}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search MainHours..." className="w-full rounded-full bg-muted pl-8 md:w-[300px] lg:w-[400px]" value={navQuery} onChange={e => setNavQuery(e.target.value)} />
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
            <Link to="/news">
              <Newspaper className="h-5 w-5" />
              <span className="sr-only">News</span>
            </Link>
          </Button>

          <Toggle aria-label="Toggle theme" pressed={theme === 'dark'} onPressedChange={toggleTheme} className="border-0">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Toggle>

          <Button variant="outline" asChild className="hidden md:flex">
            <Link to="/ai">
              <Sparkles className="mr-1.5 h-4 w-4 text-mainhours-purple" />
              <span>AI Assistant</span>
            </Link>
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    {user.user_metadata?.avatar_url ? (
                      <AvatarImage 
                        src={user.user_metadata.avatar_url} 
                        alt={user.user_metadata?.full_name || user.email || ''} 
                      /> 
                    ) : (
                      <AvatarFallback>
                        {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
