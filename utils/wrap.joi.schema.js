/**
 * wrapper for validate schema
 * @param {Object} schema validation schema.
 * @param {Object} inputs will be validated inputs.
 * @return {{isValidated:Boolean, [errors]:Object}}
 */
exports.validateJoiSchema = (schema, inputs) => {
  const { error } = schema.validate(inputs, { abortEarly: false });

  return error
    ? {
        isValidated: false,
        errors: error.details.reduce((acc, cur) => {
          acc[cur.path[0]] = cur.type;
          return acc;
        }, {}),
      }
    : { isValidated: true };
};

exports.wrapJoiSchema = (schema) => (inputs) =>
  exports.validateJoiSchema(schema, inputs);
