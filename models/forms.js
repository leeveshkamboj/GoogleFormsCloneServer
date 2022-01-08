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
  created_by: { type: Schema.Types.ObjectId, ref: 'users' },
  created_at: String,
});

const forms = mongoose.model("forms", formSchema);

module.exports = forms;
