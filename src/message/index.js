export const toMonospaced = (text) => `
\`\`\`md
${text}
\`\`\`
`;

export const trimToLength = (str, length = 30) =>
  str.length <= length ? str : `${str.substring(0, length - 3)}...`;

export const formatQueue = (queue) =>
  queue.length
    ? toMonospaced(
        [
          '# FILA',
          ...queue.map(
            ({ index, song }) => `${index}. ${trimToLength(song, 25)}`,
          ),
        ].join('\n'),
      )
    : 'num tem nd nau';

export default { formatQueue };
