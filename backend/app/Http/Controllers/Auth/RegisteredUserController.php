<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
                'phone' => ['required', 'string', 'max:20'],
                'password' => ['required', 'string', 'min:8'],
                'password_confirmation' => ['required', 'string', 'same:password'],
                'date_of_birth' => ['nullable', 'date'],
                'bio' => ['nullable', 'string'],
                'language_id' => ['nullable', 'exists:languages,id'],
                'currency_id' => ['nullable', 'exists:currencies,id'],
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'password' => Hash::make($validated['password']),
                'date_of_birth' => $validated['date_of_birth'] ?? null,
                'bio' => $validated['bio'] ?? null,
                'user_type' => 'user',
                'is_verified' => false,
                'is_active' => true,
                'language_id' => $validated['language_id'] ?? null,
                'currency_id' => $validated['currency_id'] ?? null,
            ]);

            // Send verification email
            event(new Registered($user));

            // Create token for API authentication
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'message' => 'User registered successfully. Please check your email to verify your account.',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'date_of_birth' => $user->date_of_birth,
                    'bio' => $user->bio,
                    'user_type' => $user->user_type,
                    'is_verified' => $user->is_verified,
                    'is_active' => $user->is_active,
                    'email_verified_at' => $user->email_verified_at,
                    'language' => $user->preferredLanguage,
                    'currency' => $user->preferredCurrency,
                ],
                'token' => $token,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
