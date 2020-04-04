import Discord from 'discord.js';
import fs from 'fs';

import { prefix } from './constants';
import makeHandler from './handlers';
import YoutubeService from 'youtube';
import MusicHandler from 'handlers/MusicHandler';
import SongQueue from 'handlers/MusicHandler/SongQueue';
import messageFormatter from 'message';

const init = () => {
  const client = new Discord.Client();
  let handler;

  client.once('ready', () => {
    console.log('Logged');
  });

  client.on('message', async (msg) => {
    const { content, author } = msg;

    if (author.bot || !content.startsWith(prefix)) return;

    handler?.(content.slice(1), msg);
  });

  fs.readFile('secrets/secrets.json', 'utf8', (err, data) => {
    if (err) throw err;

    const credentials = JSON.parse(data);
    console.log(credentials);

    client.login(credentials.token);

    handler = makeHandler(
      new MusicHandler(
        new SongQueue(new YoutubeService(credentials.googleApiKey)),
      ),
      messageFormatter,
    );
  });
};

init();
