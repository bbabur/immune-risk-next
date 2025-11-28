// Input validation and sanitization utilities

export function sanitizeString(input: string): string {
  if (!input) return '';
  
  // Remove potential SQL injection patterns
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/['";]/g, '') // Remove quotes and semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comments
    .replace(/\*\//g, '')
    .trim();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUsername(username: string): boolean {
  // Only allow alphanumeric, underscore, and hyphen
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username);
}

export function validatePassword(password: string): boolean {
  // At least 6 characters
  return password.length >= 6;
}

export function sanitizeForSQL(input: any): string | number | boolean | null {
  if (input === null || input === undefined) return null;
  
  // If it's a number, return as is
  if (typeof input === 'number') return input;
  
  // If it's a boolean, return as is
  if (typeof input === 'boolean') return input;
  
  // If it's a string, sanitize it
  if (typeof input === 'string') {
    // Prisma already handles SQL injection via parameterized queries,
    // but we still sanitize for extra safety
    return input.trim();
  }
  
  return null;
}

// Rate limiting helper
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 60000 // 1 minute
): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(identifier) || [];
  
  // Remove old timestamps
  const recentTimestamps = timestamps.filter(ts => now - ts < windowMs);
  
  if (recentTimestamps.length >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  recentTimestamps.push(now);
  rateLimitMap.set(identifier, recentTimestamps);
  
  return true;
}

// XSS protection
export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Validate file uploads
export function validateFileUpload(filename: string, allowedExtensions: string[]): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? allowedExtensions.includes(ext) : false;
}

// Prevent path traversal
export function sanitizePath(path: string): string {
  return path.replace(/\.\./g, '').replace(/[/\\]/g, '');
}

