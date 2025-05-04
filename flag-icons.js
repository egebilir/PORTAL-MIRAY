// Script to enhance language buttons
document.addEventListener("DOMContentLoaded", function() {
  console.log("Initializing language button enhancements");

  // Get all language buttons
  const languageButtons = document.querySelectorAll('.lang-btn');
  
  // Make sure the language selector is properly styled
  const languageSelector = document.querySelector('.language-selector');
  if (languageSelector) {
    // Position in the blue header area as shown in screenshot
    languageSelector.style.position = 'absolute';
    languageSelector.style.top = '20px';
    languageSelector.style.right = '20px';
    languageSelector.style.display = 'flex';
    languageSelector.style.gap = '8px';
    languageSelector.style.zIndex = '1000';
    languageSelector.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
    languageSelector.style.padding = '6px 10px';
    languageSelector.style.borderRadius = '30px';
    
    console.log("Language selector positioned in blue header area");
  }

  // Verify all flag images are in place
  languageButtons.forEach(button => {
    const lang = button.getAttribute('data-language');
    const image = button.querySelector('img');
    
    if (image) {
      console.log(`Flag image found for ${lang} language`);
    } else {
      console.error(`No flag image found for ${lang} language button`);
    }
  });
}); 