# Email Verification Guide

This document explains the email verification process implemented in the Travana API.

---

## Overview

When a new user registers, they receive a verification email. The user must click the verification link in the email to verify their email address before accessing protected features.

---

## User Registration with Email Verification

### 1. Registration Process

When a user registers, the following happens:

1. User submits registration form with required fields
2. Backend validates the data
3. User account is created with `email_verified_at = null`
4. Verification email is automatically sent
5. User receives auth token but account is not verified

### Registration Endpoint

**POST** `/api/auth/register`

**Required Fields:**

-   `username` - User's display name
-   `email` - User's email address (must be unique)
-   `sex` - User's sex (`male` or `female`)
-   `phone` - User's phone number
-   `password` - Password (min 8 characters)
-   `password_confirmation` - Password confirmation

**Response:**

```json
{
    "message": "User registered successfully. Please check your email to verify your account.",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "sex": "male",
        "phone": "+1234567890",
        "type": "user",
        "email_verified_at": null
    },
    "token": "1|abc123xyz..."
}
```

---

## Email Verification Flow

### 2. Verification Email

The verification email contains:

-   A verification link with a signed URL
-   The link format: `https://api.travana.com/verify-email/{id}/{hash}?expires={timestamp}&signature={signature}`
-   The link is valid for 60 minutes by default

### 3. Verifying Email

**Method 1: Click Email Link (Recommended)**

When the user clicks the verification link:

-   The request is sent to: `GET /verify-email/{id}/{hash}`
-   The backend verifies the signature and marks the email as verified
-   User is redirected to the frontend success page: `FRONTEND_URL/verify-email-success`
-   No authentication required for clicking the link

**Success Redirects:**

-   Email verified: `http://localhost:3000/verify-email-success`
-   Already verified: `http://localhost:3000/verify-email-success?already=true`

**Failure Redirects:**

-   Invalid link: `http://localhost:3000/verify-email-failed?error=invalid`
-   Expired link: `http://localhost:3000/verify-email-failed?error=expired`

**Method 2: Resend Verification Email**

If the user didn't receive the email or the link expired:

**POST** `/api/auth/email/verification-notification`

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
    "message": "Verification link sent!"
}
```

**Rate Limit:** 6 attempts per minute

---

## Checking Verification Status

### Get Current User

**GET** `/api/auth/me`

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "sex": "male",
    "phone": "+1234567890",
    "type": "user",
    "email_verified_at": "2025-12-07T10:30:00.000000Z"
}
```

If `email_verified_at` is `null`, the email is not verified.

---

## Protecting Routes (Optional)

To require email verification for specific routes, add the `verified` middleware:

```php
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    // Protected routes that require email verification
});
```

---

## Email Configuration

Email verification uses the SMTP configuration in `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=naseamgroup@gmail.com
MAIL_PASSWORD=ppfjyyrfoybdxunc
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=info@Travana.tn
MAIL_FROM_NAME="Travana"
```

---

## Frontend Implementation

### 1. Registration Form

The frontend registration form now includes:

-   Username field
-   Email field
-   Sex selector (Male/Female)
-   Phone field
-   Password field
-   Password confirmation field

### 2. After Registration

After successful registration:

1. Display success message: "Registration successful! Please check your email to verify your account."
2. Store the auth token
3. Redirect to a "Check Your Email" page with instructions
4. Show verification status in user profile

### 3. Email Verification Success Page

Create `/verify-email-success/page.js`:

-   Shows success message
-   Auto-redirects to home after 5 seconds
-   Handles "already verified" state

### 4. Email Verification Failed Page

Create `/verify-email-failed/page.js`:

-   Shows error message based on error type (invalid/expired)
-   Provides link to login and resend verification
-   Link to contact support

### 5. Verification Status Display

```jsx
{
    user && !user.email_verified_at && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
            <p className="text-yellow-700">
                Please verify your email. Didn't receive the email?{" "}
                <button onClick={resendVerification} className="underline">
                    Resend
                </button>
            </p>
        </div>
    );
}
```

### 6. Resend Verification Function

```javascript
const resendVerification = async () => {
    try {
        const response = await fetch(
            "/api/auth/email/verification-notification",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.ok) {
            alert("Verification email sent!");
        }
    } catch (error) {
        console.error("Failed to resend verification email:", error);
    }
};
```

---

## Testing Email Verification

### Using Mailtrap (Development)

For testing, you can use Mailtrap.io:

1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Get SMTP credentials
3. Update `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
```

### Using Gmail (Production)

The current setup uses Gmail SMTP. Make sure:

1. Two-factor authentication is enabled on the Gmail account
2. An App Password is generated and used (not the regular password)
3. The email address is verified in Gmail settings

---

## Troubleshooting

### Email Not Received

1. Check spam/junk folder
2. Verify SMTP credentials in `.env`
3. Check Laravel logs: `storage/logs/laravel.log`
4. Test SMTP connection:
    ```bash
    php artisan tinker
    Mail::raw('Test email', function($msg) {
        $msg->to('test@example.com')->subject('Test');
    });
    ```

### Verification Link Expired

-   Links expire after 60 minutes by default
-   User can request a new verification email
-   Configure expiration in `config/auth.php`:
    ```php
    'verification' => [
        'expire' => 60, // minutes
    ],
    ```

### Already Verified Error

If the user clicks the verification link again after verification:

-   The system returns: "Email already verified"
-   This is expected behavior

---

## API Endpoints Summary

| Method | Endpoint                                    | Auth Required | Description                                   |
| ------ | ------------------------------------------- | ------------- | --------------------------------------------- |
| POST   | `/api/auth/register`                        | No            | Register new user and send verification email |
| GET    | `/verify-email/{id}/{hash}`                 | Yes (signed)  | Verify email via link                         |
| POST   | `/api/auth/email/verification-notification` | Yes           | Resend verification email                     |
| GET    | `/api/auth/me`                              | Yes           | Get current user with verification status     |

---

## Security Notes

1. **Signed URLs**: Verification links use signed URLs to prevent tampering
2. **Rate Limiting**: Resending verification emails is rate-limited to 6 per minute
3. **Expiration**: Verification links expire after 60 minutes
4. **Token-based**: All API calls (except verification link) require Bearer token
5. **HTTPS**: Always use HTTPS in production for secure email verification

---

## Database Schema

The `users` table includes:

```sql
email_verified_at TIMESTAMP NULL
```

-   `NULL` = Email not verified
-   Contains timestamp = Email verified at that time
