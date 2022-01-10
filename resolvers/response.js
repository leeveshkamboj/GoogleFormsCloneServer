const Forms = require("../models/forms");
const config = require("../config");

const responsePostResolver = async (req, res) => {
  if (!req.params.formID)
    return res.status(401).json({ success: false, error: "ID not provided" });
  try {
    result = await Forms.findById(req.params.formID);
  } catch {
    return res.status(404).json({ success: false, error: "Form not found" });
  }
  if (
    !req.body.responses ||
    req.body.responses.length !== result.questions.length
  ) {
    return res
      .status(401)
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
      .status(401)
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
  if (!req.params.formID)
    return res.status(401).json({ success: false, error: "ID not provided" });
  try {
    result = await Forms.findById(req.params.formID).populate("created_by");
  } catch {
    return res.status(404).json({ success: false, error: "Form not found" });
  }
  if (result.created_by.username !== req.user.username) {
    return res
      .status(401)
      .json({ success: false, error: "Form is not created by you." });
  }
  return res.status(200).json({ success: true, responses: result.responses, questions:result.questions });
};

module.exports = { responsePostResolver, responseGetResolver };
