export const isUUID = (text) => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(text);
};

export const createEmptyRootDiv = () => {
  document.body.innerHTML = `<div id="root"></div>`;
};
