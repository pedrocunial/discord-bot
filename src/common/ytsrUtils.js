export const getUrlFromResult = (result) => result
  ?.items
  ?.filter?.((item) => item.type === 'video')
  ?.[0]
  ?.link;
