export const normilezeBalance = (balance = 0, t = ' ') => {
    balance = balance?.toFixed ? balance?.toFixed(0) : 0;
    let bal = balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `${t}`)
    return bal;
}

export const normilezeName = (name) => name.split(' ')[0];

// 100000 -> 100k
export const normilezeVal = (val) => {
    if (val < 1000) return val;
    if (val < 1000000) return `${(val / 1000).toFixed(0)}k`;
    if (val < 1000000000) return `${(val / 1000000).toFixed(0)}m`;
    return `${(val / 1000000000).toFixed(1)}b`;
}

export const normilezeTime = (timeInSecond) => {
    let hours = parseInt(Math.floor(timeInSecond / 3600));
    let minutes = parseInt(Math.floor((timeInSecond - hours * 3600) / 60));
    let seconds = parseInt(timeInSecond - hours * 3600 - minutes * 60);
    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;
    return `${hours}:${minutes}:${seconds}`;
}

export const normilezeTextLenght = (text, lenght = 15) => {
    return text.length > lenght ? `${text.slice(0, lenght)} ...` : text;
}

export const normilezeAddress = (str) => {
    // первые 4 и последние 4 буквы
    if(!str) return null
    return `${str.slice(0, 4)}...${str.slice(-4)}`

}