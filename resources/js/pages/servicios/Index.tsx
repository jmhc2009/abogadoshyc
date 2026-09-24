import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';

import ServicioModal from '@/components/servicios/ServicioModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Servicio } from '@/types/servicio';
import { index as serviciosRoute, show as servicioShowRoute } from '@/routes/servicios';

interface IndexProps {
    servicios: {
        data: Servicio[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: { search: string };
}

const currency = (value: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);

export default function Index({ servicios, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Servicio | null>(null);
    const [toDelete, setToDelete] = useState<Servicio | null>(null);

    const submitSearch = (event: React.FormEvent) => {
        event.preventDefault();
        router.get(serviciosRoute().url, { search }, { preserveState: true, replace: true });
    };

    const openCreate = () => { setEditing(null); setModalOpen(true); };
    const openEdit = (servicio: Servicio) => { setEditing(servicio); setModalOpen(true); };

    const remove = () => {
        if (!toDelete) return;
        router.delete(`/servicios/${toDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => { toast.success('Servicio eliminado correctamente.'); setToDelete(null); },
            onError: () => toast.error('No se pudo eliminar el servicio.'),
        });
    };

    return (
        <>
            <Head title="Servicios" />
            <div className="space-y-6 p-4 md:p-6">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Servicios</h1>
                        <p className="text-sm text-slate-500">Administra los servicios, valores y condiciones de pago.</p>
                    </div>
                    <Button onClick={openCreate} className="h-10 rounded-lg bg-slate-950 px-4 text-white hover:bg-slate-800">
                        <Plus className="size-4" /> Nuevo servicio
                    </Button>
                </header>

                <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
                    <CardHeader className="gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-lg text-slate-900">Lista de servicios</CardTitle>
                            <CardDescription className="mt-1 text-slate-500">{servicios.total} registros disponibles</CardDescription>
                        </div>
                        <form onSubmit={submitSearch} className="relative w-full sm:max-w-sm">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre u observaciones..." aria-label="Buscar servicios" className="h-10 rounded-lg pl-9" />
                        </form>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="w-full overflow-x-auto">
                            <Table className="min-w-[850px]">
                                <TableHeader className="bg-slate-50/80"><TableRow>
                                    <TableHead>Nombre</TableHead><TableHead>Valor</TableHead><TableHead>Medio de Pago</TableHead><TableHead>Cuotas</TableHead><TableHead>Cuota Inicial</TableHead><TableHead className="text-right">Acciones</TableHead>
                                </TableRow></TableHeader>
                                <TableBody>
                                    {servicios.data.map((servicio) => (
                                        <TableRow key={servicio.id}>
                                            <TableCell className="font-medium">{servicio.nombre}</TableCell>
                                            <TableCell>{currency(servicio.valor)}</TableCell>
                                            <TableCell>{servicio.medio_pago}</TableCell>
                                            <TableCell>{servicio.cantidad_cuotas}</TableCell>
                                            <TableCell>{servicio.cuota_inicial ? currency(servicio.cuota_inicial) : 'Sin cuota inicial'}</TableCell>
                                            <TableCell><div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" title="Ver detalle" aria-label="Ver detalle" onClick={() => router.visit(servicioShowRoute(servicio.id).url)}><Eye className="size-4" /></Button>
                                                <Button variant="ghost" size="icon" title="Editar" aria-label="Editar" onClick={() => openEdit(servicio)}><Pencil className="size-4" /></Button>
                                                <Button variant="ghost" size="icon" title="Eliminar" aria-label="Eliminar" onClick={() => setToDelete(servicio)}><Trash2 className="size-4 text-red-600" /></Button>
                                            </div></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {servicios.data.length === 0 && <div className="p-10 text-center text-sm text-slate-500">No encontramos servicios con esos criterios.</div>}
                        {servicios.last_page > 1 && <div className="flex justify-center gap-1 border-t border-slate-100 p-4">
                            {servicios.links.map((link, index) => link.url && <Button key={index} variant={link.active ? 'default' : 'outline'} size="sm" onClick={() => router.visit(link.url!)} dangerouslySetInnerHTML={{ __html: link.label }} />)}
                        </div>}
                    </CardContent>
                </Card>
            </div>
            <ServicioModal isOpen={modalOpen} servicio={editing} onClose={() => { setModalOpen(false); setEditing(null); }} />
            <Dialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
                <DialogContent><DialogHeader><DialogTitle>Eliminar servicio</DialogTitle><DialogDescription>¿Deseas eliminar “{toDelete?.nombre}”? Esta acción no se puede deshacer.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setToDelete(null)}>Cancelar</Button><Button variant="destructive" onClick={remove}>Eliminar</Button></DialogFooter></DialogContent>
            </Dialog>
        </>
    );
}