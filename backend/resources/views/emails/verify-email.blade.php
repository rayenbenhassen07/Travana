<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Vérification de votre email</title>
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
        <h1>Vérification de votre email - {{ config('app.name') }}</h1>
    </div>

    <div class="content">
        <h2>Bonjour,</h2>
        
        <p>Merci de vous être inscrit sur {{ config('app.name') }}. Pour finaliser votre inscription et activer votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>

        <div style="text-align: center;">
            <a href="{{ $verificationUrl }}" class="button" style="color: #fff !important; text-decoration: none !important;">Vérifier mon email</a>
        </div>
        
        <div class="warning">
            <strong>Important :</strong> Ce lien expirera dans 60 minutes. Veuillez l'utiliser dès que possible.
        </div>
        
        <p>Si vous n'avez pas créé de compte sur {{ config('app.name') }}, veuillez ignorer cet email.</p>
        
        <p>Cordialement,<br>L'équipe {{ config('app.name') }}</p>
    </div>

    <div class="footer">
        <p>Si vous avez des difficultés à cliquer sur le bouton, copiez et collez l'URL ci-dessous dans votre navigateur web :</p>
        <p style="word-break: break-all;">{{ $verificationUrl }}</p>
    </div>
        .greeting {
            font-size: 16px;
            color: #1e293b;
            margin-bottom: 16px;
            font-weight: 500;
        }
        .message {
            color: #64748b;
            margin-bottom: 24px;
            font-size: 14px;
            line-height: 1.7;
        }
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        .button {
            display: inline-block;
            background-color: #7c3aed;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 36px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
        }
        .info-box {
            background-color: #fef3c7;
            border-left: 3px solid #f59e0b;
            border-radius: 6px;
            padding: 14px 16px;
            margin: 24px 0;
        }
        .info-box-text {
            font-size: 12px;
            color: #92400e;
            line-height: 1.5;
        }
        .alternative-link {
            margin-top: 24px;
            padding: 16px;
            background-color: #f8fafc;
            border-radius: 6px;
            font-size: 12px;
            color: #64748b;
        }
        .alternative-link-label {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
        }
        .link-text {
            word-break: break-all;
            color: #7c3aed;
            background-color: #fff;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
            font-family: 'Courier New', monospace;
            font-size: 11px;
        }
        .footer {
            background-color: #1e293b;
            padding: 32px 30px;
            text-align: center;
            color: #94a3b8;
            font-size: 13px;
        }
        .footer-logo {
            font-size: 22px;
            font-weight: 700;
            color: #7c3aed;
            margin-bottom: 12px;
        }
        .divider {
            height: 1px;
            background-color: #334155;
            margin: 16px 0;
        }
        @media only screen and (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            .header {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="icon">✉️</div>
            <h1>Vérifiez votre email</h1>
            <p>Bienvenue sur Travana</p>
        </div>

        <!-- Content -->
        <div class="content">
            <p class="greeting">Bonjour,</p>
            
            <p class="message">
                Merci de vous être inscrit sur Travana. Pour finaliser votre inscription et accéder à tous nos services, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous.
            </p>

            <!-- Call to Action -->
</body>
</html>
