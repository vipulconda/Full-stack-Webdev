const User=require('./users')
const Conversation =require('./chats')

const ConnectedUsers= async (username)=>{
    try {
     
        const user=await User.findOne({username})
      // Fetch user details for these unique user IDs
      const users = await User.find({ username: { $in: user.connections } });
      return users.map(user => ({
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
      }));
    } catch (error) {
      console.error("Error fetching users with conversations:", error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
module.exports=ConnectedUsers
