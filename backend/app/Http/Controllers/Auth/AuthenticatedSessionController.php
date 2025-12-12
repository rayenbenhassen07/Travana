<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    public function store(LoginRequest $request)
    {
        try {
            $request->authenticate();

            $user = $request->user();
            
            // Update last login time
            $user->updateLastLogin();
            
            // Create token for API authentication
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'date_of_birth' => $user->date_of_birth,
                    'profile_photo' => $user->profile_photo,
                    'bio' => $user->bio,
                    'user_type' => $user->user_type,
                    'is_verified' => $user->is_verified,
                    'is_active' => $user->is_active,
                    'email_verified_at' => $user->email_verified_at,
                    'last_login_at' => $user->last_login_at,
                    'language' => $user->preferredLanguage,
                    'currency' => $user->preferredCurrency,
                ],
                'token' => $token,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Invalid credentials',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Login failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        // Revoke the user's current token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
    
    public function me(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'date_of_birth' => $user->date_of_birth,
            'profile_photo' => $user->profile_photo,
            'bio' => $user->bio,
            'user_type' => $user->user_type,
            'is_verified' => $user->is_verified,
            'is_active' => $user->is_active,
            'email_verified_at' => $user->email_verified_at,
            'last_login_at' => $user->last_login_at,
            'language' => $user->preferredLanguage,
            'currency' => $user->preferredCurrency,
        ]);
    }
}
