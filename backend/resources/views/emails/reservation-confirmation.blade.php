<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de réservation</title>
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
        .success-icon {
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
        .info-card {
            background-color: #fff7ed;
            border: 2px solid #fed7aa;
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 28px;
        }
        .ref-number {
            text-align: center;
            margin-bottom: 24px;
            padding-bottom: 24px;
            border-bottom: 2px solid #fed7aa;
        }
        .ref-label {
            font-size: 12px;
            text-transform: uppercase;
            color: #9a3412;
            letter-spacing: 1px;
            margin-bottom: 8px;
            font-weight: 700;
        }
        .ref-value {
            font-size: 24px;
            font-weight: 700;
            color: #f97316;
            font-family: 'Courier New', monospace;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
        }
        .details-table tr {
            border-bottom: 1px solid #fed7aa;
        }
        .details-table tr:last-child {
            border-bottom: none;
        }
        .details-table td {
            padding: 12px 0;
            font-size: 15px;
        }
        .detail-label {
            color: #525252;
            font-weight: 500;
        }
        .detail-value {
            font-weight: 600;
            color: #171717;
            text-align: right;
        }
        .total-row td {
            padding-top: 20px !important;
            border-top: 2px solid #fed7aa !important;
            font-size: 16px;
        }
        .total-row .detail-value {
            font-size: 24px;
            font-weight: 700;
            color: #f97316;
        }
        .listing-card {
            background-color: #fafafa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 28px;
            border: 1px solid #e5e5e5;
        }
        .listing-title {
            font-size: 17px;
            font-weight: 700;
            color: #171717;
            margin-bottom: 12px;
        }
        .listing-detail {
            font-size: 14px;
            color: #525252;
            margin-bottom: 6px;
            line-height: 1.6;
        }
        .info-box {
            background-color: #fef3c7;
            border-left: 4px solid #fbbf24;
            border-radius: 6px;
            padding: 16px 20px;
            margin-bottom: 28px;
        }
        .info-box-text {
            font-size: 13px;
            color: #78350f;
            line-height: 1.6;
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
            text-align: center;
        }
        .button-container {
            text-align: center;
            margin: 32px 0;
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
            <div class="success-icon">✓</div>
            <h1>Réservation confirmée !</h1>
            <p>Votre réservation a été enregistrée avec succès</p>
        </div>

        <!-- Content -->
        <div class="content">
            <p class="greeting">Bonjour {{ $reservation->name }},</p>
            
            <p class="message">
                Nous avons bien reçu votre réservation. Voici les détails de votre séjour :
            </p>

            <!-- Reference Number -->
            <div class="info-card">
                <div class="ref-number">
                    <div class="ref-label">Référence</div>
                    <div class="ref-value">{{ $reservation->ref }}</div>
                </div>

                <!-- Reservation Details -->
                <table class="details-table">
                    <tr>
                        <td class="detail-label">Arrivée</td>
                        <td class="detail-value">{{ \Carbon\Carbon::parse($reservation->start_date)->format('d/m/Y') }}</td>
                    </tr>
                    <tr>
                        <td class="detail-label">Départ</td>
                        <td class="detail-value">{{ \Carbon\Carbon::parse($reservation->end_date)->format('d/m/Y') }}</td>
                    </tr>
                    <tr>
                        <td class="detail-label">Nombre de nuits</td>
                        <td class="detail-value">{{ $reservation->nights }} nuit{{ $reservation->nights > 1 ? 's' : '' }}</td>
                    </tr>
                    @if($reservation->per_night)
                    <tr>
                        <td class="detail-label">Prix par nuit</td>
                        <td class="detail-value">{{ $reservation->currency->symbol ?? '$' }}{{ number_format($reservation->per_night, 2) }}</td>
                    </tr>
                    @endif
                    @if($reservation->subtotal)
                    <tr>
                        <td class="detail-label">Sous-total</td>
                        <td class="detail-value">{{ $reservation->currency->symbol ?? '$' }}{{ number_format($reservation->subtotal, 2) }}</td>
                    </tr>
                    @endif
                    @if($reservation->service_fee)
                    <tr>
                        <td class="detail-label">Frais de service</td>
                        <td class="detail-value">{{ $reservation->currency->symbol ?? '$' }}{{ number_format($reservation->service_fee, 2) }}</td>
                    </tr>
                    @endif
                    @if($reservation->total)
                    <tr class="total-row">
                        <td class="detail-label">Total</td>
                        <td class="detail-value">{{ $reservation->currency->symbol ?? '$' }}{{ number_format($reservation->total, 2) }}</td>
                    </tr>
                    @endif
                </table>
            </div>

            <!-- Listing Information -->
            @if($reservation->listing)
            <div class="listing-card">
                <div class="listing-title">📍 {{ $reservation->listing->name }}</div>
                @if($reservation->listing->address)
                <div class="listing-detail">{{ $reservation->listing->address }}</div>
                @endif
                @if($reservation->listing->city)
                <div class="listing-detail">{{ $reservation->listing->city->name }}</div>
                @endif
                @if($reservation->listing->phone)
                <div class="listing-detail">📞 {{ $reservation->listing->phone }}</div>
                @endif
            </div>
            @endif

            <!-- Important Information -->
            <div class="info-box">
                <div class="info-box-text">
                    <strong>À noter :</strong><br>
                    • Check-in à partir de 14h00<br>
                    • Check-out avant 11h00<br>
                    • Conservez ce numéro de référence
                </div>
            </div>

            <!-- Call to Action -->
            <div class="button-container">
                <a href="{{ config('app.frontend_url') }}/reservations/{{ $reservation->ref }}" class="button">
                    Voir ma réservation
                </a>
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
            line-height: 1.6;
        }
        .info-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 24px;
        }
        .ref-number {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e2e8f0;
        }
        .ref-label {
            font-size: 11px;
            text-transform: uppercase;
            color: #64748b;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
            font-weight: 600;
        }
        .ref-value {
            font-size: 20px;
            font-weight: 700;
            color: #7c3aed;
            font-family: 'Courier New', monospace;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
        }
        .details-table tr {
            border-bottom: 1px solid #e2e8f0;
        }
        .details-table tr:last-child {
            border-bottom: none;
        }
        .details-table td {
            padding: 10px 0;
            font-size: 14px;
        }
        .detail-label {
            color: #64748b;
            font-weight: 500;
        }
        .detail-value {
            font-weight: 600;
            color: #1e293b;
            text-align: right;
        }
        .total-row td {
            padding-top: 16px !important;
            border-top: 2px solid #e2e8f0 !important;
            font-size: 15px;
        }
        .total-row .detail-value {
            font-size: 22px;
            font-weight: 700;
            color: #7c3aed;
        }
        .listing-card {
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .listing-title {
            font-size: 16px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 12px;
        }
        .listing-detail {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 6px;
            line-height: 1.5;
        }
        .info-box {
            background-color: #fef3c7;
            border-left: 3px solid #f59e0b;
            border-radius: 6px;
            padding: 14px 16px;
            margin-bottom: 24px;
        }
        .info-box-text {
            font-size: 12px;
            color: #92400e;
            line-height: 1.5;
        }
        .button {
            display: inline-block;
            background-color: #7c3aed;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            text-align: center;
        }
        .button-container {
            text-align: center;
            margin: 28px 0;
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
            <div class="success-icon">✓</div>
            <h1>Réservation confirmée !</h1>
            <p>Votre réservation a été enregistrée avec succès</p>
        </div>

        <!-- Content -->
        <div class="content">
            <p class="greeting">Bonjour {{ $reservation->name }},</p>
            
            <p class="message">
                Nous avons bien reçu votre réservation. Voici les détails de votre séjour :
            </p>

            <!-- Reference Number -->
            <div class="info-card">
                <div class="ref-number">
                    <div class="ref-label">Référence</div>
                    <div class="ref-value">{{ $reservation->ref }}</div>
                </div>

                <!-- Reservation Details -->
                <table class="details-table">
                    <tr>
                        <td class="detail-label">Arrivée</td>
                        <td class="detail-value">{{ \Carbon\Carbon::parse($reservation->start_date)->format('d/m/Y') }}</td>
                    </tr>
                    <tr>
                        <td class="detail-label">Départ</td>
                        <td class="detail-value">{{ \Carbon\Carbon::parse($reservation->end_date)->format('d/m/Y') }}</td>
                    </tr>
                    <tr>
                        <td class="detail-label">Nombre de nuits</td>
                        <td class="detail-value">{{ $reservation->nights }} nuit{{ $reservation->nights > 1 ? 's' : '' }}</td>
                    </tr>
                    @if($reservation->per_night)
                    <tr>
                        <td class="detail-label">Prix par nuit</td>
                        <td class="detail-value">{{ $reservation->currency->symbol ?? '$' }}{{ number_format($reservation->per_night, 2) }}</td>
                    </tr>
                    @endif
                    @if($reservation->subtotal)
                    <tr>
                        <td class="detail-label">Sous-total</td>
                        <td class="detail-value">{{ $reservation->currency->symbol ?? '$' }}{{ number_format($reservation->subtotal, 2) }}</td>
                    </tr>
                    @endif
                    @if($reservation->service_fee)
                    <tr>
                        <td class="detail-label">Frais de service</td>
                        <td class="detail-value">{{ $reservation->currency->symbol ?? '$' }}{{ number_format($reservation->service_fee, 2) }}</td>
                    </tr>
                    @endif
                    @if($reservation->total)
                    <tr class="total-row">
                        <td class="detail-label">Total</td>
                        <td class="detail-value">{{ $reservation->currency->symbol ?? '$' }}{{ number_format($reservation->total, 2) }}</td>
                    </tr>
                    @endif
                </table>
            </div>

            <!-- Listing Information -->
            @if($reservation->listing)
            <div class="listing-card">
                <div class="listing-title">📍 {{ $reservation->listing->name }}</div>
                @if($reservation->listing->address)
                <div class="listing-detail">{{ $reservation->listing->address }}</div>
                @endif
                @if($reservation->listing->city)
                <div class="listing-detail">{{ $reservation->listing->city->name }}</div>
                @endif
                @if($reservation->listing->phone)
                <div class="listing-detail">📞 {{ $reservation->listing->phone }}</div>
                @endif
            </div>
            @endif

            <!-- Important Information -->
            <div class="info-box">
                <div class="info-box-text">
                    <strong>Informations importantes :</strong><br>
                    • Check-in à partir de 14h00<br>
                    • Check-out avant 11h00<br>
                    • Conservez ce numéro de référence
                </div>
            </div>

            <!-- Call to Action -->
            <div class="button-container">
                <a href="{{ config('app.frontend_url') }}/reservations/{{ $reservation->ref }}" class="button">
                    Voir ma réservation
                </a>
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
