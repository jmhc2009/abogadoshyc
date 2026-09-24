import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    ArrowLeft,
    BriefcaseBusiness,
    FileDown,
    Loader2,
    Mail,
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
import type { Abogado } from '@/types/abogado';
import {
    index as abogadosRoute,
    pdf as abogadoPdfRoute,
} from '@/routes/abogados';

interface ShowProps {
    abogado: Abogado;
}

export default function Show({ abogado }: ShowProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGeneratePdf = async () => {
        if (isGenerating) return;
        setIsGenerating(true);
        const url = abogadoPdfRoute(abogado.id).url;

        try {
            const response = await fetch(url, {
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/pdf',
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status} al generar el PDF.`);
            }

            const contentType = response.headers.get('content-type') || '';
            if (!contentType.includes('application/pdf')) {
                throw new Error('La respuesta no es un PDF válido.');
            }

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const previewWindow = window.open(blobUrl, '_blank', 'noopener');

            if (!previewWindow) {
                throw new Error(
                    'No se pudo abrir la pestaña de previsualización.',
                );
            }

            toast.success(
                `Ficha de ${abogado.nombres} ${abogado.apellidos} generada correctamente.`,
            );
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            toast.error(
                'No se pudo generar o previsualizar el PDF. Intente nuevamente.',
            );
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            <Head title={`${abogado.nombres} ${abogado.apellidos}`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-500">
                            Detalle del abogado
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                            {abogado.nombres} {abogado.apellidos}
                        </h1>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-fit border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isGenerating}
                            onClick={handleGeneratePdf}
                        >
                            {isGenerating ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            ) : (
                                <FileDown className="mr-2 size-4" />
                            )}
                            {isGenerating ? 'Generando PDF...' : 'Ver PDF'}
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="w-fit border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                            <Link href={abogadosRoute().url}>
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
                                    Datos de identificación del abogado
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-6 pt-6 sm:grid-cols-3">
                        <div>
                            <p className="text-sm text-slate-500">Nombres</p>
                            <p className="mt-1 font-medium text-slate-900">
                                {abogado.nombres}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Apellidos</p>
                            <p className="mt-1 font-medium text-slate-900">
                                {abogado.apellidos}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">RUT</p>
                            <p className="mt-1 font-mono font-medium text-slate-900">
                                {abogado.rut_formatted}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
                    <CardHeader className="border-b border-slate-100">
                        <CardTitle className="text-lg text-slate-900">
                            Información profesional
                        </CardTitle>
                        <CardDescription className="mt-1 text-slate-500">
                            Datos de contacto y estado del abogado
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
                                    {abogado.email}
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
                                    {abogado.phone || 'Sin teléfono'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                                <BriefcaseBusiness className="size-4" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">
                                    Especialidad
                                </p>
                                <p className="mt-1 font-medium text-slate-900">
                                    {abogado.especialidad || 'Sin información'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
                    <CardHeader className="border-b border-slate-100">
                        <CardTitle className="text-lg text-slate-900">
                            Estado
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <p
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                abogado.is_active
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-slate-200 text-slate-600'
                            }`}
                        >
                            {abogado.is_active ? 'Activo' : 'Inactivo'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
