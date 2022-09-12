import * as express from "express";
import { Engine } from "../engine/Engine";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

router.post("/computegrid", (req, res, next) => {
  let grid = req.body.grid;
  let letter = req.body.letter;

  let eng = new Engine(grid, letter)
  const [next_grid, next_letter] = eng.computeNextGrid();
  const responseData = {
    letter: next_letter,
    grid: next_grid,
  }
  res.status(200).json(responseData);
});

router.post("/results", (req, res, next) => {
    let grid = req.body.grid;
    let eng = new Engine(grid);
    const results = eng.calculateResults();

    res.status(200).json(results);
});

module.exports = router;
