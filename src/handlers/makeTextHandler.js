import fs from 'fs';
import sendMessage from '../common/sendMessage';

export const makeGetter = (filePath, formatter = (k) => k) => {
  let content;

  return (handler) => {
    if (content) handler(content);

    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        throw err;
      }

      const content = formatter(data);
      handler(content);
    });
  };
};

export const makeTextHandler = (getText, sendMessageCallback = sendMessage) => (
  payload,
) => getText((text) => sendMessageCallback(payload, text));

export default makeTextHandler;
