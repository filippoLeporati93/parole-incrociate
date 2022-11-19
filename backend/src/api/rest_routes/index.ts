import { odata, RestError, TableClient } from "@azure/data-tables";
import * as express from "express";
import { Engine } from "../../game_engine/Engine";
var passport = require('passport');

const cosmosdb_connstring = process.env.COSMOSDBTABLE_CONNECTIONSTRING ?? "UseDevelopmentStorage=true";
const clientLobby = TableClient.fromConnectionString(
  cosmosdb_connstring,
  'GamerLobby');

const router = express.Router();

router.use(passport.authenticate('bearer', { session: false }));

router.get("/", function (req: any, res: any, next: any) {
  res.status(200).json({ status: true });
});

router.post("/nextturn", (req: any, res: any, next: any) => {
  let letter = req.body.letter;
  let level = req.body.level;

  req.session.letter = letter;
  req.session.level = level;

  res.status(200).json(req.body);
});

router.post("/computegrid", (req: any, res: any, next: any) => {

  if (!req.session.opponentGrid) {
    const matrix = new Array(5);
    for (let i = 0; i < matrix.length; i++) {
      matrix[i] = new Array(5).fill(" ");
    }
    req.session.opponentGrid = matrix;
  }

  let eng = new Engine(req.session.opponentGrid)
  const [next_grid, next_letter, next_grid_completed] = eng.computeNextGrid(req.session.level, req.session.letter.value);
  req.session.opponentGrid = next_grid;

  const responseData = {
    letter: next_letter,
    grid: next_grid,
    isGridCompleted: next_grid_completed,
  }
  res.status(200).json(responseData);
});

router.post("/resetgame", (req: any, res: any, next: any) => {
  if (req.session.opponentGrid)
    req.session.opponentGrid = null

  res.status(200).json();
});

router.post("/results", (req: any, res: any, next: any) => {
  let grid = req.body.grid;
  const opponent = req.query.opponent ?? "false";
  grid = opponent === 'true' && !grid ? req.session.opponentGrid : grid;
  let eng = new Engine(grid);
  const results = {
    ...eng.calculateResults(),
    matrix: grid,
    isOpponent: opponent === 'true' ? true : false
  }

  res.status(200).json(results);
});

router.get("/lobby", async (req: any, res: any, next: any) => {
  // list entities returns a AsyncIterableIterator
  // this helps consuming paginated responses by
  // automatically handling getting the next pages
  const excludeUserName = req.query.excludeUserName ?? '';

  let qo = {}
  if(excludeUserName !== '') {
    qo = { filter: odata`PartitionKey eq 'Users' and RowKey ne ${excludeUserName}` }
  }

  const entities = clientLobby.listEntities({
    queryOptions: qo
  });

  // this loop will get all the entities from all the pages
  // returned by the service
  const users = [];
  for await (const entity of entities) {
    users.push(entity);
  }
  res.status(200).json(users);
});

router.post("/lobby", async (req: any, res: any, next: any) => {
  let user = req.body.user;
  try {
    const entity = await clientLobby.getEntity('Users', user.userName);
    if (entity) {
      res.status(409).json("Users already exists in lobby");
    }
  } catch (e: any) {
    // if content not found create a new entity
    if (e.statusCode === 404) {
      const entity = {
        partitionKey: 'Users',
        rowKey: user.userName,
        userName: user.userName,
        gamePlayed: user.gamePlayed,
        gameWon: user.gameWon,
        percGameWon: user.percGameWon,
      };
      await clientLobby.createEntity(entity);
      res.status(200).json(entity);
    } else {
      res.status(500).json(e);
    }
  }
});

router.delete("/lobby/:userName", async (req: any, res: any, next: any) => {
  let userName = req.params.userName;
  try {
    await clientLobby.deleteEntity('Users', userName);
    res.status(200).json({ userName });
  } catch (e: any) {
    if(e.statusCode === 404) {
      res.status(200).json({});
      return
    }
    res.status(e.statusCode).json(e.message);
  }
});




module.exports = router;
