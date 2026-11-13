/**
 * Subida directa de imágenes desde el Frontend hacia Cloudinary usando Upload Preset no firmado (appsalon2026).
 * Incluye validación de tipo MIME (JPG, PNG, WEBP) y tamaño máximo de 5MB del lado del cliente.
 */

export const CLOUDINARY_CLOUD_NAME = 't0fuh1i2';
export const CLOUDINARY_UPLOAD_PRESET = 'appsalon2026';

export async function uploadImageToCloudinary(file: File): Promise<{ url: string; public_id: string }> {
  // 1. Validación de Tipo MIME en Frontend
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Formato no permitido. Solo se aceptan imágenes JPG, PNG o WEBP.');
  }

  // 2. Validación de Tamaño Máximo (5MB) en Frontend
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('El archivo excede el tamaño máximo permitido de 5MB.');
  }

  // 3. Subida directa a API de Cloudinary sin pasar por Backend
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || 'Error al subir la imagen a Cloudinary');
  }

  return {
    url: data.secure_url,
    public_id: data.public_id,
  };
}
