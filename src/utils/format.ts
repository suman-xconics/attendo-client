
export function formatStringUnderscoreToSpace(text: string | null | undefined): string {
  if (!text) return "";

  return text.replace(/_/g, " ");
}
export function addUnderscoreToStringSpace(text: string | null | undefined): string {
  if (!text) return "";

  try {
    return text.trim().replace(/\s+/g, "_");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("addUnderscoreToStringSpace error:", err.message, err.stack);
    }
    return String(text);
  }
}

export function formatStringAnyToCapitalized(text: string | null | undefined): string {
  if (!text) return "";

  return text
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}


export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {},
  showTime = false
) {
  if (!date) {
    return "";
  }

  try {
    const formatOptions: Intl.DateTimeFormatOptions = {
      month: opts.month ?? "short",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    };

    if (showTime) {
      formatOptions.hour = opts.hour ?? "2-digit";
      formatOptions.minute = opts.minute ?? "2-digit";
    }

    return new Intl.DateTimeFormat("en-US", formatOptions).format(
      new Date(date)
    );
  } catch (_err) {
    return "";
  }
}

/**
 * Utility functions for formatting data during export operations
 */

/**
 * Format ISO timestamp to readable date format (DD/MM/YYYY hh:mm A)
 */
export function formatTimestampToReadable(timestamp: string | null | undefined | Date): string {
  if (!timestamp) return "";

  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return String(timestamp);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  } catch {
    return String(timestamp);
  }
}

/**
 * Format ISO date to readable date format (DD/MM/YYYY)
 */
export function formatDateToReadable(date: string | null | undefined | Date): string {
  if (!date) return "";

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return String(date);

    return dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  } catch {
    return String(date);
  }
}

/**
 * Format currency values with proper symbol and formatting
 */
export function formatCurrency(amount: number | string | null | undefined, currency = "INR"): string {
  if (amount === null || amount === undefined || amount === "") return "";

  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return String(amount);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2
  }).format(numericAmount);
}


/**
 * Format numbers with thousand separators
 */
export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";

  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numericValue)) return String(value);

  return new Intl.NumberFormat("en-US").format(numericValue);
}

/**
 * Capitalize first letter of each word
 */
export function formatToTitleCase(text: string | null | undefined): string {
  if (!text) return "";

  return text.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Format boolean values to human-readable text
 */
export function formatBoolean(value: boolean | string | null | undefined, options = { true: "Yes", false: "No" }): string {
  if (value === null || value === undefined) return "";

  const boolValue = typeof value === "string" ? value.toLowerCase() === "true" : Boolean(value);
  return boolValue ? options.true : options.false;
}

/**
 * Format phone numbers to a standard format
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "";

  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");

  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  // Return original if not standard length
  return phone;
}

/**
 * Truncate long text with ellipsis
 */
export function formatTruncatedText(text: string | null | undefined, maxLength = 50): string {
  if (!text) return "";

  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}