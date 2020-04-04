import { makeGetter, makeTextHandler } from './makeTextHandler';

export const getComissaoText = makeGetter('resources/copy-pastas/comissao.txt');

export const handleComissao = makeTextHandler(getComissaoText);

export default handleComissao;
