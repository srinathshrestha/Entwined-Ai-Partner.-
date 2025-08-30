import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
});

const domain = process.env.MAILGUN_DOMAIN || "";
const fromEmail = process.env.FROM_EMAIL || "noreply@entwined.ai";
const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function sendVerificationEmail(
  email: string,
  token: string,
  type: "signup" | "email-update" | "password-reset"
) {
  let subject: string;
  let htmlContent: string;
  let verificationUrl: string;

  switch (type) {
    case "signup":
      subject = "Welcome to Entwined - Verify Your Email";
      verificationUrl = `${appUrl}/auth/verify-email?token=${token}`;
      htmlContent = generateSignupEmailHTML(verificationUrl);
      break;
    case "email-update":
      subject = "Verify Your New Email Address";
      verificationUrl = `${appUrl}/auth/verify-email-update?token=${token}`;
      htmlContent = generateEmailUpdateHTML(verificationUrl);
      break;
    case "password-reset":
      subject = "Reset Your Password";
      verificationUrl = `${appUrl}/auth/reset-password?token=${token}`;
      htmlContent = generatePasswordResetHTML(verificationUrl);
      break;
    default:
      throw new Error("Invalid email type");
  }

  const emailData = {
    from: `Entwined <${fromEmail}>`,
    to: email,
    subject,
    html: htmlContent,
  };

  try {
    await mg.messages.create(domain, emailData);
    console.log(`${type} email sent successfully to ${email}`);
  } catch (error) {
    console.error(`Error sending ${type} email:`, error);
    throw new Error(`Failed to send ${type} email`);
  }
}

function generateSignupEmailHTML(verificationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Entwined</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 40px;
          color: white;
          text-align: center;
          margin-bottom: 30px;
        }
        .content {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .btn {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .btn:hover {
          transform: translateY(-1px);
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 14px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">💕 Entwined</div>
        <h1>Welcome to Your AI Companion Journey!</h1>
        <p>Thank you for joining Entwined. We're excited to have you start this unique experience.</p>
      </div>
      
      <div class="content">
        <h2>Verify Your Email Address</h2>
        <p>To complete your registration and access all features of Entwined, please verify your email address by clicking the button below:</p>
        
        <a href="${verificationUrl}" class="btn">Verify Email Address</a>
        
        <p>This verification link will expire in 24 hours for security purposes.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        
        <h3>What's Next?</h3>
        <p>Once verified, you'll be able to:</p>
        <ul style="text-align: left; display: inline-block;">
          <li>Create your personalized AI companion</li>
          <li>Engage in meaningful conversations</li>
          <li>Build lasting memories together</li>
          <li>Customize your experience</li>
        </ul>
        
        <p>If you didn't create this account, you can safely ignore this email.</p>
      </div>
      
      <div class="footer">
        <p>© 2025 Entwined. All rights reserved.</p>
        <p>If you have trouble clicking the button, copy and paste this URL into your browser:</p>
        <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
      </div>
    </body>
    </html>
  `;
}

function generateEmailUpdateHTML(verificationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your New Email</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
          border-radius: 16px;
          padding: 40px;
          color: white;
          text-align: center;
          margin-bottom: 30px;
        }
        .content {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .btn {
          display: inline-block;
          background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .btn:hover {
          transform: translateY(-1px);
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 14px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .warning {
          background: #fef3cd;
          border: 1px solid #faebcc;
          color: #8a6d3b;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">💕 Entwined</div>
        <h1>Email Address Update</h1>
        <p>We received a request to update your email address.</p>
      </div>
      
      <div class="content">
        <h2>Verify Your New Email Address</h2>
        <p>To complete the email address change for your Entwined account, please verify your new email address by clicking the button below:</p>
        
        <a href="${verificationUrl}" class="btn">Verify New Email</a>
        
        <div class="warning">
          <strong>⚠️ Important:</strong> This verification link will expire in 24 hours. After verification, your old email address will no longer have access to this account.
        </div>
        
        <p>If you didn't request this email change, please contact our support team immediately and do not click the verification link.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        
        <h3>Security Note</h3>
        <p>For your security, we require email verification whenever you update your contact information. This helps ensure that only you can make changes to your account.</p>
      </div>
      
      <div class="footer">
        <p>© 2025 Entwined. All rights reserved.</p>
        <p>If you have trouble clicking the button, copy and paste this URL into your browser:</p>
        <p style="word-break: break-all; color: #ff7e5f;">${verificationUrl}</p>
      </div>
    </body>
    </html>
  `;
}

function generatePasswordResetHTML(verificationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          border-radius: 16px;
          padding: 40px;
          color: white;
          text-align: center;
          margin-bottom: 30px;
        }
        .content {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .btn {
          display: inline-block;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .btn:hover {
          transform: translateY(-1px);
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 14px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .security-tip {
          background: #e1f5fe;
          border: 1px solid #b3e5fc;
          color: #0277bd;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">💕 Entwined</div>
        <h1>Password Reset Request</h1>
        <p>We received a request to reset your password.</p>
      </div>
      
      <div class="content">
        <h2>Reset Your Password</h2>
        <p>Click the button below to create a new password for your Entwined account:</p>
        
        <a href="${verificationUrl}" class="btn">Reset Password</a>
        
        <p><strong>This link will expire in 1 hour</strong> for security purposes.</p>
        
        <div class="security-tip">
          <strong>🔒 Security Tip:</strong> Choose a strong password that includes a mix of letters, numbers, and special characters. Avoid using personal information or common words.
        </div>
        
        <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        
        <h3>Need Help?</h3>
        <p>If you're having trouble accessing your account or didn't request this reset, please contact our support team for assistance.</p>
      </div>
      
      <div class="footer">
        <p>© 2025 Entwined. All rights reserved.</p>
        <p>If you have trouble clicking the button, copy and paste this URL into your browser:</p>
        <p style="word-break: break-all; color: #f093fb;">${verificationUrl}</p>
      </div>
    </body>
    </html>
  `;
}
