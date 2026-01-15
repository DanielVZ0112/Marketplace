import noImage from "@/assets/no-image.jpg";

export function buildProductImageUrl(url: string | undefined | null): string {
  if (!url) return noImage;
  
  if (url.includes('/') || url.startsWith('http')) {
    return url;
  }
  
  try {
    const basePath = import.meta.env.VITE_URL_IMAGES || '/src/assets/product-image';
    
    if (basePath.startsWith('/')) {
      const imagePath = `${basePath}/${url}`;
      
      try {
        return new URL(imagePath, import.meta.url).href;
      } catch {
        return imagePath;
      }
    }
    
    return `${basePath}/${url}`;
  } catch {
    return noImage;
  }
}
