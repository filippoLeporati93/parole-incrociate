import Utils from "../utils/Utils";


export type Matrix = Array<Array<string>>;

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ncols = 5
const nrows = 5

const levels = [
    {level: 1, wordLength: [2,3,3,3,4]},
    {level: 2, wordLength: [3,4,4,4,5]},
    {level: 3, wordLength: [5]}
]

export class Engine {
    grid: Array<Array<string>>;
    wordlist: string[];

    constructor(grid) {
        this.grid = JSON.parse(JSON.stringify(grid));

        this.wordlist = this.getWordList("280000_parole_italiane.txt");
    }

    showGridText(grid: Matrix) {
        if(grid)
            grid.forEach((row) => console.log(row.join(' | ')));
        else
            this.grid.forEach((row) => console.log(row.join(' | ')));
    }

    private fillGridRandomly(grid: Matrix, letter: string | null) {
        let firstCharPlaced = false
        for(let i = 0; i < grid.length; i++){
            for(let j = 0; j < grid[i].length; j++){
                if (grid[i][j] === " ") {
                    if(firstCharPlaced || !letter) {
                        grid[i][j] = Utils.getRandomElem(Array.from(ALPHABET));
                        return;
                    }
                    else {
                        grid[i][j] = letter;
                        firstCharPlaced = true;
                    }
                }
            }
        }
    }

    private isGridComplete(grid: Matrix) {
        for(let i = 0; i < grid.length; i++){
            for(let j = 0; j < grid[i].length; j++){
                if (grid[i][j] === " ") {
                    return false
                }
            }
        }
        return true;
    }

    private getDeltaMatrix(originalGrid: Matrix, grid: Matrix, letter: string | null) {
        const deltaChar = {
            value: "",
            location: [],
        }
        const deltaGrid = JSON.parse(JSON.stringify(originalGrid));
        let letterAdded = false;
        let newLetters = new Array<{value: string, location: number[]}>();
        for(let r = 0; r < grid.length; r++){
            for(let c = 0; c < grid[r].length; c++){  
                // add opponent letter selected
                if (letter && deltaGrid[r][c] !== grid[r][c] && grid[r][c] === letter && !letterAdded) {
                    deltaGrid[r][c] = grid[r][c];
                    letterAdded = true;
                }
                // add new letter selected
                if (deltaGrid[r][c] !== grid[r][c] && deltaChar.value === '') {
                    newLetters.push({
                        value: grid[r][c],
                        location: [r, c]
                    })
                }  
            }
        }
        // pick random next letter from word selected
        if(newLetters.length > 0) {
            let newLetter = Utils.getRandomElem(newLetters);
            deltaChar.value = newLetter.value;             
            deltaChar.location = newLetter.location;
            deltaGrid[newLetter.location[0]][newLetter.location[1]] = newLetter.value;
        }

        return [deltaGrid, deltaChar]
    }

    private getWordList(wordlistFilename: string) {
        const wordlist: string[] = []
        const fs = require('fs');

        const p = __dirname + "/word_storage/" + wordlistFilename;

        const file = fs.readFileSync(p, {encoding:'utf8', flag:'r'})
        
        const lines = file.toString().split("\n")
        for (let line of lines) {
            //The word is upper-cased and comments and blank lines are ignored.
            let word: string = line.trim().toUpperCase().replace(' ','').replace("'",'');
            if( word.length <= 5 && word.length > 1 )
                wordlist.push(word)
        }

        const wordlist_shuffle = Utils.shuffle(wordlist)
        return wordlist_shuffle.sort((a, b) => b.length - a.length);
    
    };

    private testCandidate(irow: number, icol:number, dx: number, dy: number, word: string, letter: string | null) {
        /* Tet the candidate location (icol, irow) for word in orientation
        dx, dy). */                
        let grid_word = "";
        let mask_word = word;
        let charTraversed = 0;
        for (let j=0; j < word.length; j++) {
            if (this.grid[irow][icol] !== " " && this.grid[irow][icol] !== word.charAt(j))
                return [false, charTraversed];
            grid_word = grid_word + this.grid[irow][icol]
            if (this.grid[irow][icol] === word.charAt(j)) {
                charTraversed++;
                mask_word = mask_word.substring(0, j) + '*' + mask_word.substring(j + 1);
            }
            irow += dy
            icol += dx
        }
        // check if the candidate is not the same word in grid
        if (word === grid_word)
            return [false, charTraversed];
        
        // check if the letter is in the word to place excluding the char already in grid
        if (letter && mask_word.indexOf(letter) < 0)
            return [false, charTraversed];

        return [true, charTraversed];
    }

    private placeWord(word: string, letter: string | null, minCharsTraversed: number): boolean {
        // Left, down
        const dxdy_choices = Utils.shuffle([{dx: 0, dy: 1}, {dx: 1, dy: 0}]);
        for (let {dx, dy} of dxdy_choices) {
            // Build a list of candidate locations for the word.
            let candidates = [];
            let n = word.length;
            let colmax = dx ? ncols - n : ncols - 1;
            let rowmax = dx ? nrows - 1 : nrows - n;
            for (let irow = 0; irow <= rowmax; irow++) {
                for (let icol = 0; icol <= colmax; icol++) {
                    const [isValidCandidate, charsTraversed] = this.testCandidate(irow, icol, dx, dy, word, letter)
                    if (isValidCandidate && charsTraversed >= minCharsTraversed)
                        candidates.push({irow: irow, icol: icol, charsTraversed: charsTraversed})
                }
            }
            // If we don't have any candidates, try the next orientation.
            if (candidates.length === 0)
                continue
            // Pick a random candidate location and place the word in this
            // orientation.
            let {irow, icol} = candidates.sort((a,b) => b.charsTraversed - a.charsTraversed)[0];
            for (let j = 0; j < n; j++) {
                this.grid[irow][icol] = word.charAt(j);
                irow += dy
                icol += dx
            }
            return true
        }
        
        // If we're here, it's because we tried all orientations but
        // couldn't find anywhere to place the word. Oh dear.
        return false
    }


    private computePointsByDirection(results: any, search_array: string[], direction: string) {
        search_array.forEach((input,wordIdx) => {
            for (let word_to_search of this.wordlist) {
                let first_index = input.search(word_to_search)
                if (first_index >= 0) {
                    results['words'].push({
                        "word": word_to_search,
                        "direction": direction,
                        "location": direction == 'dx' ? [wordIdx, first_index] : [first_index, wordIdx]
                    })
                    results['points'] = results['points'] + word_to_search.length;
                    break;
                }
            }
        });
    }

    calculateResults() {

        const results = {
            points: 0,
            words: []
        }

        // Compute list of word in matrix
        let words_rows = Array(nrows).fill('', 0);
        let words_columns = Array(ncols).fill('', 0);
        for (let irow = 0; irow < this.grid.length; irow++) {
            let row = this.grid[irow];
            for (let icol = 0; icol < row.length; icol++ ) {
                let col = row[icol];
                words_rows[irow] = words_rows[irow] + col
                words_columns[icol] = words_columns[icol] + col
            }
        }

        this.computePointsByDirection(results, words_rows, "dx")
        this.computePointsByDirection(results, words_columns, "dy")

        return results

    }

    private nextGrid(level: number, letter: string | null) {
        const wordlist_withletter = letter ? this.wordlist.filter(w => w.indexOf(letter) >= 0) : this.wordlist;
        const lengthWordByLevel = levels.filter(l => l.level === level)[0];
        const wordlist_level = wordlist_withletter.filter(w => w.length <= Utils.getRandomElem(lengthWordByLevel.wordLength))
        
        let wordPlaced = false;
        let minCharsTraversed = 4;
        while(minCharsTraversed >= 0 && !wordPlaced) {
            for (let word of wordlist_level) {
                if (this.placeWord(word, letter, minCharsTraversed)) {
                    wordPlaced = true;
                    break;
                }
            }
            minCharsTraversed--;
        }
        if(!wordPlaced)
            this.fillGridRandomly(this.grid, letter);
    }

    computeNextGrid(level: number, letter: string) {
        let originalGrid = JSON.parse(JSON.stringify(this.grid));
        this.nextGrid(level, letter);
        let [deltaGrid, deltaLetter] = this.getDeltaMatrix(originalGrid, this.grid, letter);
        // generate a new word and letter in case you place only opponent letter
        if(deltaLetter.value === "") {
            originalGrid = JSON.parse(JSON.stringify(this.grid));
            this.nextGrid(level, null);
            [deltaGrid, deltaLetter] = this.getDeltaMatrix(originalGrid, this.grid, null);
        }
        const gridCompleted = this.isGridComplete(deltaGrid);
        return [deltaGrid, deltaLetter, gridCompleted]
    }

}