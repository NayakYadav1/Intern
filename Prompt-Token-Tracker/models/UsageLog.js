import mongoose from 'mongoose';

const usageLogSchema = new mongoose.Schema({
  model: { type: String, required: true },
  prompt: { type: String, required: true },
  tokenCount: { type: Number, required: true },
  cost: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const UsageLog = mongoose.model('UsageLog', usageLogSchema);

export default UsageLog;
