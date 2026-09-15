import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BriefcaseBusiness,
    FileDown,
    Mail,
    MapPin,
    Phone,
    UserRound,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { Client } from '@/types/client';
import { index as clientsRoute, pdf as clientPdfRoute } from '@/routes/clients';

interface ShowProps {
    client: Client;
}

const formatRut = (rut: string) => {
    const normalized = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    const verifier = normalized.slice(-1);
    const number = normalized.slice(0, -1);

    return number
        ? `${number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${verifier}`
        : rut;
};

const formatPhone = (phone?: string | null) => {
    if (!phone) return 'Sin teléfono';
    return phone.startsWith('+') ? phone : `+56 ${phone}`;
};

const formatMaritalStatus = (status?: string | null) => {
    if (!status) return 'Sin información';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

export default function Show({ client }: ShowProps) {
    const address = [client.street, client.number].filter(Boolean).join(' ');
    const location = [client.commune, client.region].filter(Boolean).join(', ');

    return (
        <>
            <Head title={client.name} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-500">
                            Detalle del cliente
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                            {client.name}
                        </h1>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            asChild
                            variant="outline"
                            className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                            <a
                                href={clientPdfRoute(client.id).url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FileDown className="mr-2 size-4" />
                                Descargar PDF
                            </a>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                            <Link href={clientsRoute().url}>
                                <ArrowLeft className="mr-2 size-4" />
                                Volver
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
                    <CardHeader className="border-b border-slate-100">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                <UserRound className="size-6" />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-slate-900">
                                    Información personal
                                </CardTitle>
                                <CardDescription className="mt-1 text-slate-500">
                                    Datos de identificación registrados
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-6 pt-6 sm:grid-cols-3">
                        <div>
                            <p className="text-sm text-slate-500">
                                Nombre completo
                            </p>
                            <p className="mt-1 font-medium text-slate-900">
                                {client.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">RUT</p>
                            <p className="mt-1 font-mono font-medium text-slate-900">
                                {formatRut(client.rut)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">
                                Nacionalidad
                            </p>
                            <p className="mt-1 font-medium text-slate-900">
                                {client.nationality || 'Sin información'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">
                                Estado civil
                            </p>
                            <p className="mt-1 flex items-center gap-2 font-medium text-slate-900">
                                <UserRound className="size-4 text-slate-400" />
                                {formatMaritalStatus(client.marital_status)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Ocupación</p>
                            <p className="mt-1 flex items-center gap-2 font-medium text-slate-900">
                                <BriefcaseBusiness className="size-4 text-slate-400" />
                                {client.occupation || 'Sin información'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
                    <CardHeader className="border-b border-slate-100">
                        <CardTitle className="text-lg text-slate-900">
                            Contacto y ubicación
                        </CardTitle>
                        <CardDescription className="mt-1 text-slate-500">
                            Medios de contacto y dirección registrada del
                            cliente
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 pt-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                                <Mail className="size-4" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">
                                    Correo electrónico
                                </p>
                                <p className="mt-1 font-medium text-slate-900">
                                    {client.email || 'Sin correo'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                                <Phone className="size-4" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">
                                    Teléfono
                                </p>
                                <p className="mt-1 font-medium text-slate-900">
                                    {formatPhone(client.phone)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                                <MapPin className="size-4" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">
                                    Dirección
                                </p>
                                <p className="mt-1 font-medium text-slate-900">
                                    {address || 'Sin dirección'}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    {location || 'Sin comuna ni región'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
