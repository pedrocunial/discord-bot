import {
  python,
  pythonzeras,
  comissao,
  gabs,
  play,
  tocar,
  youtube,
  skip,
  stop,
  clear,
} from '../constants';
import handlePython from './handlePython';
import handleComissao from './handleComissao';
import YoutubeHandler from './handleYoutube';

const youtubeHandler = new YoutubeHandler();

export const handle = async (msg, payload) => {
  console.log(msg);
  switch (msg.split(' ')[0]) {
    case python:
    case pythonzeras:
      return handlePython(payload);
    case comissao:
    case gabs:
      return handleComissao(payload);
    case play:
    case tocar:
    case youtube:
      return await youtubeHandler.addSong(payload);
    case skip:
      return youtubeHandler.skipSong(payload);
    case stop:
    case clear:
      return youtubeHandler.clearQueue(payload);
  }
};

export default handle;
