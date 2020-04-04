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
      playing: false,
    };
    this._currentSong = 0;
  }

  get currentSong() {
    return this._currentSong;
  }

  set currentSong(index) {
    const { songs } = this.songQueue;
    const queueSize = songs.length;
    const newValue = index % queueSize;

    this._currentSong = newValue;
  }

  nextSong = (message) => {
    this.currentSong = this.currentSong + 1;
    this.playSong(this.currentSong, message);
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

    const song = songs[this.currentSong];
    const dispatcher = connection
      .play(this.musicBackend.playSong(song.url))
      .on('finish', () => this.nextSong(message))
      .on('error', (error) => console.error('playsong error', error));

    dispatcher.setVolumeLogarithmic(this.songQueue.volume / 5);
    sendMessage(message, `tocando: **${song.title}** `);

    return this;
  };

  pushSong = async (song, message) => {
    const prevState = { ...this.songQueue };
    const { songs: prevSongs } = this.songQueue;
    const songObj = await this.musicBackend.getSong(song);
    const songs = [...prevSongs, songObj];
    const voiceChannel = message.member?.voice?.channel;
    this.songQueue = {
      ...this.songQueue,
      songs,
      playing: true,
      textChannel: message.channel,
      voiceChannel,
    };

    if (!this.songQueue.connection && voiceChannel) {
      try {
        this.songQueue.connection = await voiceChannel.join();
        this.playSong(this.currentIndex, message);
      } catch (err) {
        console.error('[SongQueue] pushSong.try-catch faile');
        console.error(err);
        this.songQueue = prevState;
      }
    }

    sendMessage(message, `adicionei a ${songObj.title} na fila`);
    return this;
  };
}

export default SongQueue;
