export const isURL = (str) => {
  try {
    new URL(str);
  } catch (err) {
    return false;
  }

  return true;
};
