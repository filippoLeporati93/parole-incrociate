import * as express from "express";

const router = express.Router();

router.get("/", function (req: any, res: any, next: any) {
    res.status(200).json({ status: true });
});

module.exports = router;
