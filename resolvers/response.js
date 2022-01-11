const config = require("../config");

const responsePostResolver = async (req, res) => {
  const result = req.form;
  if (
    !req.body.responses ||
    req.body.responses.length !== result.questions.length
  ) {
    return res
      .status(400)
      .json({ success: false, error: "Responses not provided" });
  }

  const responses = req.body.responses.filter((val, i) => {
    if (
      val !== null &&
      config.quetionTypesWithOptions.includes(result.questions[i].type)
    ) {
      return !isNaN(val) && val < result.questions[i].options.length;
    }
    return true;
  });
  if (responses.length !== result.questions.length) {
    return res
      .status(400)
      .json({ success: false, error: "Responses not valid" });
  }
  result.responses.push(
    responses.map((val, i) => {
      if (
        val !== null &&
        config.quetionTypesWithOptions.includes(result.questions[i].type)
      )
        return parseInt(val);
      else return val;
    })
  );
  result
    .save()
    .then(() => {
      return res.status(200).json({ success: true });
    })
    .catch(() => {
      return res
        .status(500)
        .json({ success: false, error: "Internal server Error" });
    });
};

const responseGetResolver = async (req, res) => {
  const result = req.form;
  return res.status(200).json({
    success: true,
    responses: result.responses,
    questions: result.questions,
  });
};

module.exports = { responsePostResolver, responseGetResolver };
