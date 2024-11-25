export const handleError = (error, fallbackMessage) => {
  console.error(error);
  return fallbackMessage || 'An unexpected error occurred.';
}; 