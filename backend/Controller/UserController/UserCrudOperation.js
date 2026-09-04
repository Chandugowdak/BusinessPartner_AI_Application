const User = require('../../model/User/UserSchema.js');



const HandleUserUpdate = async(req,res)=>{
    const { userId } = req.params;
    const {name,email} = req.body;
    try{
       const VerifyExistUser = await User.findById(userId);
       if(!VerifyExistUser){
        return res.status(404).json({ message: 'User not found' });
       }
    const UpdateUser = await User.findByIdAndUpdate(userId,{name,email},{new:true, runValidators:true}).select('_id name email');
       if(!UpdateUser){
        return res.status(400).json({ message: 'Failed to update user' });
       }else{
        res.status(200).json({ message: 'User updated successfully', user: UpdateUser });
       } 
    }
    catch(err){
        res.status(500).json({ message: 'Error updating user', error: err });
    }
}


module.exports = { HandleUserUpdate };