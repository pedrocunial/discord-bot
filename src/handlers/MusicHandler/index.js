import sendMessage from 'common/sendMessage';

export class MusicHandler {
  constructor(songQueue, messageFormatter) {
    this.songQueue = songQueue;
    this.messageFormatter = messageFormatter;
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
    console.log('skip');
    this.songQueue.nextSong(message);
  };

  addSong = async (message, song) => {
    const voiceChannel = this.getVoiceChannel(message);
    this.checkPermissions(voiceChannel, message);
    await this.songQueue.pushSong(song, message);
  };

  clearQueue = (message) => {
    this.songQueue.clearQueue(message);
  };

  showQueue = (message) => {
    sendMessage(
      message,
      this.messageFormatter.formatQueue(this.songQueue.getQueue()),
    );
  };
}

export default MusicHandler;
