// export function calculateTimeRemaining(
//   startDate: string,
//   endDate: string
// ): string {
//   const start = new Date(startDate);
//   const end = new Date(endDate);
//   const diffMs = end.getTime() - start.getTime();

//   // Convert milliseconds to total seconds
//   const totalSeconds = Math.floor(diffMs / 1000);

//   // Calculate days, hours, minutes, seconds
//   const days = Math.floor(totalSeconds / (24 * 60 * 60));
//   const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
//   const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
//   const seconds = totalSeconds % 60;

//   // Format as DD:HH:MM:SS
//   return `${days.toString().padStart(2, "0")}:${hours
//     .toString()
//     .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
//     .toString()
//     .padStart(2, "0")}`;
// }

export function calculateTimeRemaining(endDate: string): string {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) return "00:00:00:00";

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return `${days.toString().padStart(2, "0")}:${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function isExpired(endDate: string): boolean {
  const end = new Date(endDate);
  const now = new Date();
  return now > end;
}
