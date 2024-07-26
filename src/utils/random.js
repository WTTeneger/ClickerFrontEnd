import seedrandom from "seedrandom";

class Random {
    constructor(seed = 'testSeed') {
        this.seed = seed;
        this.myarg = seedrandom(this.seed);
    }

    gen() {
        return this.myarg();
    }
}
export default Random