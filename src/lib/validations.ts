// Form validation schemas and utilities

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateContactForm(data: {
  name: string;
  email: string;
  message: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push("Please enter a valid email address");
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters long");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}