<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\NewUserWelcome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        try {
            $users = User::with(['properties', 'listingReservations'])->get();
            
            // Add needs_password_change flag
            $users->each(function ($user) {
                $user->needs_password_change = $user->needsPasswordChange();
            });
            
            return response()->json($users);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'phone' => 'nullable|string|max:20',
                'date_of_birth' => 'nullable|date',
                'profile_photo' => 'nullable|string|max:255',
                'bio' => 'nullable|string',
                'user_type' => ['required', Rule::in(['user', 'admin'])],
                'is_verified' => 'boolean',
                'is_active' => 'boolean',
                'language_id' => 'nullable|exists:languages,id',
                'currency_id' => 'nullable|exists:currencies,id',
                'send_welcome_email' => 'boolean',
            ]);

            // Generate a random temporary password
            $temporaryPassword = Str::random(12);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($temporaryPassword),
                'phone' => $request->phone,
                'date_of_birth' => $request->date_of_birth,
                'profile_photo' => $request->profile_photo,
                'bio' => $request->bio,
                'user_type' => $request->user_type,
                'is_verified' => $request->is_verified ?? false,
                'is_active' => $request->is_active ?? true,
                'language_id' => $request->language_id,
                'currency_id' => $request->currency_id,
            ]);

            // Send welcome email with temporary password
            if ($request->get('send_welcome_email', true)) {
                try {
                    Mail::to($user->email)->send(new NewUserWelcome($user, $temporaryPassword));
                } catch (\Exception $mailException) {
                    // Log the error but don't fail the user creation
                    \Log::error('Failed to send welcome email to ' . $user->email . ': ' . $mailException->getMessage());
                }
            }

            return response()->json([
                'user' => $user,
                'message' => 'User created successfully. A welcome email has been sent with login credentials.',
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = User::with(['properties', 'listingReservations'])->findOrFail($id);
            $user->needs_password_change = $user->needsPasswordChange();
            return response()->json($user);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email|unique:users,email,' . $id,
                'password' => 'nullable|string|min:8',
                'phone' => 'nullable|string|max:20',
                'date_of_birth' => 'nullable|date',
                'profile_photo' => 'nullable|string|max:255',
                'bio' => 'nullable|string',
                'user_type' => ['sometimes', Rule::in(['user', 'admin'])],
                'is_verified' => 'boolean',
                'is_active' => 'boolean',
                'language_id' => 'nullable|exists:languages,id',
                'currency_id' => 'nullable|exists:currencies,id',
            ]);

            $data = $request->only([
                'name', 
                'email', 
                'phone', 
                'date_of_birth', 
                'profile_photo', 
                'bio', 
                'user_type',
                'is_verified',
                'is_active',
                'language_id',
                'currency_id'
            ]);
            
            // Only update password if provided
            if ($request->filled('password')) {
                $data['password'] = Hash::make($request->password);
                $data['password_changed_at'] = now();
            }

            $user->update($data);
            
            return response()->json($user);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            
            // Prevent deleting yourself
            if ($user->id === auth()->id()) {
                return response()->json([
                    'message' => 'Cannot delete your own account',
                ], 403);
            }
            
            // Check if user has properties or reservations
            $propertiesCount = $user->properties()->count();
            $reservationsCount = $user->listingReservations()->count();
            
            if ($propertiesCount > 0 || $reservationsCount > 0) {
                return response()->json([
                    'message' => 'Cannot delete user with existing data',
                    'error' => "This user has {$propertiesCount} property(s) and {$reservationsCount} reservation(s) associated with it.",
                ], 409);
            }
            
            $user->delete();
            
            return response()->json(['message' => 'User deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
