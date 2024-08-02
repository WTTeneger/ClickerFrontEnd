export const normilezeBalance = (balance = 0, t = ' ') => {
    balance = balance?.toFixed(0) || 0;
    let bal = balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `${t}`)
    return bal;
}
export const normilezeName = (name) => name.split(' ')[0];


export const normilezeTime = (timeInSecond) => {

    let hours = parseInt(Math.floor(timeInSecond / 3600));
    let minutes = parseInt(Math.floor((timeInSecond - hours * 3600) / 60));
    let seconds = parseInt(timeInSecond - hours * 3600 - minutes * 60);
    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;
    return `${hours}:${minutes}:${seconds}`;
}