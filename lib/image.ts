export function getImageUrl(imagePath: string | undefined) {
  if (!imagePath || imagePath.trim() === "") {
    return "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80";
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
}
