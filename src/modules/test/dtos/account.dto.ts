export const toAccountDto = (account) => {
  return {
    id: account.id,
    name: account.name,
    extraData: {
      id: account.extraData.id,
      name: account.extraData.name,
    },
  };
};
