const User = require('../models/User');
const logger = require('../config/logger');

class UserService {
    // Cập nhật thông tin profile
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

    // Cập nhật avatar
    async updateAvatar(userId, pathFile) {
        const user = await User.findByIdAndUpdate(
            userId,
            { avatar: pathFile },
            { new: true }
        );

        if (!user) {
            throw new Error('User not found');
        }

        return {
            avatarUrl: pathFile
        };
    }
}

module.exports = new UserService()  
