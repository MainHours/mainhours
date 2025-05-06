
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Globe, Languages } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ar', name: 'Arabic' },
];

const AppearanceSettings = () => {
  const { t, changeLanguage, currentLanguage } = useTranslation();
  const [language, setLanguage] = useState(currentLanguage || 'en');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get stored language preference or default to current language
    const storedLanguage = localStorage.getItem('language') || currentLanguage || 'en';
    setLanguage(storedLanguage);
  }, [currentLanguage]);

  const handleLanguageChange = async (value: string) => {
    try {
      setLoading(true);
      setLanguage(value);
      
      // Update language in i18n and local storage
      await changeLanguage(value);
      
      toast.success(`Language changed to ${languages.find(lang => lang.code === value)?.name}`);
    } catch (error) {
      toast.error('Failed to update language preference');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">{t('settings.appearance')}</h2>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-medium">{t('settings.language')}</h3>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {t('settings.languageDesc')}
        </p>
        
        <RadioGroup 
          value={language} 
          onValueChange={handleLanguageChange}
          className="grid grid-cols-1 gap-2 md:grid-cols-2"
        >
          {languages.map((lang) => (
            <div key={lang.code} className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem value={lang.code} id={lang.code} />
              <Label htmlFor={lang.code} className="flex-1 cursor-pointer">
                {lang.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* Note: In a real implementation, this section could include theme options, font size settings, etc. */}
    </div>
  );
};

export default AppearanceSettings;
