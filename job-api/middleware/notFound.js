const notFoundError = (req, res) =>
  res.status(404).send("Route does not exist");

export default notFoundError;
