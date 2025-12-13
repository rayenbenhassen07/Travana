<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Confirmation de réservation</title>
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
        .reservation-box {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
        }
        .footer {
            margin-top: 20px;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        table td {
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
        }
        table td:last-child {
            text-align: right;
        }
        .total {
            font-weight: bold;
            font-size: 18px;
            color: #FFA500;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>✓ Réservation confirmée - {{ config('app.name') }}</h1>
    </div>

    <div class="content">
        <h2>Bonjour {{ $reservation->name }},</h2>
        
        <p>Nous avons bien reçu votre réservation. Voici les détails de votre séjour :</p>

        <div class="reservation-box">
            <p style="text-align: center; margin: 0;"><strong>Référence de réservation</strong></p>
            <p style="text-align: center; font-size: 24px; font-weight: bold; color: #FFA500; margin: 5px 0;">{{ $reservation->ref }}</p>
        </div>

        <table>
            <tr>
                <td><strong>Arrivée</strong></td>
                <td>{{ \Carbon\Carbon::parse($reservation->start_date)->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td><strong>Départ</strong></td>
                <td>{{ \Carbon\Carbon::parse($reservation->end_date)->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td><strong>Nombre de nuits</strong></td>
                <td>{{ $reservation->nights }} nuit{{ $reservation->nights > 1 ? 's' : '' }}</td>
            </tr>
            @if($reservation->per_night)
            <tr>
                <td><strong>Prix par nuit</strong></td>
                <td>{{ $reservation->currency->symbol ?? '$' }}{{ number_format($reservation->per_night, 2) }}</td>
            </tr>
            @endif
            @if($reservation->subtotal)
            <tr>
                <td><strong>Sous-total</strong></td>
                <td>{{ $reservation->currency->symbol ?? '$' }}{{ number_format($reservation->subtotal, 2) }}</td>
            </tr>
            @endif
            @if($reservation->service_fee)
            <tr>
                <td><strong>Frais de service</strong></td>
                <td>{{ $reservation->currency->symbol ?? '$' }}{{ number_format($reservation->service_fee, 2) }}</td>
            </tr>
            @endif
            @if($reservation->total)
            <tr>
                <td class="total"><strong>Total</strong></td>
                <td class="total">{{ $reservation->currency->symbol ?? '$' }}{{ number_format($reservation->total, 2) }}</td>
            </tr>
            @endif
        </table>

        @if($reservation->listing)
        <h3>📍 Informations sur l'hébergement</h3>
        <div class="reservation-box">
            <p><strong>{{ $reservation->listing->name }}</strong></p>
            @if($reservation->listing->address)
            <p>{{ $reservation->listing->address }}</p>
            @endif
            @if($reservation->listing->city)
            <p>{{ $reservation->listing->city->name }}</p>
            @endif
            @if($reservation->listing->phone)
            <p>📞 {{ $reservation->listing->phone }}</p>
            @endif
        </div>
        @endif

        <p><strong>Informations importantes :</strong></p>
        <ul>
            <li>Check-in à partir de 14h00</li>
            <li>Check-out avant 11h00</li>
            <li>Conservez ce numéro de référence pour toute correspondance</li>
        </ul>
        
        <p>Si vous avez des questions concernant votre réservation, n'hésitez pas à nous contacter.</p>
        
        <p>Nous vous souhaitons un excellent séjour !</p>
        
        <p>Cordialement,<br>L'équipe {{ config('app.name') }}</p>
    </div>

    <div class="footer">
        <p>Ce courriel a été envoyé à {{ $reservation->email ?? $reservation->name }}.</p>
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. Tous droits réservés.</p>
    </div>
</body>
</html>
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
