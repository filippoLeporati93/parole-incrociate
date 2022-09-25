import Utils from "../utils/Utils";


export type Matrix = Array<Array<string>>;

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ncols = 5
const nrows = 5

export class Engine {
    grid: Array<Array<string>>;
    letter: {value: string, location: {dx: number, dy: number}};
    wordlist: string[];

    constructor(grid, letter = null) {
        this.grid = JSON.parse(JSON.stringify(grid));

        if (letter !== null) {
            this.letter = letter;
        }
        this.wordlist = this.getWordList("280000_parole_italiane.txt");
    }

    showGridText(grid: Matrix) {
        this.grid.forEach((row) => console.log(row.join(' | ')));
    }

    private fillGridRandomly(grid: Matrix, letter: string) {
        let firstCharPlaced = false
        for(let i = 0; i < grid.length; i++){
            for(let j = 0; j < grid[i].length; j++){
                if (grid[i][j] === " ") {
                    if(firstCharPlaced) {
                        grid[i][j] = ALPHABET.charAt(Math.floor(ALPHABET.length * Math.random()));
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

    private getDeltaMatrix(originalGrid: Matrix, grid: Matrix, letter: string) {
        const deltaChar = {
            value: "",
            location: [],
        }
        const deltaGrid = JSON.parse(JSON.stringify(originalGrid));
        let letterAdded = false;
        for(let r = 0; r < grid.length; r++){
            for(let c = 0; c < grid[r].length; c++){  
                // add opponent letter selected
                if (deltaGrid[r][c] !== grid[r][c] && grid[r][c] === letter && !letterAdded) {
                    deltaGrid[r][c] = grid[r][c]
                    letterAdded = true
                }
                // add new letter selected
                if (deltaGrid[r][c] !== grid[r][c] && deltaChar['value'] === '') {
                    deltaGrid[r][c] = grid[r][c]
                    deltaChar['value'] = grid[r][c]
                    const loc = new Array<number>(2);
                    loc[0] = r;
                    loc[1] = c;
                    deltaChar['location'] = loc;
                }

            }
        }
        return [deltaGrid, deltaChar]
    }

    private getWordList(wordlistFilename: string) {
        const wordlist: string[] = []
        const fs = require('fs');
        const path = require('path');

        const p = __dirname + "/word_storage/" + wordlistFilename;

        const file = fs.readFileSync(p, {encoding:'utf8', flag:'r'})
        
        const lines = file.toString().split("\n")
        for (let line of lines) {
            //The word is upper-cased and comments and blank lines are ignored.
            let word: string = line.trim().toUpperCase();
            wordlist.push(word)
        }
        const wordlist_filter = wordlist.filter((val) => val.length <= 5 && val.length > 1);       
        
        const wordlist_shuffle = Utils.shuffle(wordlist_filter)
        return wordlist_shuffle.sort((a, b) => {
            return b.length - a.length;
        });
    
    };

    private testCandidate(irow: number, icol:number, dx: number, dy: number, word: string) {
        try {
        /* Tet the candidate location (icol, irow) for word in orientation
        dx, dy). */                
        let grid_word = "";
        let mask_word = word;
        for (let j=0; j < word.length; j++) {
            if (this.grid[irow][icol] !== " " && this.grid[irow][icol] !== word.charAt(j))
                return false
            grid_word = grid_word + this.grid[irow][icol]
            if (this.grid[irow][icol] === word.charAt(j))
                mask_word = mask_word.substring(0, j) + '*' + mask_word.substring(j + mask_word.length);
            irow += dy
            icol += dx
        }
        if (word === grid_word)
            return false;
        
        if (mask_word.indexOf(this.letter.value) < 0)
            return false;

        return true;
    }catch (e) {
        console.error(e);
    }
    }

    private placeWord(word: string): boolean {
        // Left, down
        const dxdy_choices = Utils.shuffle([{dx: 0, dy: 1}, {dx: 1, dy: 0}]);
        for (let {dx, dy} of dxdy_choices) {
            // Build a list of candidate locations for the word.
            let candidates = [];
            let n = word.length;
            let colmax = dx ? ncols - n : ncols - 1;
            let rowmax = dx ? nrows - 1 : nrows - n;
            for (let irow = 0; irow < rowmax + 1; irow++) {
                for (let icol = 0; icol < colmax + 1; icol++) {
                    if (this.testCandidate(irow, icol, dx, dy, word))
                        candidates.push({irow: irow, icol: icol})
                }
            }
            // If we don't have any candidates, try the next orientation.
            if (candidates.length === 0)
                continue
            // Pick a random candidate location and place the word in this
            // orientation.
            let {irow, icol} = candidates[Math.floor(candidates.length * Math.random())]
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

    private makeWordSearch(nrows: number, ncols: number, wordlist: string[]) {
        
        for (let word of wordlist) {
            word = word.replace(' ','').replace("'",'');
            if (word.indexOf(this.letter.value) < 0)
                continue;
            if (this.placeWord(word))
                return this.grid;
        }

        this.fillGridRandomly(this.grid, this.letter.value);
        return this.grid;

    }

    private computePointsByDirection(results: any, search_array: string[], direction: string) {
        for (let wordIdx = 0; wordIdx < search_array.length; wordIdx++) {
            let input = search_array[wordIdx];
            let stop_search = false
            while (!stop_search) {
                let count_mask_char = (input.match(/\*/g) || []).length;
                let filter_wordlist = this.wordlist.filter((val) => val.length <= val.length - count_mask_char);
                let old_masked_chars = count_mask_char
                let new_masked_chars = count_mask_char
                for (let i=0; i < filter_wordlist.length; i++) {
                    let word_to_search = filter_wordlist[i];
                    let first_index = input.search(word_to_search)
                    if (first_index >= 0) {
                        results['words'].push({
                            "word": word_to_search,
                            "direction": direction,
                            "location": direction == 'dx' ? [wordIdx, first_index] : [first_index, wordIdx]
                        })
                        let len_word_to_search = word_to_search.length;
                        results['points'] = results['points'] + len_word_to_search
                        new_masked_chars = new_masked_chars + len_word_to_search
                        input = input.replace(word_to_search, '*'.repeat(len_word_to_search))
                    }
                }
                stop_search = new_masked_chars - old_masked_chars == 0 ? true : false;
            }
        }
    }

    calculateResults() {

        const results = {
            points: 0,
            words: []
        }

        // Compute list of word in matrix
        let words_rows = Array(nrows).fill('');
        let words_columns = Array(ncols).fill('');
        for (let irow = 0; irow < this.grid.length; irow++) {
            let row = this.grid[irow];
            for (let icol = 0; icol < row.length; icol++ ) {
                let col = row[icol];
                if (!words_rows[irow])
                    words_rows[irow] = ''
                words_rows[irow] = words_rows[irow] + col
                if (!words_columns[icol])
                    words_columns[icol] = ''
                words_columns[icol] = words_columns[icol] + col
            }
        }

        this.computePointsByDirection(results, words_rows, "dx")
        this.computePointsByDirection(results, words_columns, "dy")

        return results

    }

    computeNextGrid() {
        const originalGrid = JSON.parse(JSON.stringify(this.grid));
        const newGrid = this.makeWordSearch(nrows, ncols, this.wordlist);
        const [deltaGrid, deltaLetter] = this.getDeltaMatrix(originalGrid,newGrid, this.letter.value)
        const gridCompleted = this.isGridComplete(deltaGrid);
        return [deltaGrid, deltaLetter, gridCompleted]
    }

}