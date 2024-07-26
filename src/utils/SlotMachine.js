import seedrandom from "seedrandom";
import winCombinations from './combination.js'

export function randomSeed() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


const defaultData = {
    symbols: ['A', 'B', 'C', 'D', 'E', 'X'],
    weights: [47, 28, 10, 7, 3, 1],

    // symbols: ['A', 'B'],
    // weights: [47, 28],
    rows: 3,
    columns: 5,
}


class SlotMachine {
    constructor(
        seed,
        symbols = defaultData.symbols,
        weights = defaultData.weights,
        rows = defaultData.rows,
        columns = defaultData.columns,
        combinations = []) {
        this.seed = seed;
        this.symbols = symbols;
        this.weights = weights;
        this.rows = rows;
        this.columns = columns;
        this.combinations = combinations;
        this.rng = seedrandom(seed);
        this.targetRTP = 0.98 // Return To Player

        // Корректируем веса для достижения RTP
        this.adjustWeightsForRTP();
    }

    // Функция для корректировки весов символов и комбинаций для достижения RTP
    adjustWeightsForRTP() {
        const totalSymbolRTP = this.weights.reduce((acc, weight) => acc + (weight / 100), 0);
        const totalCombinationRTP = this.combinations.reduce((acc, comb) => acc + (comb.weight / 100), 0);
        const totalRTP = totalSymbolRTP + totalCombinationRTP;
        const adjustmentFactor = this.targetRTP / totalRTP;

        // Корректируем веса символов
        let lastWight = this.weights
        this.weights = this.weights.map(weight => Math.round(weight * adjustmentFactor));
        // Корректируем веса комбинаций
        this.combinations.forEach(comb => {
            comb.weight = Math.round(comb.weight * adjustmentFactor);
        });
    }

    // Остальные методы класса остаются без изменений

    // Функция для генерации случайного числа в диапазоне [min, max] на основе seed
    getRandomInt(min, max) {
        return Math.floor(this.rng() * (max - min + 1)) + min;
    }

    // Функция для выбора элемента из массива на основе весов и seed
    weightedRandom(weights) {
        const sumOfWeights = weights.reduce((sum, weight) => sum + weight, 0);
        let rand = Math.floor(this.rng() * sumOfWeights) + 1;
        for (let i = 0; i < weights.length; i++) {
            if (rand <= weights[i]) {
                return i;
            }
            rand -= weights[i];
        }
    }

    // Функция для выбора комбинации на основе весов и seed
    weightedRandomCombination() {
        if (this.combinations.length === 0) {
            return null; // Если список комбинаций пуст, возвращаем null
        }

        const weights = this.combinations.map(comb => comb.weight);
        const index = this.weightedRandom(weights);
        return this.combinations[index];
    }

    // Функция для генерации слотов
    generateSlots() {
        const slots = [];
        for (let i = 0; i < this.rows; i++) {
            const row = [];
            for (let j = 0; j < this.columns; j++) {
                const symbolIndex = this.weightedRandom(this.weights);
                row.push(this.symbols[symbolIndex]);
            }
            slots.push(row);
        }

        // Добавим вероятность выпадения комбинаций, если они заданы
        const combinationObj = this.weightedRandomCombination();
        if (combinationObj) {
            const combination = combinationObj.pattern;
            const combRows = combination.length;
            const combCols = combination[0].length;

            // Проверяем, подходит ли размер комбинации для текущих слотов
            if (combRows <= this.rows && combCols <= this.columns) {
                // Размещаем комбинацию в случайном месте
                const startRow = this.getRandomInt(0, this.rows - combRows);
                const startCol = this.getRandomInt(0, this.columns - combCols);

                for (let r = 0; r < combRows; r++) {
                    for (let c = 0; c < combCols; c++) {
                        if (combination[r][c] !== '*') {
                            slots[startRow + r][startCol + c] = combination[r][c];
                        }
                    }
                }
            }
        }

        return slots;
    }

    restructureCombination(combination) {
        // ---**--*--**---
        // каждый 3й символ - это новая строка
        let total = ''
        let now = ''

        let st = [];
        // поделить combination на массив по 5 символов
        for (let i = 0; i < combination.length; i++) {
            now += combination[i]
            if (now.length === 5) {
                st.push(now.split(''))
                now = ''
            }
        }

        let totalComb = ''
        for (let i = 0; i < combination.length; i++) {
            totalComb += st[i % 3][Math.floor(i / 3)]
        }
        return totalComb;
    }

    // Функция для проверки комбинации на соответствие
    checkCombination(combination, actualData) {
        // Проверяем размеры комбинаций
        const wineDate = []
        if (combination.length !== actualData.length || combination[0].length !== actualData[0].length) {
            return false;
        }

        let strComb = this.combitationToStr(combination);
        let strVal = [];

        // найти уникальные значения
        let uniqueValues = [];
        actualData.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (!uniqueValues.includes(cell)) {
                    uniqueValues.push(cell);
                }
            });
        });

        uniqueValues.forEach((value) => {
            let s = ''
            actualData.forEach((row, i) => {
                row.forEach((cell, j) => {
                    s += cell === value ? '*' : '-';
                });
            });
            strVal.push(s);
            return false;
        });

        let sr = this.restructureCombination(strComb)
        strVal.forEach((str, index) => {
            let countMatch = 0;
            let actualComb = this.restructureCombination(str)

            for (let i = 0; i < strComb.length; i++) {
                if (sr[i] === '*') {
                    if (actualComb[i] === '*') {
                        countMatch++;
                    } else {
                        break;
                    }
                }
            }
            if (countMatch >= 3) {
                wineDate.push({ value: uniqueValues[index], count: countMatch })
            }

        });
        return wineDate
    }

    combitationToStr(combination) {
        let strComb = '';
        combination.forEach((row, i) => {
            row.forEach((cell, j) => {
                strComb += cell === 1 ? '*' : '-'
            });
        });
        return strComb
    }

    checkCombinations(actualData, countLine = 1) {
        // Проверяем каждую заданную комбинацию
        if (!actualData || actualData <= 0) return [];
        let winerDate = []
        for (let i = 0; i < winCombinations.length; i++) {
            const isMatch = this.checkCombination(winCombinations[i], actualData);

            isMatch.forEach((el) => {
                winerDate.push({
                    combination: this.combitationToStr(winCombinations[i]),
                    ...el

                })
            });
        }
        return winerDate;
    }



    // Функция для вывода слотов
    printSlots() {
        const slots = this.generateSlots();
        slots.forEach(row => {
            console.log(row.join(' '));
        });
    }
}

// Пример использования класса
const symbols = ['A', 'B', 'C', 'D', 'E', 'X'];
const weights = [47, 28, 10, 7, 3, 1]; // Проценты выпадения для символов
const rows = 3;
const columns = 5;

const combinations = [
    { pattern: [['A', 'A', 'A']], weight: 2 }, // В одной линии 3 буквы A, шанс 2%
    { pattern: [['A', 'A', 'A'], ['A', 'A', 'A']], weight: 1 }, // В двух линиях 3 буквы A, шанс 1%
    { pattern: [['E', 'E', 'E'], ['E', 'E', 'E'], ['E', 'E', 'E']], weight: 0.1 } // Супер приз - все линии E, шанс 0.1%
];

// const seed = 'your-seed-phrase';
const seed = randomSeed()

const slotMachine = new SlotMachine(seed, symbols, weights, rows, columns, []);
let result = slotMachine.generateSlots();

slotMachine.checkCombinations(result)



slotMachine.restructureCombination('---**--*--**---')

export default SlotMachine;







