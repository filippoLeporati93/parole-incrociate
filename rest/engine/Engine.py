import json
import random
from copy import deepcopy

ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
ncols = 5
nrows = 5

def fill_grid_randomly(grid):
    """Fill up the empty, unmasked positions with random letters."""
    for irow in range(nrows):
        for icol in range(ncols):
            if grid[irow][icol] == ' ':
                grid[irow][icol] = random.choice(ALPHABET)
                return

def is_grid_complete(grid):
        for row in grid:
            if ' ' in row:
                return False
        return True

def get_delta_matrix(original_grid, grid):
    first_char = False
    delta_grid = deepcopy(original_grid)
    for r in range(nrows):
        for c in range(ncols):
            if delta_grid[r][c] != grid[r][c] and not first_char:
                delta_grid[r][c] = grid[r][c]
                first_char = True
    return delta_grid          


def get_wordlist(wordlist_filename):
    """Read in the word list from wordlist_filename."""
    wordlist = []
    with open(wordlist_filename) as fi:
        for line in fi:
            # The word is upper-cased and comments and blank lines are ignored.
            line = line.strip().upper()
            if not line or line.startswith('#'):
                continue
            wordlist.append(line)
    wordlist = [x for x in wordlist if len(x) <= 5]
    random.shuffle(wordlist)
    wordlist = sorted(wordlist, key=lambda w: len(w), reverse=True)
    return wordlist

class Engine:
    def __init__(self, grid) -> None:
        self.grid = grid
    
    def show_grid_text(grid):
        """Output a text version of the filled grid wordsearch."""
        for irow in range(nrows):
            print(' | '.join(grid[irow]))

    def _make_wordsearch(self, nrows, ncols, wordlist):
        """Attempt to make a word search with the given parameters."""

        def test_candidate(irow, icol, dx, dy, word):
            """Test the candidate location (icol, irow) for word in orientation
            dx, dy)."""
            grid_word = ""
            for j in range(len(word)):
                if self.grid[irow][icol] not in (' ', word[j]):
                    return False
                grid_word = grid_word + self.grid[irow][icol]
                irow += dy
                icol += dx
                
            if word == grid_word:
                return False
            return True

        def place_word(word):
            # Left, down
            dxdy_choices = [(0,1), (1,0)]
            random.shuffle(dxdy_choices)
            for (dx, dy) in dxdy_choices:
                # Build a list of candidate locations for the word.
                candidates = []
                n = len(word)
                colmax = ncols - n if dx else ncols - 1
                rowmax = nrows - 1 if dx else nrows - n
                for irow in range(0, rowmax + 1):
                    for icol in range(0, colmax + 1):
                        if test_candidate(irow, icol, dx, dy, word):
                            candidates.append((irow, icol))
                # If we don't have any candidates, try the next orientation.
                if not candidates:
                    continue
                # Pick a random candidate location and place the word in this
                # orientation.
                irow, icol = random.choice(candidates)
                for j in range(n):
                    self.grid[irow][icol] = word[j]
                    irow += dy
                    icol += dx
                # We're done: no need to try any more orientations.
                break
            else:
                # If we're here, it's because we tried all orientations but
                # couldn't find anywhere to place the word. Oh dear.
                return False
            # print(word, loc, (dx, dy))
            return True

        # Iterate over the word list and try to place each word (without spaces).
        for word in wordlist:
            word = word.replace(' ', '').replace("'",'')
            if place_word(word):
                # We failed to place word, so bail.
                print('Fitted the word {}'.format(word))
                return self.grid

        return None

    def make_wordsearch(self, nrows, ncols, wordlist):
        """Make a word search, attempting to fit words into the specified grid."""
        grid = self._make_wordsearch(nrows, ncols, wordlist)
        if grid:
            print("Word found")
        else:
            print("Add a random char")
            fill_grid_randomly(grid)
        return grid 


    def compute_next_grid(self):
        original_grid = deepcopy(self.grid)
        wordlist = self.get_wordlist("./word_storage/280000_parole_italiane.txt")
        new_grid = self.make_wordsearch(nrows, ncols, wordlist)
        delta_grid = get_delta_matrix(original_grid, new_grid)
        return delta_grid