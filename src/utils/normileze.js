export const normilezeBalance = (balance = 0, t = ' ') => {
    balance = balance?.toFixed(0) || 0;
    let bal = balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `${t}`)
    return bal;
}
export const normilezeName = (name) => name.split(' ')[0];