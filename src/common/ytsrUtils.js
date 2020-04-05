export const getUrlFromResult = (result, selector) =>
  selector(result?.items?.filter?.((item) => item.type === 'video'))?.link;
