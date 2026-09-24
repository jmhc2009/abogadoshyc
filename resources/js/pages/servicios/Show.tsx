import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ClipboardList, Pencil } from 'lucide-react';
import ServicioModal from '@/components/servicios/ServicioModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Servicio } from '@/types/servicio';
import { index as serviciosRoute } from '@/routes/servicios';

export default function Show({ servicio, editing: editingFromRoute = false }: { servicio: Servicio; editing?: boolean }) {
    const [editing, setEditing] = useState(editingFromRoute);
    const money = (value: number | null) => value === null ? 'Sin información' : new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);

    return <>
        <Head title={`Servicio: ${servicio.nombre}`} />
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="text-sm text-slate-500">Detalle del servicio</p><h1 className="text-2xl font-semibold tracking-tight text-slate-950">{servicio.nombre}</h1></div>
                <div className="flex gap-2"><Button variant="outline" onClick={() => setEditing(true)}><Pencil className="mr-2 size-4" />Editar</Button><Button asChild variant="outline"><Link href={serviciosRoute().url}><ArrowLeft className="mr-2 size-4" />Volver</Link></Button></div>
            </div>
            <Card className="rounded-xl border-slate-200 bg-white shadow-sm"><CardHeader className="border-b border-slate-100"><div className="flex items-start gap-4"><div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><ClipboardList className="size-6" /></div><div><CardTitle className="text-lg">Información del servicio</CardTitle><CardDescription className="mt-1">Condiciones comerciales y observaciones</CardDescription></div></div></CardHeader>
                <CardContent className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div><p className="text-sm text-slate-500">Valor</p><p className="mt-1 font-medium text-slate-900">{money(servicio.valor)}</p></div>
                    <div><p className="text-sm text-slate-500">Medio de pago</p><p className="mt-1 font-medium text-slate-900">{servicio.medio_pago}</p></div>
                    <div><p className="text-sm text-slate-500">Cantidad de cuotas</p><p className="mt-1 font-medium text-slate-900">{servicio.cantidad_cuotas}</p></div>
                    <div><p className="text-sm text-slate-500">Cuota inicial</p><p className="mt-1 font-medium text-slate-900">{money(servicio.cuota_inicial)}</p></div>
                    <div className="sm:col-span-2"><p className="text-sm text-slate-500">Observaciones</p><p className="mt-1 whitespace-pre-wrap font-medium text-slate-900">{servicio.observaciones || 'Sin observaciones'}</p></div>
                </CardContent>
            </Card>
        </div>
        <ServicioModal isOpen={editing} servicio={servicio} onClose={() => setEditing(false)} />
    </>;
}