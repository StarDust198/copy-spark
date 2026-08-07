// Template titles are stored in the form they take mid-sentence, so consumers
// that render one standalone (headings, page metadata) raise the first letter.
export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
