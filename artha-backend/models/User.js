const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      default: 'demo-user-123',
    },
    name: {
      type: String,
      default: 'Demo User',
    },
    income: {
      type: Number,
      default: 0,
    },
    goals: {
      type: [String],
      default: [],
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    personalityType: {
      type: String,
      default: 'Balanced Builder',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
