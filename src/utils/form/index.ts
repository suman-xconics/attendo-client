// utils/form-id-generator.ts

/**
 * Generates consistent form field IDs based on a base form ID
 * @param baseFormId - The base form ID (e.g., "form-rhf-demo")
 * @param fieldName - The field name (e.g., "email", "name")
 * @returns The generated field ID (e.g., "form-rhf-demo-email")
 */
const generateFieldId = (baseFormId: string, fieldName: string): string =>
  `${baseFormId}-${fieldName}`;

/**
 * Type-safe form ID generator with field name validation
 */
export const createTypedFormIdGenerator =
  <T extends Record<string, any>>(baseFormId: string) =>
  (fieldName: keyof T): string =>
    generateFieldId(baseFormId, String(fieldName));
