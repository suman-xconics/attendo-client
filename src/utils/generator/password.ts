export const generateStrongPassword = (length = 6): string => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$&*";
  const lower = 26;
  const upper = 52;
  const num = 62;

  // Ensure minimum length of 4 (one of each type)
  const finalLength = Math.max(length, 4);

  let password = "";

  // Guarantee one of each character type
  password += chars.charAt(Math.floor(Math.random() * lower)); // lowercase
  password += chars.charAt(Math.floor(Math.random() * (upper - lower)) + lower); // uppercase
  password += chars.charAt(Math.floor(Math.random() * (num - upper)) + upper); // number
  password += chars.charAt(
    Math.floor(Math.random() * (chars.length - num)) + num
  ); // special

  // Fill remaining characters with random selection
  for (let i = 4; i < finalLength; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};
