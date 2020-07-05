const Trips = require("../../db/models/trips");
const createCircleByGivenCoordinate = require("../../utils/create.circle.by.given.coordinate");
const statusCodeMessages = require("../../utils/status.codes");
const {
  readAllInputValidator,
  readMaxMinDistanceTravelledInputValidator,
  readGroupedByYearInputValidator,
} = require("../validations/trip.validation");

/**
 * reads all trips by given condition.
 * @param {{long:Number, lat:Number}} start region/coordinate specified by a point (longitude/latitude).
 * @param {Number} radius max radius of distance to point.Radius unit must be km.
 * @param {String} [start_date] optional start date string.
 * @param {String} [complete_date] optional end date string.
 * @return {{status:Boolean, message:String, [trips]:Array}}
 */
const readAll = async (req, res) => {
  try {
    const { start, radius, start_date, complete_date } = req.body;

    const { isValidated, errors } = readAllInputValidator(req.body);

    if (!isValidated) {
      return res.status(400).json({ status: false, message: errors });
    }

    // find furthest coordinates for north,east,south and west by given coordinates and radius.
    const {
      northernmost,
      westernmost,
      southernmost,
      easternmost,
    } = createCircleByGivenCoordinate(start.long, start.lat, radius);

    const result = await Trips.find({
      "start.coordinates.0": {
        $gte: southernmost,
        $lte: northernmost,
      },
      "start.coordinates.1": {
        $gte: westernmost,
        $lte: easternmost,
      },
      ...(start_date && { start_date: new Date(start_date) }), // this syntax was used to adding optional field
      ...(complete_date && { complete_date: new Date(complete_date) }), // this syntax was used to adding optional field
    }).select({ _id: 1, start: 1, end: 1, start_date: 1, complete_date: 1 });

    return res
      .status(200)
      .json({ status: true, trips: result, message: statusCodeMessages[200] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * reads max and min values of distance travelled by using specified point and radius.
 * @param {{long:Number, lat:Number}} start region/coordinate specified by a point (longitude/latitude).
 * @param {Number} radius max radius of distance to point.Radius unit must be km.
 * @return {{status:Boolean, message:String, [max]:number, [min]:number}}
 */
const readMaxMinDistanceTravelled = async (req, res) => {
  try {
    const { start, radius } = req.body;

    const { isValidated, errors } = readMaxMinDistanceTravelledInputValidator(
      req.body
    );

    if (!isValidated) {
      return res.status(400).json({ status: false, message: errors });
    }

    // find furthest coordinates for north,east,south and west by given coordinates and radius.
    const {
      northernmost,
      westernmost,
      southernmost,
      easternmost,
    } = createCircleByGivenCoordinate(start.long, start.lat, radius);

    const result = await Trips.aggregate([
      {
        $match: {
          "start.coordinates.0": {
            $gte: southernmost,
            $lte: northernmost,
          },
          "start.coordinates.1": {
            $gte: westernmost,
            $lte: easternmost,
          },
        },
      },
      {
        $group: {
          _id: null,
          max: { $max: "$distance_travelled" },
          min: { $min: "$distance_travelled" },
        },
      },
    ]);

    // record could not found by specified params
    if (result.length === 0) {
      return res.status(404).json({
        status: false,
        message: statusCodeMessages[404],
      });
    }

    return res.status(200).json({
      status: true,
      max: result[0].max,
      min: result[0].min,
      message: statusCodeMessages[200],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * reads and group records by using specified point, radius and <year> field.
 * @param {{long:Number, lat:Number}} start region/coordinate specified by a point (longitude/latitude).
 * @param {Number} radius max radius of distance to point.Radius unit must be km.
 * @return {{status:Boolean, message:String, [trips]:Array}}
 */
const readGroupedByYear = async (req, res) => {
  try {
    const { start, radius } = req.body;

    const { isValidated, errors } = readGroupedByYearInputValidator(req.body);

    if (!isValidated) {
      return res.status(400).json({ status: false, message: errors });
    }

    // find furthest coordinates for north,east,south and west by given coordinates and radius.
    const {
      northernmost,
      westernmost,
      southernmost,
      easternmost,
    } = createCircleByGivenCoordinate(start.long, start.lat, radius);

    const result = await Trips.aggregate([
      {
        $match: {
          "start.coordinates.0": {
            $gte: southernmost,
            $lte: northernmost,
          },
          "start.coordinates.1": {
            $gte: westernmost,
            $lte: easternmost,
          },
        },
      },
      { $group: { _id: "$year", count: { $sum: 1 } } },
    ]);

    return res.status(200).json({
      status: true,
      trips: result,
      message: statusCodeMessages[200],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  readAll,
  readMaxMinDistanceTravelled,
  readGroupedByYear,
};
