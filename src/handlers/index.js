import { python, pythonzeras, comissao, gabs } from '../constants';
import handlePython from './handlePython';
import handleComissao from './handleComissao';

export const handle = (msg, payload) => {
  switch (msg) {
    case python:
    case pythonzeras:
      return handlePython(payload);
    case comissao:
    case gabs:
      return handleComissao(payload);
  }
};

export default handle;
