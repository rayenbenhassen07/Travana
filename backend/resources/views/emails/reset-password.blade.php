<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Réinitialisation de mot de passe</title>
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
        <h1>Réinitialisation de mot de passe - {{ config('app.name') }}</h1>
    </div>

    <div class="content">
        <h2>Bonjour,</h2>
        
        <p>Vous recevez cet e-mail car nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>

        <div style="text-align: center;">
            <a href="{{ $resetUrl }}" class="button" style="color: #fff !important; text-decoration: none !important;">Réinitialiser le mot de passe</a>
        </div>
        
        <div class="warning">
            <strong>Important :</strong> Ce lien expirera dans 60 minutes. Veuillez l'utiliser dès que possible.
        </div>
        
        <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, aucune action n'est requise. Votre compte reste sécurisé.</p>
        
        <p>Cordialement,<br>L'équipe {{ config('app.name') }}</p>
    </div>

    <div class="footer">
        <p>Si vous avez des difficultés à cliquer sur le bouton, copiez et collez l'URL ci-dessous dans votre navigateur web :</p>
        <p style="word-break: break-all;">{{ $resetUrl }}</p>
    </div>
</body>
</html>