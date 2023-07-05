export function convertDateToPST(date: string) {
  return new Date(date).toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
  });
}
