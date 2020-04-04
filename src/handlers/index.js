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
  nightcore,
} from '../constants';
import handlePython from './handlePython';
import handleComissao from './handleComissao';

export const makeHandler = (musicHandler) => async (msg, payload) => {
  console.log(msg);
  const content = msg.split(' ');
  switch (content[0]) {
    case python:
    case pythonzeras:
      return handlePython(payload);
    case comissao:
    case gabs:
      return handleComissao(payload);
    case play:
    case tocar:
    case youtube:
      return await musicHandler.addSong(payload, content.slice(1));
    case skip:
      return musicHandler.skipSong(payload);
    case stop:
    case clear:
      return musicHandler.clearQueue(payload);
    case queue:
    case fila:
      return musicHandler.showQueue(payload);
    case nightcore:
      return await musicHandler.addSong(payload, [
        'nightcore',
        ...content.slice(1),
      ]);
  }
};

export default makeHandler;
