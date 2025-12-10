<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification de votre email</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background-color: #fafafa;
            padding: 20px;
            line-height: 1.6;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #f97316;
            padding: 48px 32px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        .header p {
            font-size: 15px;
            opacity: 0.95;
        }
        .icon {
            width: 64px;
            height: 64px;
            background-color: rgba(255, 255, 255, 0.25);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            font-size: 36px;
        }
        .content {
            padding: 40px 32px;
        }
        .greeting {
            font-size: 18px;
            color: #171717;
            margin-bottom: 12px;
            font-weight: 600;
        }
        .message {
            color: #525252;
            margin-bottom: 28px;
            font-size: 15px;
            line-height: 1.6;
        }
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        .button {
            display: inline-block;
            background-color: #f97316;
            color: #ffffff;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
        }
        .info-box {
            background-color: #fef3c7;
            border-left: 4px solid #fbbf24;
            border-radius: 6px;
            padding: 16px 20px;
            margin: 28px 0;
        }
        .info-box-text {
            font-size: 13px;
            color: #78350f;
            line-height: 1.6;
        }
        .alternative-link {
            margin-top: 28px;
            padding: 20px;
            background-color: #fafafa;
            border-radius: 6px;
            font-size: 13px;
            color: #525252;
            border: 1px solid #e5e5e5;
        }
        .alternative-link-label {
            font-weight: 600;
            color: #171717;
            margin-bottom: 12px;
        }
        .link-text {
            word-break: break-all;
            color: #f97316;
            background-color: #fff;
            padding: 12px;
            border-radius: 4px;
            border: 1px solid #fed7aa;
            font-family: 'Courier New', monospace;
            font-size: 12px;
        }
        .footer {
            background-color: #fafafa;
            padding: 32px;
            text-align: center;
            color: #737373;
            font-size: 13px;
        }
        .footer-logo {
            font-size: 24px;
            font-weight: 700;
            color: #f97316;
            margin-bottom: 12px;
        }
        .divider {
            height: 1px;
            background-color: #e5e5e5;
            margin: 20px 0;
        }
        @media only screen and (max-width: 600px) {
            .content {
                padding: 32px 24px;
            }
            .header {
                padding: 40px 24px;
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
                Merci de vous être inscrit sur Travana. Pour finaliser votre inscription, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous.
            </p>

            <!-- Call to Action -->
            <div class="button-container">
                <a href="{{ $verificationUrl }}" class="button">
                    Vérifier mon email
                </a>
            </div>

            <!-- Info Box -->
            <div class="info-box">
                <div class="info-box-text">
                    ⏱️ Ce lien expirera dans <strong>60 minutes</strong>. Si vous n'avez pas créé de compte, ignorez cet email.
                </div>
            </div>

            <!-- Alternative Link -->
            <div class="alternative-link">
                <div class="alternative-link-label">
                    Si le bouton ne fonctionne pas, copiez ce lien :
                </div>
                <div class="link-text">{{ $verificationUrl }}</div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-logo">Travana</div>
            <p style="margin-bottom: 8px;">Votre plateforme de réservation</p>
            <div class="divider"></div>
            <p style="margin-top: 16px;">
                © {{ date('Y') }} Travana. Tous droits réservés.
            </p>
        </div>
    </div>
</body>
</html>
        .content {
            padding: 40px 30px;
        }
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
            <div class="button-container">
                <a href="{{ $verificationUrl }}" class="button">
                    Vérifier mon email
                </a>
            </div>

            <!-- Info Box -->
            <div class="info-box">
                <div class="info-box-text">
                    ⏱️ Ce lien expirera dans <strong>60 minutes</strong>. Si vous n'avez pas créé de compte, ignorez cet email.
                </div>
            </div>

            <!-- Alternative Link -->
            <div class="alternative-link">
                <div class="alternative-link-label">
                    Si le bouton ne fonctionne pas, copiez ce lien :
                </div>
                <div class="link-text">{{ $verificationUrl }}</div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-logo">Travana</div>
            <p style="margin-bottom: 12px;">Votre plateforme de réservation</p>
            <div class="divider"></div>
            <p style="margin-top: 16px;">
                © {{ date('Y') }} Travana. Tous droits réservés.
            </p>
        </div>
    </div>
</body>
</html>
