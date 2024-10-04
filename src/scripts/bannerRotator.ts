export function initBannerRotator(frases: string[]): void {
    let currentIndex = 0;
    const bannerElement = document.getElementById('frase-banner');
  
    function updateBanner(): void {
      if (bannerElement) {
        bannerElement.textContent = frases[currentIndex];
        currentIndex = (currentIndex + 1) % frases.length;
      }
    }
  
    updateBanner(); // Mostrar la primera frase inmediatamente
    setInterval(updateBanner, 5000); // Cambiar cada 5 segundos
  }