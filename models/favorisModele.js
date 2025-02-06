const mongoose = require("mongoose");

const favorisSchema = new mongoose.Schema(
  {
    utilisateurId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'utilisateurType' },
    utilisateurType: { type: String, required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Favoris", favorisSchema);
