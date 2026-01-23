// Mail service placeholder
// Install nodemailer if needed: npm install nodemailer

/*
const nodemailer = require('nodemailer');
const envProperties = require('../properties/envProperties');

class MailService {
  static transporter = null;

  static createTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransporter({
        service: envProperties.emailService,
        auth: {
          user: envProperties.emailUser,
          pass: envProperties.emailPassword
        }
      });
    }
    return this.transporter;
  }

  static async sendMail(to, subject, html, text = null) {
    try {
      const transporter = this.createTransporter();
      
      const mailOptions = {
        from: envProperties.emailFrom,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, '')
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Email sending failed:', error.message);
      throw error;
    }
  }

  static async sendVerificationEmail(to, verificationLink) {
    const subject = 'Verify Your Email - CRM';
    const html = `
      <h1>Email Verification</h1>
      <p>Thank you for registering! Please click the link below to verify your email:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>If you didn't create an account, please ignore this email.</p>
    `;
    return await this.sendMail(to, subject, html);
  }

  static async sendPasswordResetEmail(to, resetLink) {
    const subject = 'Password Reset - CRM';
    const html = `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link expires in 1 hour.</p>
    `;
    return await this.sendMail(to, subject, html);
  }

  static async sendWelcomeEmail(to, name) {
    const subject = 'Welcome to CRM';
    const html = `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining our CRM platform.</p>
      <p>Get started by logging in to your account.</p>
    `;
    return await this.sendMail(to, subject, html);
  }
}

module.exports = MailService;
*/

// Placeholder for mail service
class MailService {
  static async sendMail(to, subject, html, text = null) {
    console.log('📧 Mail service not configured');
    console.log(`To: ${to}, Subject: ${subject}`);
    return { messageId: 'mock-id' };
  }

  static async sendVerificationEmail(to, verificationLink) {
    return await this.sendMail(to, 'Verify Email', `Verification link: ${verificationLink}`);
  }

  static async sendPasswordResetEmail(to, resetLink) {
    return await this.sendMail(to, 'Reset Password', `Reset link: ${resetLink}`);
  }

  static async sendWelcomeEmail(to, name) {
    return await this.sendMail(to, 'Welcome', `Welcome ${name}!`);
  }
}

module.exports = MailService;
