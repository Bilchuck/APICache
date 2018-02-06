import mongoose from 'mongoose';

const modelName = 'Cache';
const schema = new mongoose.Schema({
    key: { type: String, index: true },
    value: String,
    lastUsage: Date,
});

export default mongoose.model(modelName, schema);
