const Forms = require("../models/forms");
const config = require("../config");

const responsePostResolver = async (req, res) => {
    var result = null;
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
    if (result) {
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
    }
  };

  module.exports = { responsePostResolver };