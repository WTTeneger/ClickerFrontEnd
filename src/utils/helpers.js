export default function onImagesLoad(imageSources, callback) {
  const sources = Array.isArray(imageSources) ? imageSources : [imageSources];

  const imagePromises = sources.map((src) => {
    return new Promise((resolve) => {
      const image = new Image();

      image.src = src;
      image.onload = () => resolve();
      image.onerror = () => resolve(); // Resolve even if image fails to load
    });
  });

  Promise.all(imagePromises).then(() => {
    callback();
  });
}

export async function copyToClipboard(text, callback) {
  try {
    await navigator.clipboard.writeText(text);

    if (typeof callback === 'function') {
      callback();
    }
  } catch (err) {
    console.error('Не удалось скопировать: ', err);
  }
}
