const mongoose = require("mongoose");

const Forms = require("../models/forms");
const Users = require("../models/users");
const config = require("../config");

const formPostResolver = async (req, res) => {
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
      if (config.quetionTypes.includes(val.type)) {
        if (val.options && val.options.length > 1) {
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
    return res.status(400).json({
      success: false,
      error: "Should have at least one valid quetion",
    });
  }

  const user = await Users.findOne({
    username: req.user.username,
  });
  if (!user) {
    return res.status(401).json({
      success: false,
    });
  }

  new_form = new Forms({
    _id: new mongoose.Types.ObjectId(),
    name,
    questions,
    created_at: new Date().toISOString(),
    created_by: user._id,
  });
  new_form
    .save()
    .then((result) => {
      user.forms.unshift(new_form._id);
      user.save().then(() => {
        return res.status(200).json({
          success: true,
          id: result._id,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({
        success: false,
      });
    });
};

const formGetResolver = async (req, res) => {
  var result = null;
  if (!req.params.formID)
    return res.status(400).json({ success: false, error: "ID not provided" });
  try {
    result = await Forms.findById(req.params.formID).populate("created_by");
  } catch {
    return res.status(404).json({ success: false, error: "Form not found" });
  }
  if (result) {
    return res.status(200).json({
      name: result.name,
      questions: result.questions,
      created_at: result.created_at,
      created_by: result.created_by.username,
    });
  } else {
    return res.status(404).json({ success: false, error: "Form not found" });
  }
};

const formDeleteResolver = async (req, res) => {
  var result = req.form;
  await Users.findByIdAndUpdate(result.created_by, {
    $pull: { forms: result._id },
  });
  result
    .remove()
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch(() => {
      res.status(200).json({ success: false });
    });
};

const formsGetResolver = (req, res) => {
  Users.findOne({
    username: req.user.username,
  })
    .populate("forms")
    .then((result) => {
      return res.status(200).json({
        success: true,
        forms: result.forms,
      });
    })
    .catch(() => {
      return res.status(401).json({
        success: false,
      });
    });
};

const formEnableResolver = (req, res) => {
  var newVal = true;
  if (req.body.action === "disable") {
    newVal = false;
  }
  Forms.findByIdAndUpdate(req.form._id, { $set: { enabled: newVal } })
    .then(() => {
      return res.status(200).json({
        success: true,
      });
    })
    .catch(() => {
      return res.status(500).json({
        success: false,
      });
    });
};

module.exports = {
  formPostResolver,
  formGetResolver,
  formsGetResolver,
  formDeleteResolver,
  formEnableResolver,
};
