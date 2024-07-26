export const normilezeBalance = (balance = 0, t=' ') => balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `${t}`);
export const normilezeName = (name) => name.split(' ')[0];