
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Activity, Users, Search, TrendingUp, BarChart, Newspaper, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

const navItems = [
  {
    title: "common.home",
    href: "/",
    icon: <Activity className="h-5 w-5" />,
  },
  {
    title: "common.social",
    href: "/social",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "common.search",
    href: "/search",
    icon: <Search className="h-5 w-5" />,
  },
  {
    title: "common.news",
    href: "/news",
    icon: <Newspaper className="h-5 w-5" />,
  },
  {
    title: "common.finance",
    href: "/finance",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    title: "common.trends",
    href: "/trends",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    title: "common.climate",
    href: "/climate",
    icon: <Thermometer className="h-5 w-5" />,
  },
];

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  
  return (
    <div className={cn("pb-12 h-full", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold">MainHours</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  location.pathname === item.href && "bg-mainhours-purple"
                )}
                asChild
              >
                <Link to={item.href}>
                  {item.icon}
                  <span className="ml-2">{t(item.title)}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
