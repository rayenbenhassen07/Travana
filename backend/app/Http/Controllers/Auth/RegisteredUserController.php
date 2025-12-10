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
    /**
     * @OA\Post(
     *     path="/auth/register",
     *     summary="Register a new user",
     *     description="Create a new user account and return authentication token. A verification email will be sent.",
     *     operationId="register",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"username", "email", "sex", "phone", "password", "password_confirmation"},
     *             @OA\Property(property="username", type="string", example="John Doe", description="User's display name"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com", description="User's email address"),
     *             @OA\Property(property="sex", type="string", enum={"male", "female"}, example="male", description="User's sex"),
     *             @OA\Property(property="phone", type="string", example="+1234567890", description="User's phone number"),
     *             @OA\Property(property="password", type="string", format="password", example="password123", description="Password (min 8 characters)"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="password123", description="Password confirmation")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User registered successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User registered successfully. Please check your email to verify your account."),
     *             @OA\Property(
     *                 property="user",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="John Doe"),
     *                 @OA\Property(property="email", type="string", example="john@example.com"),
     *                 @OA\Property(property="sex", type="string", example="male"),
     *                 @OA\Property(property="phone", type="string", example="+1234567890"),
     *                 @OA\Property(property="type", type="string", example="user"),
     *                 @OA\Property(property="email_verified_at", type="string", nullable=true, example=null)
     *             ),
     *             @OA\Property(property="token", type="string", example="1|abc123xyz...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(ref="#/components/schemas/ValidationError")
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Registration failed",
     *         @OA\JsonContent(ref="#/components/schemas/Error")
     *     )
     * )
     *
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'username' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
                'sex' => ['required', 'string', 'in:male,female'],
                'phone' => ['required', 'string', 'max:50'],
                'password' => ['required', 'string', 'min:8'],
                'password_confirmation' => ['required', 'string', 'same:password'],
            ]);

            $user = User::create([
                'name' => $validated['username'],
                'email' => $validated['email'],
                'sex' => $validated['sex'],
                'phone' => $validated['phone'],
                'password' => Hash::make($validated['password']),
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
                    'sex' => $user->sex,
                    'phone' => $user->phone,
                    'type' => $user->type,
                    'email_verified_at' => $user->email_verified_at,
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
