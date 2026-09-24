import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Eye, Gavel, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import CausaModal from '@/components/causas/CausaModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Causa } from '@/types/causa';
import { index as causasRoute, show as causaShowRoute } from '@/routes/causas';

interface ClienteOption { id: number; name: string }
interface IndexProps {
    causas: { data: Causa[]; last_page: number; total: number; links: Array<{ url: string | null; label: string; active: boolean }> };
    filters: { search: string };
    estados: string[];
    clientes: ClienteOption[];
}

const badgeClass = (estado: string) => estado === 'Concluida' || estado === 'Con sentencia' ? 'bg-emerald-100 text-emerald-700' : estado === 'Suspendida' || estado === 'Abandono del procedimiento' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700';
const formatDate = (value: string | null) => value ? new Intl.DateTimeFormat('es-CL').format(new Date(`${value}T00:00:00`)) : 'Sin fecha';

export default function Index({ causas, filters, estados, clientes }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Causa | null>(null);
    const [toDelete, setToDelete] = useState<Causa | null>(null);
    const searchSubmit = (event: React.FormEvent) => { event.preventDefault(); router.get(causasRoute().url, { search }, { preserveState: true, replace: true }); };
    const remove = () => { if (!toDelete) return; router.delete(`/causas/${toDelete.id}`, { preserveScroll: true, onSuccess: () => { toast.success('Causa eliminada correctamente.'); setToDelete(null); }, onError: () => toast.error('No se pudo eliminar la causa.') }); };
    return <>
        <Head title="Causas" />
        <div className="space-y-6 p-4 md:p-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="space-y-1"><h1 className="text-2xl font-semibold tracking-tight text-slate-950">Causas</h1><p className="text-sm text-slate-500">Gestiona las causas judiciales y su estado de tramitación.</p></div><Button onClick={() => { setEditing(null); setModalOpen(true); }} className="h-10 rounded-lg bg-slate-950 px-4 text-white hover:bg-slate-800"><Plus className="size-4" /> Nueva causa</Button></header>
            <Card className="rounded-xl border-slate-200 bg-white shadow-sm"><CardHeader className="gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><Gavel className="size-5 text-slate-500" /><div><CardTitle className="text-lg">Lista de causas</CardTitle><CardDescription className="mt-1">{causas.total} registros disponibles</CardDescription></div></div><form onSubmit={searchSubmit} className="relative w-full sm:max-w-sm"><Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por ROL, carátula o tribunal..." aria-label="Buscar causas" className="h-10 rounded-lg pl-9" /></form></CardHeader><CardContent className="p-0"><div className="w-full overflow-x-auto"><Table className="min-w-[950px]"><TableHeader className="bg-slate-50/80"><TableRow><TableHead>Identificador</TableHead><TableHead>Carátula</TableHead><TableHead>Tribunal</TableHead><TableHead>Fecha Ingreso</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{causas.data.map((causa) => <TableRow key={causa.id}><TableCell className="font-mono font-medium">{causa.identificador}</TableCell><TableCell className="font-medium">{causa.caratula}</TableCell><TableCell>{causa.tribunal}</TableCell><TableCell>{formatDate(causa.fecha_ingreso)}</TableCell><TableCell><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(causa.estado)}`}>{causa.estado}</span></TableCell><TableCell><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" title="Ver detalle" aria-label="Ver detalle" onClick={() => router.visit(causaShowRoute(causa.id).url)}><Eye className="size-4" /></Button><Button variant="ghost" size="icon" title="Editar" aria-label="Editar" onClick={() => { setEditing(causa); setModalOpen(true); }}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" title="Eliminar" aria-label="Eliminar" onClick={() => setToDelete(causa)}><Trash2 className="size-4 text-red-600" /></Button></div></TableCell></TableRow>)}</TableBody></Table></div>{causas.data.length === 0 && <div className="p-10 text-center text-sm text-slate-500">No encontramos causas con esos criterios.</div>}{causas.last_page > 1 && <div className="flex justify-center gap-1 border-t border-slate-100 p-4">{causas.links.map((link, index) => link.url && <Button key={index} size="sm" variant={link.active ? 'default' : 'outline'} onClick={() => router.visit(link.url!)} dangerouslySetInnerHTML={{ __html: link.label }} />)}</div>}</CardContent></Card>
        </div>
        <CausaModal isOpen={modalOpen} causa={editing} estados={estados} clientes={clientes} onClose={() => { setModalOpen(false); setEditing(null); }} />
        <Dialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}><DialogContent><DialogHeader><DialogTitle>Eliminar causa</DialogTitle><DialogDescription>¿Deseas eliminar “{toDelete?.identificador} - {toDelete?.caratula}”? Esta acción no se puede deshacer.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setToDelete(null)}>Cancelar</Button><Button variant="destructive" onClick={remove}>Eliminar</Button></DialogFooter></DialogContent></Dialog>
    </>;
}
