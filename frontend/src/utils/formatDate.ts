// ./utils/formatDate.ts

export function formatDate(isoString: string): string {
  const date = new Date(isoString);

  // Example: "Nov 26, 2025, 11:00 PM"
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
