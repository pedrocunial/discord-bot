import { randomArray } from 'common/random';
import sendMessage from 'common/sendMessage';
import { makeGetter, makeTextHandler } from './makeTextHandler';

const sendPythonMeme = (payload, pythonMemes) => {
  sendMessage(payload, randomArray(pythonMemes));
};

const getPythonTexts = makeGetter('resources/copy-pastas/python.txt', (text) =>
  text.split('\n'),
);

export const handlePython = makeTextHandler(getPythonTexts, sendPythonMeme);

export default handlePython;
