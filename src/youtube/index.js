import ytdl from 'ytdl-core';
import ytsr from 'ytsr';
import youtubeSearch from 'youtube-search';
import { DiscordError } from 'common/error';
import { getUrlFromResult } from 'common/ytsrUtils';
import { randomArray } from 'common/random';

export class YoutubeService {
  constructor(apiKey) {
    this.ready = false;
    this.baseConfig = {
      maxResults: 1,
      key: apiKey,
      type: 'video',
    };
  }

  /*
   * @deprecated since implementation of ytsr
   * */
  legacySearch = (searchQuery, options, onVideoFound, onFailure, keywords) => {
    youtubeSearch(searchQuery, this.baseConfig, async (err, data) => {
      if (err) {
        console.log('====');
        console.error('[YoutubeService] youtubeSearch failed ');
        console.log(err.response.data.error);
        console.log('====');
        onFailure(
          err?.response?.data?.error?.message ?? 'acabo a brincadera ;-;'
        );
        return;
      }

      console.log(data);
      const url = data?.[0]?.link;
      if (url) {
        onVideoFound(await this.getSong(url));
      } else {
        onFailure(keywords);
      }
    });
  };

  searchVideo = async (keywords, limit = 5, selector = (arr) => arr?.[0]) => {
    const searchQuery = keywords.join(' ');
    console.log('searchQuery', searchQuery);

    const videoPayload = await ytsr(searchQuery, { limit });
    const videoUrl = getUrlFromResult(videoPayload, selector);
    if (!videoUrl) {
      throw new DiscordError('nun achei nd n mein', 'No video found for url');
    }

    console.log('found and searching video with url ', videoUrl);
    return await this.getSong(videoUrl);
  };

  resolveSong = async (songData, random = true) => {
    if (!songData.length) {
      console.error('no songData');
      return;
    }

    if (ytdl.validateURL(songData[0])) {
      console.log('[YoutubeService]#resolveSong validUrl');
      return await this.getSong(songData[0]);
    }

    console.log('[YoutubeService]#resolveSong invalidUrl');
    return await (random
      ? this.searchVideo(songData, 50, randomArray)
      : this.searchVideo(songData));
  };

  getSong = async (songInfo) => {
    console.log('getSong', songInfo);
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
