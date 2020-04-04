import youtube from '../../youtube';
import sendMessage from 'common/sendMessage';
import SongQueue from './SongQueue';

export class YoutubeHandler {
  constructor() {
    this.songQueue = new SongQueue(youtube);
  }

  getVoiceChannel = (message) => {
    const voiceChannel = message?.member?.voice?.channel;
    if (!voiceChannel) {
      sendMessage(message, 'você precisa estar em um canal po');

      throw new Error('cannot reach voice channel');
    }

    return voiceChannel;
  };

  checkPermissions = (voiceChannel, message) => {
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      sendMessage(message, 'num tenho permissão pra falar nesse canal ;-;');
      throw new Error('unauthorized');
    }
  };

  skipSong = (message) => {
    this.songQueue.nextSong(message);
  };

  addSong = async (message) => {
    const args = message?.content?.split?.(' ');
    if (!args || args.length < 2) {
      console.error('[youtube handler] failed receiving message contents');
    }

    const voiceChannel = this.getVoiceChannel(message);
    this.checkPermissions(voiceChannel, message);
    await this.songQueue.pushSong(args[1], message);
  };
}

export default YoutubeHandler;
