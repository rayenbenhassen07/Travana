<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(Request $request, $id, $hash)
    {
        // Find the user
        $user = User::findOrFail($id);

        // Verify the hash matches the user's email
        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return redirect(config('app.frontend_url') . '/verify-email-failed?error=invalid');
        }

        // Verify the signature and expiration
        if (! $request->hasValidSignature()) {
            return redirect(config('app.frontend_url') . '/verify-email-failed?error=expired');
        }

        // Check if already verified
        if ($user->hasVerifiedEmail()) {
            return redirect(config('app.frontend_url') . '/verify-email-success?already=true');
        }

        // Mark as verified
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // Redirect to frontend success page
        return redirect(config('app.frontend_url') . '/verify-email-success');
    }
}
