import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import type { Causa, CausaForm } from '@/types/causa';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CausaModalProps {
    isOpen: boolean;
    onClose: () => void;
    causa?: Causa | null;
    estados: string[];
    clientes: Array<{ id: number; name: string }>;
}

const emptyForm: CausaForm = {
    tipo_identificador: '', numero_identificador: '', caratula: '', fecha_ingreso: '', tribunal: '', asunto: null,
    representado_ids: [], intervinientes_contraparte: null, estado: '',
    fecha_termino: null, observaciones: null,
};

export default function CausaModal({ isOpen, onClose, causa, estados, clientes }: CausaModalProps) {
    const isEditing = !!causa;
    const [representadosOpen, setRepresentadosOpen] = useState(false);
    const { data, setData, post, put, processing, errors, reset } = useForm<CausaForm>(emptyForm);

    useEffect(() => {
        if (causa) setData({ ...causa });
        else reset();
    }, [causa, reset, setData]);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const action = isEditing ? put : post;
        action(`/causas${isEditing ? `/${causa?.id}` : ''}`, {
            preserveScroll: true,
            onSuccess: onClose,
        });
    };

    const field = (name: keyof CausaForm) => errors[name] && <p className="text-sm text-red-600">{errors[name]}</p>;
    const selectedClients = clientes.filter((cliente) => data.representado_ids.includes(cliente.id));
    const toggleRepresentado = (clientId: number) => {
        const selected = data.representado_ids.includes(clientId);
        setData('representado_ids', selected
            ? data.representado_ids.filter((id) => id !== clientId)
            : [...data.representado_ids, clientId]);
    };

    return <Dialog open={isOpen} onOpenChange={(open) => !open && !processing && onClose()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
            <DialogHeader><DialogTitle>{isEditing ? 'Editar causa' : 'Nueva causa'}</DialogTitle><DialogDescription>Completa la información judicial de la causa.</DialogDescription></DialogHeader>
            <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2"><Label htmlFor="tipo_identificador">Identificador *</Label><div className="flex gap-2"><select id="tipo_identificador" value={data.tipo_identificador} onChange={(e) => setData('tipo_identificador', e.target.value as CausaForm['tipo_identificador'])} disabled={processing} className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-24 shrink-0 rounded-md border bg-transparent px-2 text-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"><option value="" disabled>Tipo</option><option value="ROL">ROL</option><option value="RIT">RIT</option><option value="RUC">RUC</option></select><Input id="numero_identificador" value={data.numero_identificador} onChange={(e) => setData('numero_identificador', e.target.value)} placeholder="C-1234-2026" disabled={processing} /></div>{field('tipo_identificador')}{field('numero_identificador')}</div>
                    <div className="space-y-2"><Label htmlFor="caratula">Carátula *</Label><Input id="caratula" value={data.caratula} onChange={(e) => setData('caratula', e.target.value)} placeholder="Pérez con González" disabled={processing} />{field('caratula')}</div>
                    <div className="space-y-2"><Label htmlFor="fecha_ingreso">Fecha de ingreso *</Label><Input id="fecha_ingreso" type="date" value={data.fecha_ingreso} onChange={(e) => setData('fecha_ingreso', e.target.value)} disabled={processing} />{field('fecha_ingreso')}</div>
                    <div className="space-y-2"><Label htmlFor="tribunal">Tribunal *</Label><Input id="tribunal" value={data.tribunal} onChange={(e) => setData('tribunal', e.target.value)} placeholder="Juzgado de Letras de Santiago" disabled={processing} />{field('tribunal')}</div>
                    <div className="space-y-2"><Label htmlFor="representado_ids">Representado *</Label><Popover open={representadosOpen} onOpenChange={setRepresentadosOpen}><PopoverTrigger asChild><Button id="representado_ids" type="button" variant="outline" disabled={processing} className="h-auto min-h-9 w-full justify-between gap-2 px-3 py-1.5 font-normal"><span className="flex min-w-0 flex-wrap gap-1">{selectedClients.length > 0 ? selectedClients.map((cliente) => <Badge key={cliente.id} variant="secondary" className="max-w-full gap-1"><span className="truncate">{cliente.name}</span><span role="button" tabIndex={0} aria-label={`Quitar ${cliente.name}`} className="cursor-pointer rounded-full outline-none hover:text-destructive" onClick={(event) => { event.stopPropagation(); toggleRepresentado(cliente.id); }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); toggleRepresentado(cliente.id); } }}><X className="size-3" /></span></Badge>) : <span className="text-muted-foreground">Seleccionar representados...</span>}</span><ChevronsUpDown className="size-4 shrink-0 opacity-50" /></Button></PopoverTrigger><PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0"><Command><CommandInput placeholder="Buscar cliente..." /><CommandList><CommandEmpty>No se encontraron clientes.</CommandEmpty>{clientes.map((cliente) => { const selected = data.representado_ids.includes(cliente.id); return <CommandItem key={cliente.id} value={cliente.name} onSelect={() => toggleRepresentado(cliente.id)}><Check className={`size-4 ${selected ? 'opacity-100' : 'opacity-0'}`} /><span>{cliente.name}</span></CommandItem>; })}</CommandList></Command><div className="border-t p-1"><Button type="button" variant="ghost" size="sm" className="w-full" disabled={selectedClients.length === 0} onClick={() => setData('representado_ids', [])}>Limpiar selección</Button></div></PopoverContent></Popover>{field('representado_ids')}</div>
                    <div className="space-y-2"><Label htmlFor="intervinientes_contraparte">Contraparte</Label><Input id="intervinientes_contraparte" value={data.intervinientes_contraparte ?? ''} onChange={(e) => setData('intervinientes_contraparte', e.target.value || null)} disabled={processing} />{field('intervinientes_contraparte')}</div>
                    <div className="space-y-2"><Label htmlFor="estado">Estado *</Label><select id="estado" value={data.estado} onChange={(e) => setData('estado', e.target.value)} disabled={processing} className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"><option value="" disabled>Seleccionar estado...</option>{estados.map((estado) => <option key={estado} value={estado}>{estado}</option>)}</select>{field('estado')}</div>
                    <div className="space-y-2"><Label htmlFor="fecha_termino">Fecha de término</Label><Input id="fecha_termino" type="date" value={data.fecha_termino ?? ''} onChange={(e) => setData('fecha_termino', e.target.value || null)} disabled={processing} />{field('fecha_termino')}</div>
                </div>
                <div className="space-y-2"><Label htmlFor="asunto">Asunto</Label><textarea id="asunto" rows={2} value={data.asunto ?? ''} onChange={(e) => setData('asunto', e.target.value || null)} disabled={processing} className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-16 w-full resize-y rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-[3px]" />{field('asunto')}</div>
                <div className="space-y-2"><Label htmlFor="observaciones">Observaciones</Label><textarea id="observaciones" rows={3} value={data.observaciones ?? ''} onChange={(e) => setData('observaciones', e.target.value || null)} disabled={processing} className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-20 w-full resize-y rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-[3px]" />{field('observaciones')}</div>
                <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onClose} disabled={processing}><X className="mr-2 size-4" />Cancelar</Button><Button type="submit" disabled={processing}>{processing && <Loader2 className="mr-2 size-4 animate-spin" />}{isEditing ? 'Actualizar causa' : 'Crear causa'}</Button></div>
            </form>
        </DialogContent>
    </Dialog>;
}