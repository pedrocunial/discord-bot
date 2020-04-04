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
  queue,
  fila,
} from '../constants';
import handlePython from './handlePython';
import handleComissao from './handleComissao';

export const makeHandler = (musicHandler) => async (msg, payload) => {
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
      return await musicHandler.addSong(payload);
    case skip:
      return musicHandler.skipSong(payload);
    case stop:
    case clear:
      return musicHandler.clearQueue(payload);
    case queue:
    case fila:
      return musicHandler.showQueue(payload);
  }
};

export default makeHandler;
