const mongoose = require("mongoose");

const Forms = require("../models/forms");
const config = require("../config");

const homeResolver = (req, res) => {
  // return res.status(200).json({ success: true, msg: "Yo!", user: req.user });
  return res.status(200).json({ success: true, msg: "Yo!" });
};

const formPostResolver = (req, res) => {
  var { name, questions } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, error: "Form name not provided" });
  }
  if (!questions || !questions.length) {
    return res
      .status(400)
      .json({ success: false, error: "Should have at least one quetion" });
  }
  questions = questions
    .map((val) => {
      const x = {
        _id: new mongoose.Types.ObjectId(),
        question: val.question,
        type: val.type,
      };
      if (val.type === 2) {
        if (val.options) {
          return {
            ...x,
            options: val.options,
          };
        }
        return {
          ...x,
          options: [],
        };
      }
      return x;
    })
    .filter((val) => {
      if (val.question && config.quetionTypes.includes(val.type)) {
        if (config.quetionTypesWithOptions.includes(val.type)) {
          return val.options.length;
        }
        return true;
      }
    });
  if (!questions.length) {
    return res
      .status(400)
      .json({ success: false, error: "Should have at least one valid quetion" });
  }
  new_form = new Forms({
    _id: new mongoose.Types.ObjectId(),
    name,
    questions,
    created_at: new Date().toISOString(),
    created_by: req.user.username,
  });
  new_form
    .save()
    .then((result) => {
      return res.status(200).json({
        success: true,
        id: result._id,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({
        success: false,
      });
    });
};

const formGetResolver = (req, res) => {
  if (!req.query.id)
    return res.status(401).json({ success: false, error: "ID not provided" });
  Forms.findById(req.query.id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch(() => {
      return res.status(404).json({ success: false, error: "Not Found" });
    });
};

module.exports = { homeResolver, formPostResolver, formGetResolver };
