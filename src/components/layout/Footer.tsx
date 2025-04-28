
import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 py-6 px-4 border-t bg-background/80 backdrop-blur">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">MainHours</h3>
            <p className="text-sm text-muted-foreground">
              Your all-in-one platform for social networking, news, finance, and more.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="mailto:support@mainhours.com" className="text-muted-foreground hover:text-primary">
                  support@mainhours.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} MainHours. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
