import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class OtpService {
  // Generate a 6-digit OTP
  generateOtp() {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Create and store OTP in database
  async createOtp(phone, type, userId = null) {
    // Delete any existing unused OTPs for this phone and type
    await prisma.otpCode.deleteMany({
      where: {
        phone,
        type,
        isUsed: false
      }
    });

    const code = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const otpRecord = await prisma.otpCode.create({
      data: {
        phone,
        code,
        type,
        expiresAt,
        userId
      }
    });

    return otpRecord;
  }

  // Verify OTP
  async verifyOtp(phone, code, type) {
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        phone,
        code,
        type,
        isUsed: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!otpRecord) {
      throw new Error('Invalid or expired OTP');
    }

    // Mark OTP as used
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { isUsed: true }
    });

    return otpRecord;
  }

  // Send OTP via SMS (Mock implementation)
  async sendOtp(phone, code, type) {
    // In production, integrate with SMS service like Twilio, AWS SNS, etc.
    console.log(`📱 Sending OTP to ${phone}: ${code} (Type: ${type})`);
    
    // Mock SMS sending - replace with actual SMS service
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 OTP for ${phone}: ${code}`);
      return { success: true, message: 'OTP sent successfully' };
    }

    // Example Twilio integration (uncomment and configure)
    /*
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    try {
      await client.messages.create({
        body: `Your BookMyPG verification code is: ${code}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('SMS sending failed:', error);
      throw new Error('Failed to send OTP');
    }
    */

    return { success: true, message: 'OTP sent successfully' };
  }

  // Clean up expired OTPs (run periodically)
  async cleanupExpiredOtps() {
    await prisma.otpCode.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }
}

export default new OtpService();