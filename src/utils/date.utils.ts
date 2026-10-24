/**
 * Formatea una fecha en formato legible (DD/MM/YYYY)
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

/**
 * Formatea una fecha y hora en formato legible
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

/**
 * Formatea una hora (HH:MM:SS → HH:MM AM/PM)
 */
export const formatTime = (timeString: string): string => {
  if (!timeString) return '';
  
  try {
    // Si viene en formato HH:MM:SS
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return timeString;
  }
};

/**
 * Devuelve una fecha en formato ISO para inputs de tipo date (YYYY-MM-DD)
 */
export const toISODateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Obtiene la fecha actual en formato ISO
 */
export const getTodayISODate = (): string => {
  return toISODateString(new Date());
};