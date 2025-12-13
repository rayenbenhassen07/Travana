<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bienvenue sur {{ config('app.name') }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .content {
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #dee2e6;
            border-radius: 5px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FFA500;
            color: #fff !important;
            text-decoration: none !important;
            border-radius: 4px;
            margin: 20px 0;
            font-weight: bold;
        }
        .button:hover {
            background-color: #e69702;
            color: #fff !important;
        }
        .button:visited {
            color: #fff !important;
        }
        .button:active {
            color: #fff !important;
        }
        .footer {
            margin-top: 20px;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
            padding: 10px;
            border-radius: 4px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Bienvenue sur {{ config('app.name') }}</h1>
    </div>

    <div class="content">
        <h2>Bonjour {{ $user->name }},</h2>
        
        <p>Un compte a été créé pour vous sur {{ config('app.name') }}. Nous sommes ravis de vous accueillir !</p>
        
        <p><strong>Vos informations de compte :</strong></p>
        <ul>
            <li><strong>Nom :</strong> {{ $user->name }}</li>
            <li><strong>Email :</strong> {{ $user->email }}</li>
            @if($user->phone)
            <li><strong>Téléphone :</strong> {{ $user->phone }}</li>
            @endif
            <li><strong>Type de compte :</strong> {{ ucfirst($user->user_type) }}</li>
            <li><strong>Mot de passe temporaire :</strong> <code style="background: #f8f9fa; padding: 2px 8px; border-radius: 4px;">{{ $temporaryPassword }}</code></li>
        </ul>
        
        <div class="warning">
            <strong>Important :</strong> Pour des raisons de sécurité, vous devez définir votre propre mot de passe. Votre e-mail a été automatiquement vérifié.
        </div>

        <div style="text-align: center;">
            <a href="{{ $resetUrl }}" class="button" style="color: #fff !important; text-decoration: none !important;">Définir mon mot de passe</a>
        </div>
        
        <p>Une fois votre mot de passe défini, vous pourrez accéder immédiatement à votre compte.</p>
        
        <p>Si vous avez des questions, n'hésitez pas à contacter notre équipe de support.</p>
        
        <p>Cordialement,<br>L'équipe {{ config('app.name') }}</p>
    </div>

    <div class="footer">
        <p>Si vous avez des difficultés à cliquer sur le bouton, copiez et collez l'URL ci-dessous dans votre navigateur web :</p>
        <p style="word-break: break-all;">{{ $resetUrl }}</p>
        
        <p>Ce courriel a été envoyé à {{ $user->email }}. Si vous n'attendiez pas cet e-mail, veuillez l'ignorer.</p>
    </div>
</body>
</html>
