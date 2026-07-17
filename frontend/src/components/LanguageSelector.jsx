import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState('English');
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'te', name: 'Telugu' },
    { code: 'mr', name: 'Marathi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'ur', name: 'Urdu' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'kn', name: 'Kannada' },
    { code: 'or', name: 'Odia' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'ml', name: 'Malayalam' }
  ];

  useEffect(() => {
    // Add Google Translate script if not present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', autoDisplay: false },
          'google_translate_element'
        );
      };
    }
  }, []);

  const changeLanguage = (langCode, langName) => {
    // Select the google translate dropdown and trigger change
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    }
    setCurrentLang(langName);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div id="google_translate_element" className="hidden"></div>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm font-medium border border-border"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{currentLang}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-2 z-50">
          <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Select Language
          </div>
          <div className="max-h-64 overflow-y-auto">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code, lang.name)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors ${currentLang === lang.name ? 'text-primary font-bold bg-primary/5' : ''}`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
