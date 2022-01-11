const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const formSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  questions: [
    {
      _id: Schema.Types.ObjectId,
      question: String,
      type: { type: Number },
      options: [String],
    },
  ],
  responses: { type: [Schema.Types.Mixed], default: [] },
  created_by: { type: Schema.Types.ObjectId, ref: "users" },
  created_at: String,
  enabled: { type: Boolean, default: true },
});

const forms = mongoose.model("forms", formSchema);

module.exports = forms;
