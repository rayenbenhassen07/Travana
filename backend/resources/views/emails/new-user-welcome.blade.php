<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to {{ config('app.name') }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        h1 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .welcome-message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 30px;
        }
        .credentials-box {
            background-color: #f9fafb;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .credential-item {
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .credential-item:last-child {
            border-bottom: none;
        }
        .credential-label {
            font-weight: 600;
            color: #374151;
            display: inline-block;
            width: 120px;
        }
        .credential-value {
            color: #1f2937;
            font-family: 'Courier New', monospace;
            background-color: #ffffff;
            padding: 4px 8px;
            border-radius: 4px;
        }
        .warning-box {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .warning-box strong {
            color: #92400e;
            display: block;
            margin-bottom: 5px;
        }
        .warning-box p {
            color: #78350f;
            margin: 5px 0;
            font-size: 14px;
        }
        .cta-button {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: 600;
        }
        .cta-button:hover {
            background-color: #1d4ed8;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
        }
        .steps-list {
            margin: 20px 0;
            padding-left: 20px;
        }
        .steps-list li {
            margin: 10px 0;
            color: #4b5563;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">{{ config('app.name') }}</div>
        </div>

        <h1>Welcome to {{ config('app.name') }}! 🎉</h1>

        <div class="welcome-message">
            <p>Hello <strong>{{ $user->name }}</strong>,</p>
            <p>Your account has been successfully created by an administrator. We're excited to have you on board!</p>
        </div>

        <div class="credentials-box">
            <h3 style="margin-top: 0; color: #1f2937;">Your Login Credentials</h3>
            <div class="credential-item">
                <span class="credential-label">Email:</span>
                <span class="credential-value">{{ $user->email }}</span>
            </div>
            <div class="credential-item">
                <span class="credential-label">Temporary Password:</span>
                <span class="credential-value">{{ $temporaryPassword }}</span>
            </div>
            <div class="credential-item">
                <span class="credential-label">Account Type:</span>
                <span class="credential-value">{{ ucfirst($user->user_type) }}</span>
            </div>
            @if($user->phone)
            <div class="credential-item">
                <span class="credential-label">Phone:</span>
                <span class="credential-value">{{ $user->phone }}</span>
            </div>
            @endif
        </div>

        <div class="warning-box">
            <strong>⚠️ Important Security Notice</strong>
            <p><strong>Please change your password immediately after your first login.</strong></p>
            <p>This temporary password is only for initial access. For your security, you should set a strong, unique password as soon as possible.</p>
        </div>

        <h3 style="color: #1f2937;">Getting Started</h3>
        <ol class="steps-list">
            <li>Click the button below to access the login page</li>
            <li>Enter your email and temporary password</li>
            <li>Navigate to your profile settings</li>
            <li>Change your password to something secure and memorable</li>
            <li>Complete your profile information</li>
        </ol>

        <div style="text-align: center;">
            <a href="{{ config('app.frontend_url') }}/login" class="cta-button">
                Login to Your Account
            </a>
        </div>

        <div class="footer">
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            <p style="margin-top: 15px;">
                <strong>{{ config('app.name') }}</strong><br>
                © {{ date('Y') }} All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
