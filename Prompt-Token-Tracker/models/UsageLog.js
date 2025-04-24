// models/UsageLog.js
import mongoose from 'mongoose';

const usageLogSchema = new mongoose.Schema({
  model:      { type: String, required: true },
  prompt:     { type: String, required: true },
  tokenCount: { type: Number, required: false, default: 0 },
  cost:       { type: Number, required: false, default: 0 },
  createdAt:  { type: Date,   default: Date.now },
});

export default mongoose.model('UsageLog', usageLogSchema);
