export const toMonospaced = (text) => `
\`\`\`md
${text}
\`\`\`
`;

export const trimToLength = (str, length = 30) =>
  str.length <= length ? str : `${str.substring(0, length - 3)}...`;

export const resolvePlaying = (text, playing) =>
  playing ? `**[ ${text} ]**` : text;

export const formatQueue = (queue) =>
  queue.length
    ? toMonospaced(
    [
      '# FILA',
      ...queue.map(
        ({ index, song, playing }) => `${index}. ${resolvePlaying(
          trimToLength(song, 50),
          playing,
        )}`,
      ),
    ].join('\n').trim(0, 1800),
    )
    : 'num tem nd nau';

export default { formatQueue };
