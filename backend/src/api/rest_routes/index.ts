import * as express from "express";
import { Engine } from "../../game_engine/Engine";
var passport = require('passport');

const router = express.Router();

router.use(passport.authenticate('bearer', { session: false }));

router.get("/", function (req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

router.post("/computegrid", (req, res, next) => {

  let letter = req.body.letter;
  let level = req.body.level;
  if (!req.session.opponentGrid) {
    const matrix = new Array(5);
    for (let i = 0; i < matrix.length; i++) {
      matrix[i] = new Array(5).fill(" ");
    }
    req.session.opponentGrid = matrix;
  }

  let eng = new Engine(req.session.opponentGrid)
  const [next_grid, next_letter, next_grid_completed] = eng.computeNextGrid(level, letter.value);
  req.session.opponentGrid = next_grid;

  const responseData = {
    letter: next_letter,
    grid: next_grid,
    isGridCompleted: next_grid_completed,
  }
  res.status(200).json(responseData);
});

router.post("/resetgame", (req, res, next) => {
  if(req.session.opponentGrid)
    req.session.opponentGrid = null
  
  res.status(200).json();
});

router.post("/results", (req, res, next) => {
  let grid = req.body.grid;
  const opponent = req.query.opponent ?? "false";
  grid = opponent === 'true' && !grid ? req.session.opponentGrid : grid;
  let eng = new Engine(grid);
  const results = {
    ...eng.calculateResults(),
    matrix: grid,
    isOpponent: opponent === 'true' ? true: false
  }
  
  res.status(200).json(results);
});

module.exports = router;
