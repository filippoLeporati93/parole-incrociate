import random
from copy import deepcopy

ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
ncols = 5
nrows = 5

class Engine:
    def __init__(self, grid, letter = None) -> None:
        self.grid = grid
        self.letter = letter
        self.wordlist = self.get_wordlist("C:\\Users\\Filippo\\Desktop\\Beagle\\Parole Incrociate\\parole-incrociate\\rest\\engine\\engine\\word_storage\\280000_parole_italiane.txt")
    
    def show_grid_text(self, grid):
        """Output a text version of the filled grid wordsearch."""
        for irow in range(nrows):
            print(' | '.join(grid[irow]))

    def fill_grid_randomly(self, grid):
        """Fill up the empty, unmasked positions with random letters."""
        for irow in range(nrows):
            for icol in range(ncols):
                if grid[irow][icol] == ' ':
                    grid[irow][icol] = random.choice(ALPHABET)
                    return

    def is_grid_complete(self, grid):
            for row in grid:
                if ' ' in row:
                    return False
            return True

    def grid_as_svg(self, delta_grid, delta_letter):
        width, height = 1000, 1414
        """Output the SVG preamble, with styles"""

        svg =  """<?xml version="1.0" encoding="utf-8"?>
        <svg xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" width="{}" height="{}" >
        <defs>
        <style type="text/css"><![CDATA[
        line, path {{
        stroke: black;
        stroke-width: 4;
        stroke-linecap: square;
        }}fs
        path {{
        fill: none;
        }}

        text {{
        font: bold 24px Verdana, Helvetica, Arial, sans-serif;
        }}

        ]]>
        </style>
        </defs>
        """.format(width, height)

        """Return the wordsearch grid as a sequence of SVG <text> elements."""

        # A bit of padding at the top.
        YPAD = 20
        # There is some (not much) wiggle room to squeeze in wider grids by
        # reducing the letter spacing.
        letter_width = min(32, width / ncols)
        grid_width = letter_width * ncols
        # The grid is centred; this is the padding either side of it.
        XPAD = (width - grid_width) / 2
        letter_height = letter_width
        grid_height = letter_height * nrows
        s = []

        # Output the grid, one letter at a time, keeping track of the y-coord.
        y = YPAD + letter_height / 2
        for irow in range(nrows):
            x = XPAD + letter_width / 2
            for icol in range(ncols):
                letter = delta_grid[irow][icol]
                if letter != ' ':
                    s.append('<text x="{}" y="{}" text-anchor="middle">{}</text>'
                                    .format(x, y, letter))
                x += letter_width
            y += letter_height

        # We return the last y-coord uzed, to decide where to put the word list.
        svg = svg + '\n'.join(s) \
            + '<text x="{}" y="{}" text-anchor="middle" class="wordlist">{}</text>'.format(width * 0.25, 25, delta_letter) \
            + '</svg>'

        return svg

    def get_delta_matrix(self, original_grid, grid):
        delta_char = {
            "value": "",
            "location": (),
        }
        delta_grid = deepcopy(original_grid)
        for r in range(nrows):
            for c in range(ncols):
                if delta_grid[r][c] != grid[r][c] and delta_char['value'] == '':
                    delta_grid[r][c] = grid[r][c]
                    delta_char['value'] = grid[r][c]
                    delta_char['location'] = (r, c)
        return delta_grid, delta_char   


    def get_wordlist(self, wordlist_filename):
        """Read in the word list from wordlist_filename."""
        wordlist = []
        with open(wordlist_filename) as fi:
            for line in fi:
                # The word is upper-cased and comments and blank lines are ignored.
                line = line.strip().upper()
                if not line or line.startswith('#'):
                    continue
                wordlist.append(line)
        wordlist = [x for x in wordlist if len(x) <= 5 and len(x) > 1]
        random.shuffle(wordlist)
        wordlist = sorted(wordlist, key=lambda w: len(w), reverse=True)
        return wordlist

    def make_wordsearch(self, nrows, ncols, wordlist):
        """Attempt to make a word search with the given parameters."""

        def test_candidate(irow, icol, dx, dy, word):
            """Test the candidate location (icol, irow) for word in orientation
            dx, dy)."""                
            grid_word = ""
            mask_word = word
            for j in range(len(word)):
                if self.grid[irow][icol] not in (' ', word[j]):
                    return False
                grid_word = grid_word + self.grid[irow][icol]
                if self.grid[irow][icol] in word[j]:
                    mask_word = mask_word[:j] + '*' + mask_word[j + 1:]
                irow += dy
                icol += dx
                
            if word == grid_word:
                return False
            
            if self.letter not in mask_word:
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
            if self.letter not in word:
                continue
            if place_word(word):
                return self.grid
    
        self.fill_grid_randomly(self.grid)
        return self.grid

    
    def calculate_results(self):

        results =  {
            "points": 0,
            "words": [],
        }

        def compute_points_by_direction(search_array, direction):
            for idx, word in enumerate(search_array):
                input = word
                stop_search = False
                while not stop_search:
                    count_mask_char = input.count('*')
                    filter_wordlist = [x for x in self.wordlist if len(x) <= len(x) - count_mask_char]
                    old_masked_chars = count_mask_char
                    new_masked_chars = count_mask_char
                    for word_to_search in filter_wordlist:
                        first_index = input.find(word_to_search)
                        if first_index >= 0:
                            results['words'].append({
                                "word": word_to_search,
                                "direction": direction,
                                "location": (idx, first_index) if direction == 'dx' else (first_index, idx)
                            })
                            len_word_to_search = len(word_to_search)
                            results['points'] = results['points'] + len_word_to_search
                            new_masked_chars = new_masked_chars + len_word_to_search
                            input = input.replace(word_to_search, '*'*len_word_to_search, 1)
                            
                    stop_search = True if new_masked_chars - old_masked_chars == 0 else False

        """Compute list of word in matrix"""
        words_rows = [''] * nrows
        words_columns = [''] * ncols
        for irow, row in enumerate(self.grid):
            for icol, col in enumerate(row):
                if not words_rows[irow]:
                    words_rows[irow] = ''
                words_rows[irow] = words_rows[irow] + col
                if not words_columns[icol]:
                    words_columns[icol] = ''
                words_columns[icol] = words_columns[icol] + col

        
        compute_points_by_direction(words_rows, "dx")
        compute_points_by_direction(words_columns, "dy")

        return results


    def compute_next_grid(self):
        original_grid = deepcopy(self.grid)
        new_grid = self.make_wordsearch(nrows, ncols, self.wordlist)
        delta_grid, delta_letter = self.get_delta_matrix(original_grid, new_grid)
        return delta_grid, delta_letter