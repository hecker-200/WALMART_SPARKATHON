// Load Google Fonts
const loadFonts = () => {
  // Create link elements for Google Fonts
  const poppinsLink = document.createElement('link');
  poppinsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
  poppinsLink.rel = 'stylesheet';
  
  const playfairLink = document.createElement('link');
  playfairLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap';
  playfairLink.rel = 'stylesheet';
  
  document.head.appendChild(poppinsLink);
  document.head.appendChild(playfairLink);
};

// Load fonts immediately
loadFonts();