const User = require('../models/User');

class UserService {
    async updateProfile(id, data) {
        const updateData = {
            fullName: data.fullName,
            email: data.email,
            'metadata.phone': data.phone,
            'metadata.address': data.address
        }
        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )
        return user
    }
}

module.exports = new UserService()  
