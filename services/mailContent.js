const mailService = require('./mailService');

const getVerificationEmailContent = (name, verificationLink) => {
  return {
    subject: 'Verify Your Email - CRM',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for registering with our CRM platform!</p>
            <p>Please click the button below to verify your email address:</p>
            <a href="${verificationLink}" class="button">Verify Email</a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${verificationLink}</p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 CRM Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hello ${name},\n\nThank you for registering! Please verify your email by clicking this link: ${verificationLink}\n\nIf you didn't create an account, please ignore this email.`
  };
};

const getPasswordResetEmailContent = (name, resetLink) => {
  return {
    subject: 'Password Reset Request - CRM',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .warning { color: #f44336; font-weight: bold; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>You requested a password reset for your CRM account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${resetLink}</p>
            <p class="warning">This link expires in 1 hour.</p>
            <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 CRM Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hello ${name},\n\nYou requested a password reset. Click this link to reset your password: ${resetLink}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.`
  };
};

const getWelcomeEmailContent = (name) => {
  return {
    subject: 'Welcome to CRM Platform',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #673AB7; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #673AB7; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to CRM!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Welcome to our CRM platform! We're excited to have you on board.</p>
            <p>Here's what you can do:</p>
            <ul>
              <li>Manage your customers efficiently</li>
              <li>Track and convert leads</li>
              <li>Collaborate with your team</li>
              <li>Generate insights and reports</li>
            </ul>
            <p>Get started by logging in to your account:</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Go to Dashboard</a>
          </div>
          <div class="footer">
            <p>&copy; 2026 CRM Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hello ${name},\n\nWelcome to our CRM platform! We're excited to have you on board.\n\nGet started by logging in to your account.`
  };
};

module.exports = {
  getVerificationEmailContent,
  getPasswordResetEmailContent,
  getWelcomeEmailContent
};
