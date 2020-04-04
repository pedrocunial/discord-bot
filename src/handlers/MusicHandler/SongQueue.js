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
    const newValue = queueSize ? index % queueSize : 0;

    this._currentSong = newValue;
  }

  hasSongs = () => !!this.songQueue.songs;

  nextSong = (message) => {
    if (this.hasSongs()) {
      console.log('nextsong has songs');
      this.currentSong = this.currentSong + 1;
      this.playSong(this.currentSong, message);
    }
  };

  playSong = (index, message) => {
    const { songs, connection } = this.songQueue;

    if (songs.length <= index) {
      console.error(
        'tried acessing song of humoungous index',
        songs.length,
        index,
      );
    }

    if (!connection) {
      console.error('no connection');
    }

    const song = songs[index];
    console.log(index, song);
    const dispatcher = connection
      .play(this.musicBackend.playSong(song.url))
      .on('finish', () => this.nextSong(message))
      .on('error', (error) => console.error('playsong error', error));

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

    console.log(this.songQueue.songs);

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
    console.log(song);
    await this.musicBackend.resolveSong(
      song,
      (result) => {
        this.resolveSearch(result, message);
      },
      (error) => {
        console.error('[SongQueue] on search failed', error);
        sendMessage(
          message,
          `nao consegui achar uma canção com as palavras ${song.join(' ')}`,
        );
      },
    );
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
    this.songQueue.songs?.map((song, index) => ({ index, song: song.title }));
}

export default SongQueue;
