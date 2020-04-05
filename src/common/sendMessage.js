export const sendMessage = (discordObject, content) => {
  discordObject?.channel?.send?.(content);
};

export const sendError = (discordObject, discordError) => {
  sendMessage(discordObject, discordError.discordMessage ?? 'na1');
};

export default sendMessage;
