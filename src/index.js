import Discord from 'discord.js';
import fs from 'fs';

import { prefix } from './constants';
import handleMessage from './handlers';

const init = () => {
  const client = new Discord.Client();

  client.once('ready', () => {
    console.log('Logged');
  });

  client.on('message', (msg) => {
    const { content } = msg;
    if (content.startsWith(prefix)) {
      handleMessage(content.slice(1), msg);
    }
  });

  fs.readFile('secrets/secrets.json', 'utf8', (err, data) => {
    if (err) throw err;

    const credentials = JSON.parse(data);
    console.log(credentials);
    client.login(credentials.token);
  });
};

init();
