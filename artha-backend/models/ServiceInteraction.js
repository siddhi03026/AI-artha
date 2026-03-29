const mongoose = require('mongoose');

const serviceInteractionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    serviceId: {
      type: String,
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['explore'],
      default: 'explore',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceInteraction', serviceInteractionSchema);
