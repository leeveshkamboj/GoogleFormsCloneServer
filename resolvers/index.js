const homeResolver = (req, res) => {
  return res.status(200).json({ success: true, msg: "Yo!" });
};

module.exports = { homeResolver };
