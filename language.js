// Language switching functionality for Portal Miray
document.addEventListener("DOMContentLoaded", function() {
  // Initialize with default language or saved preference
  let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
  
  // Get all language buttons
  const languageButtons = document.querySelectorAll('.lang-btn');
  
  // Apply initial translations
  setActiveLanguageButton(currentLanguage);
  translatePage(currentLanguage);
  
  // Add click event listeners to language buttons
  languageButtons.forEach(button => {
    button.addEventListener('click', function() {
      const language = this.getAttribute('data-language');
      changeLanguage(language);
    });
  });
  
  // Function to change the language
  function changeLanguage(language) {
    // Save the selection to localStorage
    localStorage.setItem('selectedLanguage', language);
    currentLanguage = language;
    
    // Update active button state
    setActiveLanguageButton(language);
    
    // Apply translations
    translatePage(language);
  }
  
  // Set the active language button
  function setActiveLanguageButton(language) {
    languageButtons.forEach(button => {
      const buttonLang = button.getAttribute('data-language');
      if (buttonLang === language) {
        button.classList.add('active');
        // Add a stronger border for the active button
        button.style.border = '3px solid white';
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
        
        // Ensure we don't have the text overlapping with the flag for active button
        button.setAttribute('title', `Active language: ${buttonLang.toUpperCase()}`);
      } else {
        button.classList.remove('active');
        // Reset to default border for inactive buttons
        button.style.border = '2px solid rgba(255, 255, 255, 0.7)';
        button.style.transform = 'none';
        button.style.boxShadow = 'none';
        
        button.setAttribute('title', `Switch to ${buttonLang.toUpperCase()}`);
      }
    });
  }
  
  // Apply translations to the page
  function translatePage(language) {
    if (!translations || !translations[language]) {
      console.error(`Translations not found for language: ${language}`);
      return;
    }
    
    // Get all elements with data-lang attribute
    const elements = document.querySelectorAll('[data-lang]');
    
    elements.forEach(element => {
      const key = element.getAttribute('data-lang');
      if (translations[language][key]) {
        // If element has content, update the content
        element.textContent = translations[language][key];
      } else {
        console.warn(`Translation key not found: ${key} for language ${language}`);
      }
    });
    
    // Update html lang attribute for accessibility
    document.documentElement.lang = language;
    
    // We may also want to update any date/time formats based on the locale
    updateDateTimeFormats(language);
  }
  
  // Helper function to update date/time formats based on locale
  function updateDateTimeFormats(language) {
    // Map language codes to locales
    const localeMap = {
      'en': 'en-US',
      'es': 'es-ES',
      'tr': 'tr-TR',
      'de': 'de-DE'
    };
    
    const locale = localeMap[language] || 'en-US';
    
    // Update any date elements that need formatting
    const currentDateEl = document.getElementById("current-date");
    if (currentDateEl) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      currentDateEl.textContent = new Date().toLocaleDateString(locale, options);
    }
  }
  
  // Expose the changeLanguage function globally
  window.changeLanguage = changeLanguage;
}); 