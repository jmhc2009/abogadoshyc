import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import type { Audiencia, AudienciaForm } from '@/types/audiencia';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, X } from 'lucide-react';

interface AudienciaModalProps {
    isOpen: boolean;
    onClose: () => void;
    audiencia?: Audiencia | null;
    tipos: string[];
    comparecencias: string[];
}

const emptyForm: AudienciaForm = { tipo: '', fecha: '', hora: '', tribunal: '', comparecencia: '', observaciones: null };

export default function AudienciaModal({ isOpen, onClose, audiencia, tipos, comparecencias }: AudienciaModalProps) {
    const isEditing = !!audiencia;
    const { data, setData, post, put, processing, errors, reset } = useForm<AudienciaForm>(emptyForm);

    useEffect(() => {
        if (audiencia) setData({ ...audiencia });
        else reset();
    }, [audiencia, reset, setData]);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const action = isEditing ? put : post;
        action(`/audiencias${isEditing ? `/${audiencia?.id}` : ''}`, { preserveScroll: true, onSuccess: onClose });
    };

    const field = (name: keyof AudienciaForm) => errors[name] && <p className="text-sm text-red-600">{errors[name]}</p>;

    return <Dialog open={isOpen} onOpenChange={(open) => !open && !processing && onClose()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader><DialogTitle>{isEditing ? 'Editar audiencia' : 'Nueva audiencia'}</DialogTitle><DialogDescription>Completa la información de la audiencia.</DialogDescription></DialogHeader>
            <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2"><Label htmlFor="tipo">Tipo *</Label><Select value={data.tipo} onValueChange={(value) => setData('tipo', value)} disabled={processing}><SelectTrigger id="tipo" className="w-full"><SelectValue placeholder="Seleccionar tipo..." /></SelectTrigger><SelectContent>{tipos.map((tipo) => <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>)}</SelectContent></Select>{field('tipo')}</div>
                    <div className="space-y-2"><Label htmlFor="comparecencia">Comparecencia *</Label><Select value={data.comparecencia} onValueChange={(value) => setData('comparecencia', value)} disabled={processing}><SelectTrigger id="comparecencia" className="w-full"><SelectValue placeholder="Seleccionar modalidad..." /></SelectTrigger><SelectContent>{comparecencias.map((comparecencia) => <SelectItem key={comparecencia} value={comparecencia}>{comparecencia}</SelectItem>)}</SelectContent></Select>{field('comparecencia')}</div>
                    <div className="space-y-2"><Label htmlFor="fecha">Fecha *</Label><Input id="fecha" type="date" value={data.fecha} onChange={(event) => setData('fecha', event.target.value)} disabled={processing} />{field('fecha')}</div>
                    <div className="space-y-2"><Label htmlFor="hora">Hora *</Label><Input id="hora" type="time" value={data.hora} onChange={(event) => setData('hora', event.target.value)} disabled={processing} />{field('hora')}</div>
                    <div className="space-y-2 md:col-span-2"><Label htmlFor="tribunal">Tribunal *</Label><Input id="tribunal" value={data.tribunal} onChange={(event) => setData('tribunal', event.target.value)} placeholder="Juzgado de Letras de Santiago" disabled={processing} />{field('tribunal')}</div>
                </div>
                <div className="space-y-2"><Label htmlFor="observaciones">Observaciones</Label><textarea id="observaciones" rows={4} value={data.observaciones ?? ''} onChange={(event) => setData('observaciones', event.target.value || null)} placeholder="Detalles adicionales..." disabled={processing} className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-24 w-full resize-y rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50" />{field('observaciones')}</div>
                <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onClose} disabled={processing}><X className="mr-2 size-4" />Cancelar</Button><Button type="submit" disabled={processing}>{processing && <Loader2 className="mr-2 size-4 animate-spin" />}{isEditing ? 'Actualizar audiencia' : 'Crear audiencia'}</Button></div>
            </form>
        </DialogContent>
    </Dialog>;
}
