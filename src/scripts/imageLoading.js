// Common image loading script for all card components
export function setupImageLoading() {
  if (typeof document === 'undefined') return; // Guard for server-side rendering

  const images = document.querySelectorAll('.thumbnail');
  images.forEach((img) => {
    if (!(img instanceof HTMLImageElement)) return;
    
    const pulseDiv = img.nextElementSibling;
    if (pulseDiv && pulseDiv.classList.contains('animate-pulse')) {
      pulseDiv.style.display = 'block';
    }

    if (img.complete) {
      if (pulseDiv) pulseDiv.style.display = 'none';
    } else {
      img.addEventListener('load', () => {
        if (pulseDiv) pulseDiv.style.display = 'none';
      });
      img.addEventListener('error', () => {
        // Keep placeholder or show error
        if (pulseDiv) pulseDiv.style.display = 'none';
        // Optionally, you could change the src to a 'not found' image here
        // img.src = '/path/to/image-not-found.png';
      });
    }
  });
}
