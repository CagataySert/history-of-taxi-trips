const Joi = require("@hapi/joi");
const { wrapJoiSchema } = require("../../utils/wrap.joi.schema");

const pointAndRadiusSchema = {
  start: {
    long: Joi.number().required(),
    lat: Joi.number().required(),
  },
  radius: Joi.number().required(),
};

module.exports = {
  readAllInputValidator: wrapJoiSchema(
    Joi.object({
      ...pointAndRadiusSchema,
      start_date: Joi.string(),
      complete_date: Joi.string(),
    })
  ),
  readMaxMinDistanceTravelledInputValidator: wrapJoiSchema(
    Joi.object(pointAndRadiusSchema)
  ),
  readGroupedByYearInputValidator: wrapJoiSchema(
    Joi.object(pointAndRadiusSchema)
  ),
};
