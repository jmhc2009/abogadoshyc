import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import type { Client, ClientForm } from '@/types/client';
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

interface ClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    client?: Client | null;
    onSuccess?: () => void;
}

export default function ClientModal({
    isOpen,
    onClose,
    client,
    onSuccess,
}: ClientModalProps) {
    const isEditing = !!client;

    const { data, setData, post, put, processing, errors, reset } =
        useForm<ClientForm>({
            name: '',
            rut: '',
            street: null,
            number: null,
            commune: null,
            region: null,
            occupation: null,
            marital_status: null,
            phone: null,
            email: null,
            nationality: null,
        });

    useEffect(() => {
        if (client) {
            setData(client as ClientForm);
        } else {
            reset();
        }
    }, [client, reset, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitAction = isEditing ? put : post;

        submitAction(`/clients${isEditing ? `/${client?.id}` : ''}`, {
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

    const maritalStatusOptions = [
        { value: 'soltero', label: 'Soltero' },
        { value: 'casado', label: 'Casado' },
        { value: 'divorciado', label: 'Divorciado' },
        { value: 'viudo', label: 'Viudo' },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Actualizar la información del cliente a continuación'
                            : 'Llene la información del cliente a continuación'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre completo *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Juan Pérez"
                                disabled={processing}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

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
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email || ''}
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

                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                                id="phone"
                                value={data.phone || ''}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                placeholder="+56 9 1234 5678"
                                disabled={processing}
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="street">Calle</Label>
                            <Input
                                id="street"
                                value={data.street || ''}
                                onChange={(e) =>
                                    setData('street', e.target.value)
                                }
                                placeholder="Av. Siempre Viva"
                                disabled={processing}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="number">Número</Label>
                            <Input
                                id="number"
                                value={data.number || ''}
                                onChange={(e) =>
                                    setData('number', e.target.value)
                                }
                                placeholder="123"
                                disabled={processing}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="commune">Comuna</Label>
                            <Input
                                id="commune"
                                value={data.commune || ''}
                                onChange={(e) =>
                                    setData('commune', e.target.value)
                                }
                                placeholder="Providencia"
                                disabled={processing}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="region">Región</Label>
                            <Input
                                id="region"
                                value={data.region || ''}
                                onChange={(e) =>
                                    setData('region', e.target.value)
                                }
                                placeholder="Metropolitana"
                                disabled={processing}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="occupation">Ocupación</Label>
                            <Input
                                id="occupation"
                                value={data.occupation || ''}
                                onChange={(e) =>
                                    setData('occupation', e.target.value)
                                }
                                placeholder="Ingeniero"
                                disabled={processing}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="marital_status">Estado civil</Label>
                            <Select
                                value={data.marital_status || ''}
                                onValueChange={(value) =>
                                    setData(
                                        'marital_status',
                                        (value as string) || null,
                                    )
                                }
                                disabled={processing}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Ninguno</SelectItem>
                                    {maritalStatusOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.marital_status && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.marital_status}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nationality">Nacionalidad</Label>
                        <Input
                            id="nationality"
                            value={data.nationality || ''}
                            onChange={(e) =>
                                setData('nationality', e.target.value)
                            }
                            placeholder="Chileno"
                            disabled={processing}
                        />
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
                            {isEditing ? 'Actualizar' : 'Crear'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
