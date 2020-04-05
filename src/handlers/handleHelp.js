import { makeGetter, makeTextHandler } from './makeTextHandler';

export const getHelpText = makeGetter('resources/help/help.md');

export const handleHelp = makeTextHandler(getHelpText);

export default handleHelp;
