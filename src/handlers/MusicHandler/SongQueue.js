import sendMessage from 'common/sendMessage';

export class SongQueue {
  constructor(musicBackend) {
    this.musicBackend = musicBackend;
    this.songQueue = {
      textChannel: null,
      voiceChannel: null,
      connection: null,
      songs: [],
      volume: 5,
    };
    this._currentSong = 0;
  }

  get currentSong() {
    return this._currentSong;
  }

  set currentSong(index) {
    const { songs } = this.songQueue;
    const queueSize = songs.length;
    this._currentSong = queueSize ? index % queueSize : 0;
  }

  hasSongs = () => !!this.songQueue.songs.length;

  isEmpty = () => !this.songQueue.songs.length;

  nextSong = (message) => {
    if (this.hasSongs()) {
      this.currentSong = this.currentSong + 1;
      this.playSong(this.currentSong, message);
    }
  };

  jumpToSong = (index, message) => {
    if (index >= this.songQueue.songs.length) {
      console.error('trying to access index out of bounds');
      return sendMessage(message, 'indexOutOfBoundsException');
    }
    this.currentSong = index;
    this.playSong(index, message);
  };

  playSong = (index, message) => {
    const { songs, connection } = this.songQueue;

    if (songs.length <= index) {
      console.error(
        'tried acessing song of humoungous index',
        songs.length,
        index
      );
      return;
    }

    if (!connection) {
      console.error('no connection');
      return;
    }

    const song = songs[index];
    const dispatcher = connection
      .play(this.musicBackend.playSong(song.url))
      .on('finish', () => this.nextSong(message))
      .on('error', (error) => {
        console.error('playsong error', error);
        this.removeCurrent(message);
      });

    dispatcher.setVolumeLogarithmic(this.songQueue.volume / 5);
    sendMessage(message, `tocando: **${song.title}** `);

    return this;
  };

  shouldStartPlaying = (voiceChannel) =>
    (!this.songQueue.connection || this.songQueue.songs.length === 1) &&
    voiceChannel;

  resolveSearch = async (songObj, message) => {
    const prevState = { ...this.songQueue };
    const { songs: prevSongs } = this.songQueue;
    const songs = [...prevSongs, songObj];
    const voiceChannel = message.member?.voice?.channel;
    this.songQueue = {
      ...this.songQueue,
      songs,
      textChannel: message.channel,
      voiceChannel,
    };

    if (this.shouldStartPlaying(voiceChannel)) {
      try {
        this.songQueue.connection =
          this.songQueue.connection ?? (await voiceChannel.join());
        this.playSong(this.currentSong, message);
      } catch (err) {
        console.error('[SongQueue] pushSong.try-catch faile');
        console.error(err);
        this.songQueue = prevState;
      }
    }

    sendMessage(message, `adicionei a ${songObj.title} na fila`);
    return this;
  };

  pushSong = async (song, message) => {
    try {
      const result = await this.musicBackend.resolveSong(song);
      this.resolveSearch(result, message);
    } catch (err) {
      sendMessage(message, err.discordMessage ?? 'nun deu');
    }
  };

  clearState = () => {
    this.songQueue.songs = [];
    this.songQueue.connection?.dispatcher?.end?.();
    this.currentSong = 0;
  };

  clearQueue = (message) => {
    if (!message?.member?.voice?.channel) {
      sendMessage(message, 'nem to tocando po');
    }

    sendMessage(message, 'limpano a fila');
    this.clearState();
  };

  getQueue = () =>
    this.songQueue.songs?.map((song, index) => ({
      index,
      song: song.title,
      playing: index === this.currentSong,
    }));

  removeCurrent = (message) => {
    return this.removeAt(message, this.currentSong);
  };

  removeAt = (message, index) => {
    if (index >= this.songQueue?.songs?.length) {
      sendMessage(message, 'indexOutOfBounds exception');
    }

    const removedSongDiff = this.currentSong - index;
    const songs = this.songQueue.songs;
    this.songQueue.songs = [
      ...songs.slice(0, index),
      ...songs.slice(index + 1),
    ];

    if (this.songQueue.songs.length === 0) {
      this.clearQueue(message);
      return;
    }

    if (removedSongDiff === 0) {
      this.currentSong = this.currentSong; // fix last song scenario
      this.playSong(this.currentSong, message);
    } else if (removedSongDiff > 0) {
      this.currentSong--;
    }
  };
}

export default SongQueue;
