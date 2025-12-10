<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // If user is authenticated
        if ($request->user()) {
            if ($request->user()->hasVerifiedEmail()) {
                return response()->json([
                    'message' => 'Email already verified',
                    'verified' => true,
                ]);
            }

            $request->user()->sendEmailVerificationNotification();

            return response()->json([
                'message' => 'Verification link sent',
                'status' => 'verification-link-sent',
            ]);
        }

        // If user is not authenticated, require email in request
        $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'If this email exists, a verification link will be sent.',
                'status' => 'verification-link-sent',
            ]);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified',
                'verified' => true,
            ]);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Verification link sent',
            'status' => 'verification-link-sent',
        ]);
    }
}
