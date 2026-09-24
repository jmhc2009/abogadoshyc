import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import type { Servicio, ServicioForm } from '@/types/servicio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, X } from 'lucide-react';

interface ServicioModalProps {
    isOpen: boolean;
    onClose: () => void;
    servicio?: Servicio | null;
    onSuccess?: () => void;
}

export default function ServicioModal({
    isOpen,
    onClose,
    servicio,
    onSuccess,
}: ServicioModalProps) {
    const isEditing = !!servicio;

    const { data, setData, post, put, processing, errors, reset } =
        useForm<ServicioForm>({
            nombre: '',
            valor: 0,
            medio_pago: '',
            cantidad_cuotas: 1,
            cuota_inicial: null,
            observaciones: null,
        });

    useEffect(() => {
        if (servicio) {
            setData({
                nombre: servicio.nombre,
                valor: servicio.valor,
                medio_pago: servicio.medio_pago,
                cantidad_cuotas: servicio.cantidad_cuotas,
                cuota_inicial: servicio.cuota_inicial,
                observaciones: servicio.observaciones,
            });
        } else {
            reset();
        }
    }, [servicio, reset, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitAction = isEditing ? put : post;

        submitAction(`/servicios${isEditing ? `/${servicio?.id}` : ''}`, {
            onSuccess: () => {
                onSuccess?.();
                onClose();
            },
            preserveScroll: true,
        });
    };

    const handleClose = () => {
        if (!processing) {
            onClose();
        }
    };

    const handleNumericChange =
        (field: 'valor' | 'cantidad_cuotas' | 'cuota_inicial') =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value;
            if (raw === '') {
                setData(field, field === 'cuota_inicial' ? null : 0);
                return;
            }
            const parsed = Number(raw);
            if (!Number.isNaN(parsed)) {
                setData(field, parsed);
            }
        };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Actualiza la información del servicio a continuación'
                            : 'Llena la información del servicio a continuación'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre *</Label>
                            <Input
                                id="nombre"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                placeholder="Asesoría laboral"
                                disabled={processing}
                            />
                            {errors.nombre && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.nombre}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="valor">Valor *</Label>
                            <Input
                                id="valor"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.valor}
                                onChange={handleNumericChange('valor')}
                                placeholder="150000"
                                disabled={processing}
                            />
                            {errors.valor && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.valor}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="medio_pago">Medio de Pago *</Label>
                            <select
                                id="medio_pago"
                                value={data.medio_pago}
                                onChange={(e) => setData('medio_pago', e.target.value)}
                                disabled={processing}
                                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="" disabled>
                                    Seleccionar medio de pago...
                                </option>
                                <option value="Transferencia Bancaria">
                                    Transferencia Bancaria
                                </option>
                                <option value="Tarjeta de Débito (Redcompra / Webpay)">
                                    Tarjeta de Débito (Redcompra / Webpay)
                                </option>
                                <option value="Tarjeta de Crédito">
                                    Tarjeta de Crédito
                                </option>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Mercado Pago">Mercado Pago</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                            {errors.medio_pago && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.medio_pago}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cantidad_cuotas">Cantidad de cuotas *</Label>
                            <Input
                                id="cantidad_cuotas"
                                type="number"
                                step="1"
                                min="1"
                                value={data.cantidad_cuotas}
                                onChange={handleNumericChange('cantidad_cuotas')}
                                placeholder="3"
                                disabled={processing}
                            />
                            {errors.cantidad_cuotas && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.cantidad_cuotas}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="cuota_inicial">Cuota Inicial</Label>
                            <Input
                                id="cuota_inicial"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.cuota_inicial ?? ''}
                                onChange={handleNumericChange('cuota_inicial')}
                                placeholder="Opcional"
                                disabled={processing}
                            />
                            {errors.cuota_inicial && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.cuota_inicial}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="observaciones">Observaciones</Label>
                        <textarea
                            id="observaciones"
                            rows={3}
                            value={data.observaciones ?? ''}
                            onChange={(e) =>
                                setData('observaciones', e.target.value || null)
                            }
                            placeholder="Detalles adicionales del servicio..."
                            disabled={processing}
                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        {errors.observaciones && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.observaciones}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isEditing ? 'Actualizando' : 'Creando'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}