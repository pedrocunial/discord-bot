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

  const startServices = ({ discordToken, googleToken }) => {
    client.login(discordToken);
    handler = makeHandler(
      new MusicHandler(
        new SongQueue(new YoutubeService(googleToken)),
        messageFormatter,
      ),
    );
  };

  client.once('ready', () => {
    console.log('Logged');
  });

  client.on('message', async (msg) => {
    const { content, author } = msg;

    if (author.bot || !content.startsWith(prefix)) return;

    handler?.(content.slice(1), msg);
  });

  if (process.env.DISCORD_TOKEN && process.env.GOOGLE_API_TOKEN) {
    startServices({
      discordToken: process.env.DISCORD_TOKEN,
      googleToken: process.env.GOOGLE_API_TOKEN,
    });
  } else {
    fs.readFile('secrets/secrets.json', 'utf8', (err, data) => {
      if (err) throw err;

      const { token: discordToken, googleApiKey: googleToken } = JSON.parse(
        data,
      );
      startServices({ discordToken, googleToken });
    });
  }
};

init();
