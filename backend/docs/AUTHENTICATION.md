# Authentication System Documentation# Authentication Guide

## OverviewTravana uses Laravel Sanctum for API authentication with Bearer tokens.

The Travana API uses Laravel Sanctum for token-based authentication with email verification.

## Overview

## Authentication Endpoints

The authentication system provides:

All authentication endpoints are under the `/api` prefix and do NOT require CSRF tokens.

-   User registration

### Base URL- Login with email/password

```- Token-based API authentication

http://localhost:8000/api-   Logout (token revocation)

```

## Authentication Flow

## Complete Authentication Flow

````

### 1. User Registration1. Register or Login → Receive Bearer Token

**Endpoint:** `POST /api/register`2. Include token in Authorization header for protected routes

3. Token remains valid until logout or manual revocation

**Request Body:**```

```json

{## Endpoints

  "username": "John Doe",

  "email": "john@example.com",### Register

  "sex": "male",

  "phone": "+1234567890",Create a new user account and receive an authentication token.

  "password": "password123",

  "password_confirmation": "password123"```

}POST /api/auth/register

````

**Validation Rules:\*\***Request Body:\*\*

-   `username`: required, string, max 255 characters

-   `email`: required, valid email, unique, max 255 characters```json

-   `sex`: required, either "male" or "female"{

-   `phone`: required, string, max 50 characters "username": "John Doe",

-   `password`: required, minimum 8 characters "email": "john@example.com",

-   `password_confirmation`: required, must match password "password": "password123",

    "password_confirmation": "password123"

**Response (201):**}

`json`

{

"message": "User registered successfully. Please check your email to verify your account.",**Response (201 Created):**

"user": {

    "id": 1,```json

    "name": "John Doe",{

    "email": "john@example.com",    "message": "User registered successfully",

    "sex": "male",    "user": {

    "phone": "+1234567890",        "id": 1,

    "type": "user",        "name": "John Doe",

    "email_verified_at": null        "email": "john@example.com",

}, "type": "user"

"token": "1|abc123xyz..." },

} "token": "1|abc123xyz456..."

```}

```

**Notes:**

-   A verification email is automatically sent**Validation Rules:**

-   User receives a token immediately but `email_verified_at` is null| Field | Rules |

-   Token should be stored in localStorage/cookies for subsequent requests|-------|-------|

| username | Required, string, max 255 characters |

### 2. Email Verification| email | Required, valid email, unique |

| password | Required, string, min 8 characters |

#### Verify Email (via email link)| password_confirmation | Required, must match password |

**Endpoint:** `GET /api/verify-email/{id}/{hash}`

---

**URL Parameters:**

-   `id`: User ID (auto-filled from email link)### Login

-   `hash`: SHA1 hash of user email (auto-filled)

-   `signature`: Signed URL parameter (auto-generated)Authenticate an existing user and receive a token.

-   `expires`: Expiration timestamp (auto-generated, 60 minutes)

`````

**Behavior:**POST /api/auth/login

The endpoint automatically redirects to your frontend:```



- ✅ **Success:** `{FRONTEND_URL}/verify-email-success`**Request Body:**

- ✅ **Already verified:** `{FRONTEND_URL}/verify-email-success?already=true`

- ❌ **Invalid hash:** `{FRONTEND_URL}/verify-email-failed?error=invalid````json

- ❌ **Expired link:** `{FRONTEND_URL}/verify-email-failed?error=expired`{

    "email": "john@example.com",

**Security:**    "password": "password123"

- Validates hash matches user's email (prevents tampering)}

- Checks signature and expiration (prevents replay attacks)```

- No authentication required (user clicks link from email)

**Response (200 OK):**

#### Resend Verification Email

**Endpoint:** `POST /api/email/verification-notification````json

{

**Headers:**    "message": "Login successful",

```    "user": {

Authorization: Bearer {token}        "id": 1,

Content-Type: application/json        "name": "John Doe",

```        "email": "john@example.com",

        "type": "user"

**Response (200):**    },

```json    "token": "2|def456abc789..."

{}

  "message": "Verification email sent successfully"```

}

```**Error Response (422):**



**Error (429 - Too Many Requests):**```json

```json{

{    "message": "Invalid credentials",

  "message": "Too many requests. Please try again later."    "errors": {

}        "email": ["These credentials do not match our records."]

```    }

}

**Notes:**```

- Requires authentication (Bearer token in header)

- Rate limited: 6 attempts per minute---

- Only sends if email is not already verified

- Same rate limit applies per user### Get Current User



### 3. User LoginRetrieve the authenticated user's information.

**Endpoint:** `POST /api/login`

`````

**Request Body:**GET /api/auth/me

`json`

{

"email": "john@example.com",**Headers:**

"password": "password123"

}```

```Authorization: Bearer {token}

```

**Response (200):**

````json**Response (200 OK):**

{

  "token": "2|xyz789abc...",```json

  "user": {{

    "id": 1,    "id": 1,

    "name": "John Doe",    "name": "John Doe",

    "email": "john@example.com",    "email": "john@example.com",

    "sex": "male",    "type": "user"

    "phone": "+1234567890",}

    "type": "user",```

    "email_verified_at": "2025-12-07T10:30:00.000000Z"

  }---

}

```### Logout



**Error (401 - Unauthorized):**Revoke the current access token.

```json

{```

  "message": "Invalid credentials"POST /api/auth/logout

}```

````

**Headers:**

**Frontend Logic:**

`javascript`

const handleLogin = async (credentials) => {Authorization: Bearer {token}

const response = await axios.post('/api/login', credentials);```

const { token, user } = response.data;

**Response (200 OK):**

// Store token

localStorage.setItem('token', token);```json

{

// Check if email is verified "message": "Logged out successfully"

if (!user.email_verified_at) {}

    // Show verification notice```

    showVerificationNotice(user.email);

} else {## Using Authentication

    // Redirect to dashboard

    router.push('/dashboard');### Making Authenticated Requests

}

};Include the Bearer token in the Authorization header:

````

```bash

### 4. Get Current User# Using cURL

**Endpoint:** `GET /api/me`curl -X GET http://localhost:8000/api/auth/me \

  -H "Authorization: Bearer 1|abc123xyz456..."

**Headers:**

```# Using HTTPie

Authorization: Bearer {token}http GET localhost:8000/api/auth/me \

```  Authorization:"Bearer 1|abc123xyz456..."



**Response (200):**# Using JavaScript Fetch

```jsonfetch('http://localhost:8000/api/auth/me', {

{  headers: {

  "id": 1,    'Authorization': 'Bearer 1|abc123xyz456...',

  "name": "John Doe",    'Accept': 'application/json'

  "email": "john@example.com",  }

  "sex": "male",})

  "phone": "+1234567890",```

  "type": "user",

  "email_verified_at": "2025-12-07T10:30:00.000000Z",### Using with Swagger UI

  "created_at": "2025-12-07T09:00:00.000000Z",

  "updated_at": "2025-12-07T10:30:00.000000Z"1. Open Swagger UI at `/api/documentation`

}2. Click the "Authorize" button (🔓 icon)

```3. Enter your token: `Bearer 1|abc123xyz456...`

4. Click "Authorize"

**Error (401):**5. All protected endpoints will now use your token

```json

{## Protected vs Public Endpoints

  "message": "Unauthenticated"

}### Public Endpoints (No Authentication Required)

````

Most GET endpoints are public:

**Use Cases:**

-   Hydrate user data on app load- `GET /api/categories`

-   Verify token is still valid- `GET /api/cities`

-   Check email verification status- `GET /api/listings`

-   Get updated user profile- `GET /api/blogs`

-   `GET /api/blog-categories`

### 5. User Logout- `GET /api/blog-tags`

**Endpoint:** `POST /api/logout`- `GET /api/blogs/{id}/comments`

**Headers:**### Protected Endpoints (Authentication Required)

```

Authorization: Bearer {token}Creating, updating, or deleting resources typically requires authentication:

```

**Blog Management:**

**Response (200):**

```json-   `POST /api/blogs` - Create blog

{- `PUT /api/blogs/{id}` - Update blog

"message": "Logged out successfully"- `DELETE /api/blogs/{id}` - Delete blog

}

````**Blog Categories/Tags (Admin):**



**Behavior:**-   `POST /api/blog-categories` - Create category

- Revokes the current access token-   `PUT /api/blog-categories/{id}` - Update category

- Other tokens (if any) remain valid-   `DELETE /api/blog-categories/{id}` - Delete category

- User must login again to get a new token-   `POST /api/blog-tags` - Create tag

-   `PUT /api/blog-tags/{id}` - Update tag

## Frontend Integration Guide-   `DELETE /api/blog-tags/{id}` - Delete tag



### 1. Axios Configuration**Blog Comments:**



**Setup (lib/axios.js):**-   `POST /api/blogs/{id}/comments` - Create comment

```javascript-   `PUT /api/blogs/{blogId}/comments/{id}` - Update comment

import axios from 'axios';-   `DELETE /api/blogs/{blogId}/comments/{id}` - Delete comment

-   `POST /api/blogs/{blogId}/comments/{id}/like` - Like comment

const instance = axios.create({

  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',**Blog Likes:**

  headers: {

    'Content-Type': 'application/json',-   `POST /api/blogs/{id}/like` - Toggle like

    'Accept': 'application/json',-   `GET /api/blogs/{id}/like/check` - Check if liked

  },-   `GET /api/blogs/{id}/likes` - Get all likes

});

**Admin Comments:**

// Auto-attach token to requests

instance.interceptors.request.use((config) => {-   `GET /api/admin/comments` - Get all comments

  const token = localStorage.getItem('token');-   `PATCH /api/admin/comments/{id}/status` - Update status

  if (token) {

    config.headers.Authorization = `Bearer ${token}`;## User Types

  }

  return config;The system supports two user types:

});

| Type          | Value   | Description                       |

// Handle 401 errors (token expired/invalid)| ------------- | ------- | --------------------------------- |

instance.interceptors.response.use(| Regular User  | `user`  | Default type for registered users |

  (response) => response,| Administrator | `admin` | Has elevated permissions          |

  (error) => {

    if (error.response?.status === 401) {User type is set during user creation and can be updated by administrators.

      localStorage.removeItem('token');

      window.location.href = '/login';## Token Management

    }

    return Promise.reject(error);### Token Storage

  }

);Tokens are stored in the `personal_access_tokens` table and associated with the user.



export default instance;### Token Lifetime

````

By default, tokens do not expire. You can configure expiration in `config/sanctum.php`:

### 2. Auth Store (Zustand)

````php

**store/useAuthStore.js:**'expiration' => 60 * 24 * 7, // 7 days in minutes

```javascript```

import { create } from 'zustand';

import axios from '@/lib/axios';### Multiple Tokens



const useAuthStore = create((set, get) => ({A user can have multiple active tokens (e.g., for different devices). Each login creates a new token.

  user: null,

  token: null,### Revoking All Tokens



  register: async (userData) => {To log out from all devices, you would need to implement a custom endpoint that revokes all tokens:

    try {

      const response = await axios.post('/api/register', userData);```php

      const { token, user } = response.data;$request->user()->tokens()->delete();

      ```

      localStorage.setItem('token', token);

      set({ user, token });## Security Best Practices



      return { success: true, user, token };1. **Store tokens securely** - Never store tokens in localStorage for production apps

    } catch (error) {2. **Use HTTPS** - Always use HTTPS in production

      return {3. **Token expiration** - Consider setting token expiration for sensitive applications

        success: false,4. **Logout on password change** - Revoke all tokens when password is changed

        error: error.response?.data?.message,5. **Rate limiting** - The API includes rate limiting on authentication endpoints

        errors: error.response?.data?.errors,

      };## Error Responses

    }

  },### 401 Unauthorized



  login: async (credentials) => {Returned when:

    try {

      const response = await axios.post('/api/login', credentials);-   No token provided

      const { token, user } = response.data;-   Invalid token

      -   Expired token

      localStorage.setItem('token', token);

      set({ user, token });```json

      {

      return { success: true, user, token };    "message": "Unauthenticated."

    } catch (error) {}

      return {```

        success: false,

        error: error.response?.data?.message,### 422 Validation Error

      };

    }Returned for invalid credentials or validation failures:

  },

  ```json

  logout: async () => {{

    try {    "message": "Validation failed",

      await axios.post('/api/logout');    "errors": {

      localStorage.removeItem('token');        "email": ["The email field is required."],

      set({ user: null, token: null });        "password": ["The password must be at least 8 characters."]

      return { success: true };    }

    } catch (error) {}

      // Clear local state even if API call fails```

      localStorage.removeItem('token');

      set({ user: null, token: null });## Example: Complete Auth Flow

      return { success: false };

    }```javascript

  },// 1. Register

  const registerResponse = await fetch("/api/auth/register", {

  hydrateAuth: async () => {    method: "POST",

    const token = localStorage.getItem('token');    headers: {

    if (!token) return;        "Content-Type": "application/json",

            Accept: "application/json",

    try {    },

      const response = await axios.get('/api/me');    body: JSON.stringify({

      set({ user: response.data, token });        username: "John Doe",

    } catch (error) {        email: "john@example.com",

      localStorage.removeItem('token');        password: "password123",

      set({ user: null, token: null });        password_confirmation: "password123",

    }    }),

  },});

  const { token } = await registerResponse.json();

  resendVerification: async () => {

    try {// 2. Store token (securely in production!)

      await axios.post('/api/email/verification-notification');localStorage.setItem("authToken", token);

      return {

        success: true,// 3. Make authenticated request

        message: 'Verification email sent successfully!',const meResponse = await fetch("/api/auth/me", {

      };    headers: {

    } catch (error) {        Authorization: `Bearer ${token}`,

      return {        Accept: "application/json",

        success: false,    },

        error: error.response?.data?.message || 'Failed to send verification email',});

      };const user = await meResponse.json();

    }

  },// 4. Logout

}));await fetch("/api/auth/logout", {

    method: "POST",

export default useAuthStore;    headers: {

```        Authorization: `Bearer ${token}`,

        Accept: "application/json",

### 3. Email Verification Flow    },

});

**After Registration (register/page.js):**localStorage.removeItem("authToken");

```javascript```

const onSubmit = async (data) => {
  const result = await register(data);

  if (result.success) {
    // Show verification notice, DON'T redirect
    setShowVerificationNotice(true);
    setUserEmail(result.user.email);
  } else {
    setErrors(result.errors);
  }
};

return showVerificationNotice ? (
  <VerifyEmailNotice email={userEmail} />
) : (
  <RegisterForm onSubmit={onSubmit} />
);
````

**After Login (login/page.js):**

```javascript
const onSubmit = async (data) => {
    const result = await login(data);

    if (result.success) {
        // Check if email is verified
        if (!result.user.email_verified_at) {
            setShowVerificationNotice(true);
            setUserEmail(result.user.email);
        } else {
            router.push("/dashboard");
        }
    } else {
        setError(result.error);
    }
};

return showVerificationNotice ? (
    <VerifyEmailNotice email={userEmail} />
) : (
    <LoginForm onSubmit={onSubmit} />
);
```

**Verification Notice Component:**

```javascript
const VerifyEmailNotice = ({ email }) => {
    const { resendVerification } = useAuthStore();
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState(null);

    const handleResend = async () => {
        setSending(true);
        const result = await resendVerification();
        setMessage(result.success ? result.message : result.error);
        setSending(false);
    };

    return (
        <Alert variant="info">
            <p>
                Un email de vérification a été envoyé à:{" "}
                <strong>{email}</strong>
            </p>
            <button onClick={handleResend} disabled={sending}>
                {sending ? "Envoi..." : "Renvoyer l'email"}
            </button>
            {message && <p>{message}</p>}
        </Alert>
    );
};
```

### 4. Verification Pages

**Success Page (verify-email-success/page.js):**

```javascript
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const alreadyVerified = searchParams.get("already") === "true";
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const redirect = setTimeout(() => {
            router.push("/login");
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirect);
        };
    }, [router]);

    return (
        <div>
            <Alert variant="success">
                <h1>
                    {alreadyVerified
                        ? "Votre email est déjà vérifié"
                        : "Email vérifié avec succès !"}
                </h1>
                <p>
                    Redirection vers la connexion dans {countdown} secondes...
                </p>
            </Alert>
        </div>
    );
}
```

**Failed Page (verify-email-failed/page.js):**

```javascript
"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailFailed() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const errorMessages = {
        invalid: "Le lien de vérification est invalide.",
        expired: "Le lien de vérification a expiré.",
    };

    return (
        <div>
            <Alert variant="error">
                <h1>Échec de la vérification</h1>
                <p>{errorMessages[error] || "Une erreur est survenue."}</p>
                <Link href="/login">Se connecter pour renvoyer un email</Link>
            </Alert>
        </div>
    );
}
```

## Security Features

### 1. Token-Based Authentication

-   Uses Laravel Sanctum Bearer tokens
-   Tokens stored in localStorage (client-side)
-   Each token tied to specific user
-   Tokens can be revoked individually

### 2. CSRF Protection

-   **Disabled for all `/api/*` routes**
-   API uses token authentication instead
-   Configured in `bootstrap/app.php`:

```php
$middleware->validateCsrfTokens(except: [
    'api/*',
]);
```

### 3. Rate Limiting

-   **Login/Register:** 60 requests per minute (default)
-   **Email Verification:** 6 requests per minute
-   **Resend Verification:** 6 requests per minute per user

### 4. Email Verification Security

-   **Signed URLs:** Prevents tampering with verification links
-   **Hash Verification:** Ensures link matches user's email
-   **Expiration:** Links expire after 60 minutes
-   **One-time Use:** Checks if already verified

### 5. Password Security

-   Minimum 8 characters required
-   Hashed using bcrypt (Laravel default)
-   Must be confirmed during registration

## Configuration

### Backend (.env)

```env
# App
APP_NAME=Travana
APP_URL=http://localhost:8000

# Frontend URL for email verification redirects
FRONTEND_URL=http://localhost:3000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=travana
DB_USERNAME=root
DB_PASSWORD=

# Email (Gmail example)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@travana.com
MAIL_FROM_NAME="${APP_NAME}"

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DRIVER=cookie
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Testing

### Manual Testing with cURL

**Register:**

```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Test User",
    "email": "test@example.com",
    "sex": "male",
    "phone": "+1234567890",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Current User:**

```bash
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Resend Verification:**

```bash
curl -X POST http://localhost:8000/api/email/verification-notification \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Logout:**

```bash
curl -X POST http://localhost:8000/api/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Issue: CSRF Token Mismatch

**Solution:**

-   Ensure `/api/*` is in CSRF exception list
-   Check `bootstrap/app.php` configuration
-   Verify routes are under `/api` prefix

### Issue: Email Not Sending

**Checks:**

1. Verify SMTP credentials in `.env`
2. Check Laravel logs: `storage/logs/laravel.log`
3. For Gmail: Use app-specific password (not account password)
4. Test with `php artisan tinker`:

```php
Mail::raw('Test', function($msg) {
    $msg->to('test@example.com')->subject('Test');
});
```

### Issue: Verification Link Not Working

**Checks:**

1. Verify `FRONTEND_URL` is set in `.env`
2. Check link hasn't expired (60 minutes)
3. Ensure route has `signed` middleware
4. Verify no `auth` middleware on verification route

### Issue: "Route not found" Errors

**Solution:**

1. Run `php artisan route:clear`
2. Run `php artisan route:list` to verify routes
3. Check `bootstrap/app.php` for route loading
4. Ensure `routes/auth.php` not loaded twice (once in `web.php`)

### Issue: Duplicate Routes

**Solution:**
Remove `require __DIR__.'/auth.php';` from `routes/web.php` if present

### Issue: 401 Unauthorized on Protected Routes

**Checks:**

1. Token included in Authorization header
2. Token format: `Bearer {token}` (note the space)
3. Token not expired or revoked
4. Route has `auth:sanctum` middleware

## Route Summary

All authentication routes are under `/api` prefix:

| Method | Endpoint                               | Auth Required | Description               |
| ------ | -------------------------------------- | ------------- | ------------------------- |
| POST   | `/api/register`                        | No            | Register new user         |
| POST   | `/api/login`                           | No            | Login user                |
| POST   | `/api/logout`                          | Yes           | Logout current user       |
| GET    | `/api/me`                              | Yes           | Get current user          |
| GET    | `/api/verify-email/{id}/{hash}`        | No            | Verify email (signed URL) |
| POST   | `/api/email/verification-notification` | Yes           | Resend verification email |

## Best Practices

### 1. Token Management

-   Store tokens securely (httpOnly cookies preferred for production)
-   Clear tokens on logout
-   Handle 401 errors globally (redirect to login)
-   Don't expose tokens in logs or error messages

### 2. Error Handling

-   Display user-friendly error messages
-   Log detailed errors server-side
-   Translate validation errors to user's language
-   Provide clear actionable feedback

### 3. User Experience

-   Show email verification notice immediately after registration
-   Allow resending verification emails
-   Auto-redirect after successful verification
-   Provide countdown timers for redirects
-   Disable buttons while API calls in progress

### 4. Security

-   Always use HTTPS in production
-   Validate all inputs server-side
-   Rate limit authentication endpoints
-   Log authentication attempts
-   Monitor for suspicious activity

## API Response Patterns

### Success Response

```json
{
  "data": { ... },
  "message": "Operation successful"
}
```

### Validation Error Response (422)

```json
{
    "message": "Validation failed",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password must be at least 8 characters."]
    }
}
```

### Authentication Error Response (401)

```json
{
    "message": "Unauthenticated"
}
```

### Rate Limit Error Response (429)

```json
{
    "message": "Too many requests. Please try again later."
}
```

## Migration from Old Routes

If you were using `/api/auth/*` routes, update your frontend:

**Old:**

```javascript
POST /api/auth/register  → POST /api/register
POST /api/auth/login     → POST /api/login
POST /api/auth/logout    → POST /api/logout
GET  /api/auth/me        → GET  /api/me
```

**Update all axios calls:**

```javascript
// Before
axios.post("/api/auth/login", credentials);

// After
axios.post("/api/login", credentials);
```
