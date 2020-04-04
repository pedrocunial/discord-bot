export const sendMessage = (discordObject, content) => {
  discordObject?.channel?.send?.(content);
};

export default sendMessage;
