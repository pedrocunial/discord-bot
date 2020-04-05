import sendMessage, { sendError } from 'common/sendMessage';
import { DiscordError } from 'common/error';

export class MusicHandler {
  constructor(makeSongQueue, messageFormatter) {
    this.makeSongQueue = makeSongQueue;
    this.messageFormatter = messageFormatter;
    this.guildQueues = {};
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

  getGuildId = (message) => message?.guild?.id;

  getOrCreateGuildQueue = (guildId) => {
    if (!this.guildQueues.hasOwnProperty(guildId)) {
      this.guildQueues[guildId] = this.makeSongQueue();
    }

    return this.guildQueues[guildId];
  };

  getGuildQueue = (guildId) => {
    if (!this.guildQueues.hasOwnProperty(guildId)) {
      throw new DiscordError(
        'nem to nesse mano ai pra da skip po kkk',
        'not in guild'
      );
    }

    return this.guildQueues[guildId];
  };

  getGuildQueueFromMessage = (message) =>
    this.getGuildQueue(this.getGuildId(message));

  skipSong = (message) => {
    try {
      this.getGuildQueueFromMessage(message).nextSong(message);
    } catch (err) {
      console.error('[MusicHandler]#skip');
      sendError(message, err);
    }
  };

  addSong = async (message, song, random = false) => {
    const voiceChannel = this.getVoiceChannel(message);
    this.checkPermissions(voiceChannel, message);
    const guildId = this.getGuildId(message);

    await this.getOrCreateGuildQueue(guildId).pushSong(song, message, random);
  };

  clearQueue = (message) => {
    try {
      this.getGuildQueueFromMessage(message).clearQueue(message);
      this.removeQueueAndLeave(message);
    } catch (error) {
      console.error('[MusicHandler]#clearQueue');
      sendError(message, error);
    }
  };

  showQueue = (message) => {
    try {
      sendMessage(
        message,
        this.messageFormatter.formatQueue(
          this.getGuildQueueFromMessage(message).getQueue()
        )
      );
    } catch (err) {
      console.error('[MusicHandler]#showQueue');
      sendError(message, err);
    }
  };

  removeSong = (message, content) => {
    let songQueue;
    try {
      songQueue = this.getGuildQueueFromMessage(message);
    } catch (e) {
      console.error('[MusicHandler]#removeSong');
      sendError(message, e);
      return;
    }

    if (content.length === 1) {
      songQueue.removeCurrent(message);
    } else {
      const index = +content[1];
      songQueue.removeAt(message, index); // rip immutability
    }

    if (songQueue.isEmpty()) {
      this.removeQueueAndLeave(message);
    } else {
      this.showQueue(message);
    }
  };

  jumpToSong = (message, content) => {
    let songQueue;
    try {
      songQueue = this.getGuildQueueFromMessage(message);
    } catch (e) {
      console.error('[MusicHandler]#jumpToSong');
      sendError(message, e);
      return;
    }

    if (content.length === 1) {
      return sendMessage(message, 'aprende a usar o programa duh');
    }

    const index = +content[1];
    songQueue.jumpToSong(index, message);
  };

  removeQueueAndLeave = (message) => {
    const guildId = this.getGuildId(message);
    const { [guildId]: deleted, ...rest } = this.guildQueues;
    this.guildQueues = rest;
    sendMessage(message, 'até mais amiguinhos');
    this.getVoiceChannel(message).leave();
  };
}

export default MusicHandler;
