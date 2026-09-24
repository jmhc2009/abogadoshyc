import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { CalendarClock, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import AudienciaModal from '@/components/audiencias/AudienciaModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Audiencia } from '@/types/audiencia';
import { index as audienciasRoute, show as audienciaShowRoute } from '@/routes/audiencias';

interface IndexProps {
    audiencias: { data: Audiencia[]; last_page: number; total: number; links: Array<{ url: string | null; label: string; active: boolean }> };
    filters: { search: string };
    tipos: string[];
    comparecencias: string[];
}

const formatDate = (value: string) => new Intl.DateTimeFormat('es-CL').format(new Date(`${value}T00:00:00`));
const badgeClass = (value: string) => value === 'Zoom' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700';

export default function Index({ audiencias, filters, tipos, comparecencias }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Audiencia | null>(null);
    const [toDelete, setToDelete] = useState<Audiencia | null>(null);
    const searchSubmit = (event: React.FormEvent) => { event.preventDefault(); router.get(audienciasRoute().url, { search }, { preserveState: true, replace: true }); };
    const remove = () => { if (!toDelete) return; router.delete(`/audiencias/${toDelete.id}`, { preserveScroll: true, onSuccess: () => { toast.success('Audiencia eliminada correctamente.'); setToDelete(null); }, onError: () => toast.error('No se pudo eliminar la audiencia.') }); };
    return <>
        <Head title="Audiencias" />
        <div className="space-y-6 p-4 md:p-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="space-y-1"><h1 className="text-2xl font-semibold tracking-tight text-slate-950">Audiencias</h1><p className="text-sm text-slate-500">Agenda y gestiona las audiencias judiciales.</p></div><Button onClick={() => { setEditing(null); setModalOpen(true); }} className="h-10 rounded-lg bg-slate-950 px-4 text-white hover:bg-slate-800"><Plus className="size-4" /> Nueva audiencia</Button></header>
            <Card className="rounded-xl border-slate-200 bg-white shadow-sm"><CardHeader className="gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><CalendarClock className="size-5 text-slate-500" /><div><CardTitle className="text-lg">Lista de audiencias</CardTitle><CardDescription className="mt-1">{audiencias.total} registros disponibles</CardDescription></div></div><form onSubmit={searchSubmit} className="relative w-full sm:max-w-sm"><Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por tribunal, tipo o fecha..." aria-label="Buscar audiencias" className="h-10 rounded-lg pl-9" /></form></CardHeader><CardContent className="p-0"><div className="w-full overflow-x-auto"><Table className="min-w-[850px]"><TableHeader className="bg-slate-50/80"><TableRow><TableHead>Tipo</TableHead><TableHead>Fecha y Hora</TableHead><TableHead>Tribunal</TableHead><TableHead>Comparecencia</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{audiencias.data.map((audiencia) => <TableRow key={audiencia.id}><TableCell className="font-medium">{audiencia.tipo}</TableCell><TableCell>{formatDate(audiencia.fecha)} <span className="text-slate-500">{audiencia.hora}</span></TableCell><TableCell>{audiencia.tribunal}</TableCell><TableCell><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(audiencia.comparecencia)}`}>{audiencia.comparecencia}</span></TableCell><TableCell><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" title="Ver detalle" aria-label="Ver detalle" onClick={() => router.visit(audienciaShowRoute(audiencia.id).url)}><Eye className="size-4" /></Button><Button variant="ghost" size="icon" title="Editar" aria-label="Editar" onClick={() => { setEditing(audiencia); setModalOpen(true); }}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" title="Eliminar" aria-label="Eliminar" onClick={() => setToDelete(audiencia)}><Trash2 className="size-4 text-red-600" /></Button></div></TableCell></TableRow>)}</TableBody></Table></div>{audiencias.data.length === 0 && <div className="p-10 text-center text-sm text-slate-500">No encontramos audiencias con esos criterios.</div>}{audiencias.last_page > 1 && <div className="flex justify-center gap-1 border-t border-slate-100 p-4">{audiencias.links.map((link, index) => link.url && <Button key={index} size="sm" variant={link.active ? 'default' : 'outline'} onClick={() => router.visit(link.url!)} dangerouslySetInnerHTML={{ __html: link.label }} />)}</div>}</CardContent></Card>
        </div>
        <AudienciaModal isOpen={modalOpen} audiencia={editing} tipos={tipos} comparecencias={comparecencias} onClose={() => { setModalOpen(false); setEditing(null); }} />
        <Dialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}><DialogContent><DialogHeader><DialogTitle>Eliminar audiencia</DialogTitle><DialogDescription>¿Deseas eliminar la audiencia de “{toDelete?.tribunal}”? Esta acción no se puede deshacer.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setToDelete(null)}>Cancelar</Button><Button variant="destructive" onClick={remove}>Eliminar</Button></DialogFooter></DialogContent></Dialog>
    </>;
}
