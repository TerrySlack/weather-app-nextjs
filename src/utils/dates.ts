// Using Intl.DateTimeFormat()
export const getDateFromMilliseconds = (milliseconds: number) =>
  new Date(milliseconds).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
  });

// Replace the space in the dateTime string with 'T' to make it ISO 8601 compatible
export const getDateTime = (dateTime: string) =>
  new Date(dateTime.replace(" ", "T")).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
  });
