import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CalendarClock, Pencil } from 'lucide-react';
import AudienciaModal from '@/components/audiencias/AudienciaModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Audiencia } from '@/types/audiencia';
import { index as audienciasRoute } from '@/routes/audiencias';

export default function Show({ audiencia, editing: editingFromRoute = false, tipos = [], comparecencias = [] }: { audiencia: Audiencia; editing?: boolean; tipos?: string[]; comparecencias?: string[] }) {
    const [editing, setEditing] = useState(editingFromRoute);
    const formatDate = (value: string) => new Intl.DateTimeFormat('es-CL').format(new Date(`${value}T00:00:00`));
    return <>
        <Head title={`Audiencia: ${audiencia.tribunal}`} />
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm text-slate-500">Detalle de la audiencia</p><h1 className="text-2xl font-semibold tracking-tight text-slate-950">{audiencia.tipo}</h1></div><div className="flex gap-2"><Button variant="outline" onClick={() => setEditing(true)}><Pencil className="mr-2 size-4" />Editar</Button><Button asChild variant="outline"><Link href={audienciasRoute().url}><ArrowLeft className="mr-2 size-4" />Volver</Link></Button></div></div>
            <Card className="rounded-xl border-slate-200 bg-white shadow-sm"><CardHeader className="border-b border-slate-100"><div className="flex items-start gap-4"><div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><CalendarClock className="size-6" /></div><div><CardTitle>{audiencia.tribunal}</CardTitle><CardDescription className="mt-1">Información de la audiencia judicial</CardDescription></div></div></CardHeader><CardContent className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3"><div><p className="text-sm text-slate-500">Tipo</p><p className="mt-1 font-medium text-slate-900">{audiencia.tipo}</p></div><div><p className="text-sm text-slate-500">Fecha</p><p className="mt-1 font-medium text-slate-900">{formatDate(audiencia.fecha)}</p></div><div><p className="text-sm text-slate-500">Hora</p><p className="mt-1 font-medium text-slate-900">{audiencia.hora}</p></div><div><p className="text-sm text-slate-500">Tribunal</p><p className="mt-1 font-medium text-slate-900">{audiencia.tribunal}</p></div><div><p className="text-sm text-slate-500">Comparecencia</p><p className="mt-1 font-medium text-slate-900">{audiencia.comparecencia}</p></div><div className="sm:col-span-2 lg:col-span-3"><p className="text-sm text-slate-500">Observaciones</p><p className="mt-1 whitespace-pre-wrap font-medium text-slate-900">{audiencia.observaciones || 'Sin observaciones'}</p></div></CardContent></Card>
        </div>
        <AudienciaModal isOpen={editing} audiencia={audiencia} tipos={tipos} comparecencias={comparecencias} onClose={() => setEditing(false)} />
    </>;
}
