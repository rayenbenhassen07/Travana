# Email System Documentation

## Overview

This document describes the email notification system implemented for the Travana platform, including reservation confirmations, email verification, and password reset emails.

## Features Implemented

### 1. Reservation Confirmation Emails

- **Trigger**: Automatically sent when a new reservation is created
- **Template**: `back/resources/views/emails/reservation-confirmation.blade.php`
- **Mailable Class**: `back/app/Mail/ReservationConfirmation.php`
- **Content Includes**:
  - Beautiful gradient header with success icon
  - Reservation reference number
  - Check-in and check-out dates
  - Number of nights
  - Price breakdown (per night, subtotal, service fee, total)
  - Listing information (name, address, city, phone)
  - User contact information
  - Important check-in/check-out information
  - Call-to-action button to view reservation
  - Responsive design for mobile devices

### 2. Email Verification

- **Trigger**: Sent when a new user registers
- **Template**: `back/resources/views/emails/verify-email.blade.php`
- **Notification Class**: `back/app/Notifications/CustomVerifyEmail.php`
- **Content Includes**:
  - Welcome message
  - Verification button (valid for 60 minutes)
  - Alternative verification link
  - Security information
  - Responsive design

### 3. Password Reset

- **Trigger**: Sent when a user requests a password reset
- **Template**: `back/resources/views/emails/reset-password.blade.php`
- **Notification Class**: `back/app/Notifications/CustomResetPassword.php`
- **Content Includes**:
  - Password reset button (valid for 60 minutes)
  - Alternative reset link
  - Security warnings
  - Instructions for users who didn't request the reset
  - Responsive design

## Implementation Details

### Email Templates Design

All email templates follow a consistent design system:

- **Color Scheme**: Purple gradient (#667eea to #764ba2)
- **Typography**: Segoe UI font family
- **Layout**: 600px max-width, centered, with rounded corners
- **Components**:
  - Header with gradient background and icon
  - Content area with clear typography hierarchy
  - Call-to-action buttons with hover effects
  - Information boxes with color-coded borders
  - Footer with branding and social links
- **Responsive**: Optimized for mobile devices with media queries

### Backend Configuration

#### Mail Settings (.env)

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=naseamgroup@gmail.com
MAIL_PASSWORD=ppfjyyrfoybdxunc
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=info@Travana.tn
MAIL_FROM_NAME="Travana"
FRONTEND_URL=http://localhost:3000
```

#### Modified Files

1. **User Model** (`back/app/Models/User.php`):

   - Added `sendEmailVerificationNotification()` method
   - Added `sendPasswordResetNotification($token)` method
   - Imports custom notification classes

2. **ListingReservationController** (`back/app/Http/Controllers/Api/ListingReservationController.php`):
   - Imports `ReservationConfirmation` mailable
   - Sends email after successful reservation creation
   - Error handling to prevent email failures from breaking reservations

### Frontend Integration

#### Success Message UI

The reservation confirmation modal now displays an in-modal success message instead of a browser alert:

- **File**: `front/src/components/(app)/listings/detail/ReservationConfirmModal.js`
- **Features**:
  - Green success icon
  - Reservation details (reference, dates, total)
  - Email confirmation notice
  - Smooth close button

## Usage

### Testing Email Sending

1. **Local Development**:

   - Use Mailtrap or similar service for testing
   - Update MAIL\_\* variables in `.env`

2. **Production**:
   - Ensure SMTP credentials are valid
   - Verify FRONTEND_URL points to production domain

### Customizing Email Templates

Email templates are located in `back/resources/views/emails/`:

- `reservation-confirmation.blade.php`
- `verify-email.blade.php`
- `reset-password.blade.php`

You can customize:

- Colors (search for color hex codes)
- Typography (update font-family in styles)
- Content (modify HTML and Blade variables)
- Branding (update logo, social links in footer)

### Email Variables

#### Reservation Confirmation

- `$reservation->ref` - Reference number
- `$reservation->name` - Guest name
- `$reservation->email` - Guest email
- `$reservation->phone` - Guest phone
- `$reservation->start_date` - Check-in date
- `$reservation->end_date` - Check-out date
- `$reservation->nights` - Number of nights
- `$reservation->total` - Total price
- `$reservation->listing` - Related listing object
- `$reservation->currency` - Currency object

#### Email Verification

- `$verificationUrl` - Signed verification URL

#### Password Reset

- `$resetUrl` - Password reset URL with token

## Error Handling

- Reservation email failures are logged but don't prevent reservation creation
- Email verification and password reset use Laravel's built-in retry mechanisms
- All email templates include fallback links for button failures

## Future Enhancements

1. Add email templates for:
   - Reservation cancellation
   - Reservation modification
   - Welcome email for new users
   - Booking reminders (24 hours before check-in)
2. Implement email queuing for better performance
3. Add email analytics tracking
4. Support multiple languages
5. Add calendar attachments (.ics files) to reservation emails

## Troubleshooting

### Emails Not Sending

1. Check `.env` mail configuration
2. Verify SMTP credentials are correct
3. Check Laravel logs in `back/storage/logs/laravel.log`
4. Test with: `php artisan tinker` then `Mail::raw('Test', function($msg) { $msg->to('test@example.com')->subject('Test'); });`

### Incorrect URLs in Emails

1. Verify `FRONTEND_URL` in `.env`
2. Check `config/app.php` has `frontend_url` configuration
3. Run `php artisan config:cache` to refresh config

### Styling Issues

1. Test email in different email clients
2. Use inline styles (already implemented)
3. Avoid complex CSS (flexbox, grid) - use tables for layout
