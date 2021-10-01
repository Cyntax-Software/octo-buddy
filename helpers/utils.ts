export const time = (seconds: number) => {
  return new Date(seconds * 1000).toISOString().substr(11, 8)
};

export const pluralize = (count: number, word: string) => {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}
