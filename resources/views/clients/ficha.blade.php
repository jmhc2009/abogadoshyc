<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Ficha técnica - {{ $client->name }}</title>
    <style>
        @page {
            margin: 18mm 16mm;
        }

        body {
            color: #1e293b;
            font-family: "DejaVu Sans", Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.45;
        }

        .header {
            border-bottom: 2px solid #0f766e;
            padding-bottom: 14px;
            margin-bottom: 18px;
        }

        .brand {
            align-items: center;
            display: flex;
            gap: 12px;
        }

        .brand img {
            height: 46px;
            width: 46px;
        }

        .brand-name {
            color: #0f766e;
            font-size: 16pt;
            font-weight: 700;
            letter-spacing: 0.5px;
        }

        .document-title {
            color: #334155;
            font-size: 11pt;
            margin-top: 4px;
            text-transform: uppercase;
        }

        .reference {
            color: #64748b;
            font-size: 8.5pt;
            margin-top: 8px;
        }

        .section {
            margin-top: 15px;
        }

        .section-title {
            border-left: 4px solid #0f766e;
            color: #0f766e;
            font-size: 11pt;
            font-weight: 700;
            margin: 0 0 8px;
            padding-left: 8px;
            text-transform: uppercase;
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        th,
        td {
            border: 1px solid #cbd5e1;
            padding: 7px 9px;
            text-align: left;
            vertical-align: top;
        }

        th {
            background: #f1f5f9;
            color: #475569;
            font-size: 8.5pt;
            text-transform: uppercase;
            width: 31%;
        }

        td {
            color: #1e293b;
        }

        .muted {
            color: #64748b;
            font-style: italic;
        }

        .footer {
            border-top: 1px solid #cbd5e1;
            color: #64748b;
            font-size: 8pt;
            margin-top: 22px;
            padding-top: 9px;
            text-align: center;
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="brand">
            <img src="{{ public_path('favicon.svg') }}" alt="AbogadosHYC">
            <div>
                <div class="brand-name">ABOGADOSHYC</div>
                <div class="document-title">Ficha técnica del cliente</div>
            </div>
        </div>
        <div class="reference">
            Documento generado el {{ now()->format('d/m/Y H:i') }} · Cliente N.º {{ $client->id }}
        </div>
    </header>

    <section class="section">
        <h2 class="section-title">Datos personales</h2>
        <table>
            <tr>
                <th>Nombre completo</th>
                <td>{{ $client->name }}</td>
            </tr>
            <tr>
                <th>RUT</th>
                <td>{{ $client->rut }}</td>
            </tr>
            <tr>
                <th>Nacionalidad</th>
                <td>{{ $client->nationality ?: 'Sin información' }}</td>
            </tr>
            <tr>
                <th>Estado civil</th>
                <td>{{ $client->marital_status ?: 'Sin información' }}</td>
            </tr>
            <tr>
                <th>Ocupación</th>
                <td>{{ $client->occupation ?: 'Sin información' }}</td>
            </tr>
        </table>
    </section>

    <section class="section">
        <h2 class="section-title">Contacto</h2>
        <table>
            <tr>
                <th>Correo electrónico</th>
                <td>{{ $client->email ?: 'Sin correo registrado' }}</td>
            </tr>
            <tr>
                <th>Teléfono</th>
                <td>{{ $client->phone ?: 'Sin teléfono registrado' }}</td>
            </tr>
        </table>
    </section>

    <section class="section">
        <h2 class="section-title">Dirección</h2>
        <table>
            <tr>
                <th>Dirección</th>
                <td>
                    @php
                        $address = collect([$client->street, $client->number])->filter()->implode(' ');
                        $location = collect([$client->commune, $client->region])->filter()->implode(', ');
                    @endphp
                    {{ $address ?: 'Sin dirección registrada' }}
                    @if ($location)
                        <br>{{ $location }}
                    @endif
                </td>
            </tr>
        </table>
    </section>

    <section class="section">
        <h2 class="section-title">Casos vinculados</h2>
        <table>
            <tr>
                <td class="muted">No hay casos registrados para este cliente.</td>
            </tr>
        </table>
    </section>

    <footer class="footer">
        AbogadosHYC · Ficha técnica de cliente · Información de uso interno
    </footer>
</body>
</html>
