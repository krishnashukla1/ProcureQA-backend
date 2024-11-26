const ClientHistory = require('../models/clientHistory'); // Adjust path as needed

// Add a new client history entry
async function addClientHistory(req, res) {
  const { clientId, enquiryStatus } = req.body;

  try {
    const history = new ClientHistory({ clientId, enquiryStatus });
    await history.save();
    res.status(201).json({ message: 'Client history entry added successfully', history });
  } catch (err) {
    res.status(500).json({ message: 'Error adding client history', error: err.message });
  }
}

// Get all client history for a specific client
// async function getClientHistory(req, res) {
//   const { clientId } = req.params;

//   try {
//     const history = await ClientHistory.find({ clientId }).populate('clientId', 'name email');
//     res.status(200).json({ message: 'Client history fetched successfully', history });
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching client history', error: err.message });
//   }
// }


async function getClientHistory(req, res) {
    const { clientId } = req.params;
  
    try {
    //   console.log('Fetching history for clientId:', clientId);
  
      const history = await ClientHistory.find({ clientId }).populate('clientId', 'name email');
    //   console.log('Fetched history:', history);
  
      res.status(200).json({ message: 'Client history fetched successfully', history });
    } catch (err) {
    //   console.error('Error fetching client history:', err.message);
      res.status(500).json({ message: 'Error fetching client history', error: err.message });
    }
  }
  

module.exports = { addClientHistory, getClientHistory };
