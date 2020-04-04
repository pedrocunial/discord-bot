import ytdl from 'ytdl-core';
import youtubeSearch from 'youtube-search';
import { isURL } from 'common/stringUtils';

export class YoutubeService {
  constructor(apiKey) {
    this.ready = false;
    this.baseConfig = {
      maxResults: 10,
      key: apiKey,
      type: 'video',
      part: 'snippet',
    };
  }

  searchVideo = (keywords, onVideoFound, onFailure) => {
    const searchQuery = keywords.join(' ');
    console.log('searchQuery', searchQuery);
    const options = {
      ...this.baseConfig,
      q: keywords.join(' '),
    };

    youtubeSearch(searchQuery, options, async (err, data) => {
      if (err) throw err;

      console.log(data);
      const url = data?.[0]?.link;
      if (url) {
        onVideoFound(await this.getSong(url));
      } else {
        onFailure(keywords);
      }
    });
  };

  resolveSong = async (songData, onSongFound, onFailure = () => {}) => {
    if (!songData.length) {
      console.error('no songData');
      return;
    }

    if (isURL(songData[0])) {
      return onSongFound(await this.getSong(songData[0]), onFailure);
    }

    return this.searchVideo(songData, onSongFound, onFailure);
  };

  getSong = async (songInfo) => {
    const { title, video_url: url } = await ytdl.getInfo(songInfo);
    console.log('got song', { title, url });

    return { title, url };
  };

  playSong = (songUrl) => {
    console.log('playing song', songUrl);
    return ytdl(songUrl);
  };
}

export default YoutubeService;
