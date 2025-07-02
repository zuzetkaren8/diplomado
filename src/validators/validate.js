function validate(schema, target = "body") {
  return (req, res, next) => {
    const data = req[target];
    //paso 1 >verificar si hay datos
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        message: `No data provided in ${target}`,
      });
    }
    // paso 2 >validar los datos
    const { error, value } = schema.validate(data, {
        abortEarly: false, // Para que retorne todos los errores
        stripUnknown: true, // Elimina campos no definidos en el esquema
    });
    // paso 3 >verificar si hay errores
    if (error) {
      return res.status(400).json({
        message: `Error de validacion en ${target}`,
        errors: error.details.map(err => err.message),
      });
    }
    // paso 4 >Reemplazar el objeto original con datos limpios
    req[target] = value;

    //continuamos
    next();
  };
}
export default validate;