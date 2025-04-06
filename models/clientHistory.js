const mongoose = require('mongoose');

const clientHistorySchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client', // Reference to the Client table
    required: true,
  },
  enquiryStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], // Define allowed statuses
  },
}, 
{ timestamps: true }
); 


// Virtuals to convert UTC to IST for createdAt and updatedAt
clientHistorySchema.virtual('createdAtIST').get(function () {
    return new Date(this.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  });
  
  clientHistorySchema.virtual('updatedAtIST').get(function () {
    return new Date(this.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  });
  
  // Include virtuals when converting to JSON
  clientHistorySchema.set('toJSON', { virtuals: true });
  clientHistorySchema.set('toObject', { virtuals: true });



module.exports = mongoose.models.ClientHistory || mongoose.model('ClientHistory', clientHistorySchema);
