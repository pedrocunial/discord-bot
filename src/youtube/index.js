import ytdl from 'ytdl-core';

export const getSong = async (songInfo) => {
  const { title, video_url: url } = await ytdl.getInfo(songInfo);
  console.log('got song', { title, url });

  return { title, url };
};

export const playSong = (songUrl) => {
  console.log('playing song', songUrl);
  return ytdl(songUrl);
};

export default { getSong, playSong };
