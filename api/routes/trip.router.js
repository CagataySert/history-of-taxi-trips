const express = require("express");
const router = express.Router();
const {
  readAll,
  readMaxMinDistanceTravelled,
  readGroupedByYear,
} = require("../controllers/trip.controller");

/* READ all trips by querying db with specified condition. */
router.get("/readAll", readAll);

/* READ max-min distance_travelled trips by specified region and radius. */
router.get("/readMaxMinDistanceTravelled", readMaxMinDistanceTravelled);

/* READ max-min distance_travelled trips by specified region and radius. */
router.get("/readGroupedByYear", readGroupedByYear);

module.exports = router;
