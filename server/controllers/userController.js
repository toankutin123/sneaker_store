import User from '../models/User.js';

// Get all users (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      const { username, email, phone, province, district, ward, street } = req.body;
      
      // Check if email is being changed and if it's already taken
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }

      user.username = username || user.username;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.province = province || user.province;
      user.district = district || user.district;
      user.ward = ward || user.ward;
      user.street = street || user.street;
      
      await user.save();
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
        phone: user.phone,
        province: user.province,
        district: user.district,
        ward: user.ward,
        street: user.street
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      const { currentPassword, newPassword } = req.body;
      
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByPk(req.user.id);
    if (user) {
      user.avatar = `/uploads/${req.file.filename}`;
      await user.save();
      res.json({ avatar: user.avatar });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
