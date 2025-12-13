Welcome to {{ config('app.name') }}!

Hello {{ $user->name }},

Your account has been created by an administrator. We're excited to have you on board!

YOUR ACCOUNT DETAILS
--------------------
Name: {{ $user->name }}
Email: {{ $user->email }}
@if($user->phone)
Phone: {{ $user->phone }}
@endif
Account Type: {{ ucfirst($user->user_type) }}
Temporary Password: {{ $temporaryPassword }}

⚠️ IMPORTANT SECURITY NOTICE
-----------------------------
For security reasons, you must change your password upon first login. Please visit the link below to set your own password.

SET YOUR PASSWORD:
{{ $resetUrl }}

✅ YOUR EMAIL IS VERIFIED
-------------------------
Your email address has been automatically verified. You can start using your account immediately after setting your password.

If you didn't expect this email or have any questions, please contact our support team.

© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
