import { makeGetter, makeTextHandler } from './makeTextHandler';

export const getThomasText = makeGetter('resources/copy-pastas/thomas.txt');

export const handleThomas = makeTextHandler(getThomasText);

export default handleThomas;
