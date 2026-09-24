import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import type { Abogado, AbogadoForm } from '@/types/abogado';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, X } from 'lucide-react';

interface AbogadoModalProps {
    isOpen: boolean;
    onClose: () => void;
    abogado?: Abogado | null;
    onSuccess?: () => void;
}

export default function AbogadoModal({
    isOpen,
    onClose,
    abogado,
    onSuccess,
}: AbogadoModalProps) {
    const isEditing = !!abogado;

    const { data, setData, post, put, processing, errors, reset } =
        useForm<AbogadoForm>({
            nombres: '',
            apellidos: '',
            rut: '',
            email: '',
            telefono: null,
            especialidad: null,
            is_active: true,
        });

    useEffect(() => {
        if (abogado) {
            setData({
                nombres: abogado.nombres,
                apellidos: abogado.apellidos,
                rut: abogado.rut,
                email: abogado.email,
                telefono: abogado.phone ?? null,
                especialidad: abogado.especialidad ?? null,
                is_active: abogado.is_active,
            });
        } else {
            reset();
        }
    }, [abogado, reset, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitAction = isEditing ? put : post;

        submitAction(`/abogados${isEditing ? `/${abogado?.id}` : ''}`, {
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

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar Abogado' : 'Nuevo Abogado'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Actualiza la información del abogado'
                            : 'Llena la información del abogado'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="nombres">Nombres *</Label>
                            <Input
                                id="nombres"
                                value={data.nombres}
                                onChange={(e) =>
                                    setData('nombres', e.target.value)
                                }
                                placeholder="Juan"
                                disabled={processing}
                            />
                            {errors.nombres && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.nombres}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="apellidos">Apellidos *</Label>
                            <Input
                                id="apellidos"
                                value={data.apellidos}
                                onChange={(e) =>
                                    setData('apellidos', e.target.value)
                                }
                                placeholder="Pérez González"
                                disabled={processing}
                            />
                            {errors.apellidos && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.apellidos}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="rut">RUT *</Label>
                            <Input
                                id="rut"
                                value={data.rut}
                                onChange={(e) => setData('rut', e.target.value)}
                                placeholder="12.345.678-9"
                                disabled={processing}
                            />
                            {errors.rut && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.rut}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="juan@ejemplo.com"
                                disabled={processing}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input
                                id="telefono"
                                value={data.telefono || ''}
                                onChange={(e) =>
                                    setData('telefono', e.target.value)
                                }
                                placeholder="+56 9 1234 5678"
                                disabled={processing}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="especialidad">Especialidad</Label>
                            <Input
                                id="especialidad"
                                value={data.especialidad || ''}
                                onChange={(e) =>
                                    setData('especialidad', e.target.value)
                                }
                                placeholder="Derecho Civil"
                                disabled={processing}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="is_active">Estado</Label>
                        <Select
                            value={data.is_active ? 'true' : 'false'}
                            onValueChange={(value) =>
                                setData('is_active', value === 'true')
                            }
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Activo</SelectItem>
                                <SelectItem value="false">Inactivo</SelectItem>
                            </SelectContent>
                        </Select>
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
                            {isEditing ? ' Actualizar' : ' Crear'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
