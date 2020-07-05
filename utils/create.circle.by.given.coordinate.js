const { moveTo } = require("geolocation-utils");

/**
 * create a circle by given coordinates and radius, then return coordinates of furthest points of circle.
 * @param {Number} lon longitude of specified point.
 * @param {Number} lat latitude of specified point.
 * @param {Number} radius max radius of distance to point.It comes with km unit.
 * @return {{northernmost:Number, westernmost:Number, southernmost:Number, easternmost:Number}}
 */
const createCircleByGivenCoordinate = (lon, lat, radius) => {
  // moveTo accepts meter unit for distance and degree unit for heading values.
  const northCoordinates = moveTo(
    { lat, lon },
    { distance: radius * 1000, heading: 90 }
  );
  const northernmost = northCoordinates.lon;

  const westCoordinates = moveTo(
    { lat, lon },
    { distance: radius * 1000, heading: 180 }
  );
  const westernmost = westCoordinates.lat;

  const southCoordinates = moveTo(
    { lat, lon },
    { distance: radius * 1000, heading: 270 }
  );
  const southernmost = southCoordinates.lon;

  const eastCoordinates = moveTo(
    { lat, lon },
    { distance: radius * 1000, heading: 360 }
  );
  const easternmost = eastCoordinates.lat;

  return { northernmost, westernmost, southernmost, easternmost };
};

module.exports = createCircleByGivenCoordinate;
