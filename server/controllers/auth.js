import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import otpService from '../services/otpService.js';

const prisma = new PrismaClient();

// Send OTP for login
export const sendLoginOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[+]?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }

    // Generate and send OTP
    const otpRecord = await otpService.createOtp(phone, 'LOGIN', user.id);
    await otpService.sendOtp(phone, otpRecord.code, 'LOGIN');

    res.json({
      message: 'OTP sent successfully',
      phone,
      expiresAt: otpRecord.expiresAt
    });
  } catch (error) {
    console.error('Send login OTP error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify OTP and login
export const verifyLoginOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    // Verify OTP
    await otpService.verifyOtp(phone, otp, 'LOGIN');

    // Get user
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Verify login OTP error:', error);
    res.status(400).json({ message: error.message || 'Invalid OTP' });
  }
};

// Send OTP for signup
export const sendSignupOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Validate phone number format
    const phoneRegex = /^[+]?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this phone number' });
    }

    // Generate and send OTP
    const otpRecord = await otpService.createOtp(phone, 'SIGNUP');
    await otpService.sendOtp(phone, otpRecord.code, 'SIGNUP');

    res.json({
      message: 'OTP sent successfully',
      phone,
      expiresAt: otpRecord.expiresAt
    });
  } catch (error) {
    console.error('Send signup OTP error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify OTP and complete signup
export const verifySignupOtp = async (req, res) => {
  try {
    const { name, email, phone, otp, role = 'USER' } = req.body;

    if (!name || !phone || !otp) {
      return res.status(400).json({ message: 'Name, phone number and OTP are required' });
    }

    // Verify OTP
    await otpService.verifyOtp(phone, otp, 'SIGNUP');

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check email uniqueness if provided
    if (email) {
      const existingEmailUser = await prisma.user.findUnique({ where: { email } });
      if (existingEmailUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role,
        isVerified: true
      }
    });

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Verify signup OTP error:', error);
    res.status(400).json({ message: error.message || 'Invalid OTP' });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Get user
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { phone, type } = req.body;

    if (!phone || !type) {
      return res.status(400).json({ message: 'Phone number and type are required' });
    }

    if (!['LOGIN', 'SIGNUP'].includes(type)) {
      return res.status(400).json({ message: 'Invalid OTP type' });
    }

    // For login, check if user exists
    if (type === 'LOGIN') {
      const user = await prisma.user.findUnique({ where: { phone } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    // For signup, check if user doesn't exist
    if (type === 'SIGNUP') {
      const existingUser = await prisma.user.findUnique({ where: { phone } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
    }

    // Generate and send new OTP
    const otpRecord = await otpService.createOtp(phone, type);
    await otpService.sendOtp(phone, otpRecord.code, type);

    res.json({
      message: 'OTP resent successfully',
      phone,
      expiresAt: otpRecord.expiresAt
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};