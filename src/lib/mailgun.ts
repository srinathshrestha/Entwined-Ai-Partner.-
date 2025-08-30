import Mailgun from "mailgun.js";
import FormData from "form-data";

const mailgun = new Mailgun(FormData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
});

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailData) {
  try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.MAILGUN_FROM_EMAIL!,
      to: [to],
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    });

    console.log("Email sent:", result);
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

export function generateVerificationEmailHTML(
  name: string,
  verificationLink: string,
  to: string
) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email - Entwined</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; }
          .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #e74c3c; }
          .content { padding: 30px 0; }
          .button { display: inline-block; background-color: #e74c3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: #e74c3c; margin: 0;">✨ Entwined</h1>
            <p style="margin: 10px 0 0 0; color: #666;">Your AI Companion Awaits</p>
          </div>
          
          <div class="content">
            <h2>Welcome to Entwined, ${name}!</h2>
            <p>Thank you for signing up! We're excited to help you create your personalized AI companion.</p>
            
            <p>To get started, please verify your email address by clicking the button below:</p>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" class="button">Verify Email Address</a>
            </p>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="background-color: #f8f8f8; padding: 10px; border-radius: 3px; word-break: break-all;">
              ${verificationLink}
            </p>
            
            <p><strong>This link will expire in 24 hours.</strong></p>
            
            <p>If you didn't sign up for Entwined, please ignore this email.</p>
          </div>
          
          <div class="footer">
            <p>Best regards,<br>The Entwined Team</p>
            <p style="margin-top: 20px;">
              <small>This email was sent to ${to}. If you have any questions, reply to this email.</small>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function generateResetPasswordEmailHTML(
  name: string,
  resetLink: string,
  to: string
) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password - Entwined</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; }
          .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #e74c3c; }
          .content { padding: 30px 0; }
          .button { display: inline-block; background-color: #e74c3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: #e74c3c; margin: 0;">✨ Entwined</h1>
            <p style="margin: 10px 0 0 0; color: #666;">Password Reset Request</p>
          </div>
          
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>Hi ${name},</p>
            <p>We received a request to reset your password for your Entwined account.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </p>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="background-color: #f8f8f8; padding: 10px; border-radius: 3px; word-break: break-all;">
              ${resetLink}
            </p>
            
            <p><strong>This link will expire in 1 hour.</strong></p>
            
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
          </div>
          
          <div class="footer">
            <p>Best regards,<br>The Entwined Team</p>
            <p style="margin-top: 20px;">
              <small>For security reasons, this link will expire in 1 hour.</small>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
