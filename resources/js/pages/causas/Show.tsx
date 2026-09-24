import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Gavel, Pencil } from 'lucide-react';
import CausaModal from '@/components/causas/CausaModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Causa } from '@/types/causa';
import { index as causasRoute } from '@/routes/causas';

interface ClienteOption { id: number; name: string }
const formatDate = (value: string | null) => value ? new Intl.DateTimeFormat('es-CL').format(new Date(`${value}T00:00:00`)) : 'Sin fecha';

export default function Show({ causa, editing: editingFromRoute = false, estados = [], clientes = [] }: { causa: Causa; editing?: boolean; estados?: string[]; clientes?: ClienteOption[] }) {
    const [editing, setEditing] = useState(editingFromRoute);
    return <>
        <Head title={`Causa: ${causa.identificador}`} />
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm text-slate-500">Detalle de la causa</p><h1 className="text-2xl font-semibold tracking-tight text-slate-950">{causa.identificador}</h1></div><div className="flex gap-2"><Button variant="outline" onClick={() => setEditing(true)}><Pencil className="mr-2 size-4" />Editar</Button><Button asChild variant="outline"><Link href={causasRoute().url}><ArrowLeft className="mr-2 size-4" />Volver</Link></Button></div></div>
            <Card className="rounded-xl border-slate-200 bg-white shadow-sm"><CardHeader className="border-b border-slate-100"><div className="flex items-start gap-4"><div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><Gavel className="size-6" /></div><div><CardTitle>{causa.caratula}</CardTitle><CardDescription className="mt-1">Información judicial y procesal</CardDescription></div></div></CardHeader><CardContent className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3"><div><p className="text-sm text-slate-500">Tribunal</p><p className="mt-1 font-medium text-slate-900">{causa.tribunal}</p></div><div><p className="text-sm text-slate-500">Fecha de ingreso</p><p className="mt-1 font-medium text-slate-900">{formatDate(causa.fecha_ingreso)}</p></div><div><p className="text-sm text-slate-500">Estado</p><p className="mt-1 font-medium text-slate-900">{causa.estado}</p></div><div><p className="text-sm text-slate-500">Representados</p><p className="mt-1 font-medium text-slate-900">{causa.intervinientes_representado || 'Sin información'}</p></div><div><p className="text-sm text-slate-500">Contraparte</p><p className="mt-1 font-medium text-slate-900">{causa.intervinientes_contraparte || 'Sin información'}</p></div><div><p className="text-sm text-slate-500">Fecha de término</p><p className="mt-1 font-medium text-slate-900">{formatDate(causa.fecha_termino)}</p></div><div className="sm:col-span-2 lg:col-span-3"><p className="text-sm text-slate-500">Asunto</p><p className="mt-1 whitespace-pre-wrap font-medium text-slate-900">{causa.asunto || 'Sin información'}</p></div><div className="sm:col-span-2 lg:col-span-3"><p className="text-sm text-slate-500">Observaciones</p><p className="mt-1 whitespace-pre-wrap font-medium text-slate-900">{causa.observaciones || 'Sin observaciones'}</p></div></CardContent></Card>
        </div>
        <CausaModal isOpen={editing} causa={causa} estados={estados} clientes={clientes} onClose={() => setEditing(false)} />
    </>;
}
