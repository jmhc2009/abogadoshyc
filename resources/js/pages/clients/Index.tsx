import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    Eye,
    FileDown,
    Loader2,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';

import ClientModal from '@/components/clients/ClientModal';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Client } from '@/types/client';
import { show as clientRoute, pdf as clientPdfRoute } from '@/routes/clients';

interface IndexProps {
    clients: Client[];
}

const formatRut = (rut: string) => {
    const normalized = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    const verifier = normalized.slice(-1);
    const number = normalized.slice(0, -1);
    return number
        ? `${number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${verifier}`
        : rut;
};

const formatPhone = (phone?: string | null) => {
    if (!phone) return 'Sin teléfono';
    return phone.startsWith('+') ? phone : `+56 ${phone}`;
};

export default function Index({ clients }: IndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filteredClients = clients.filter((client) =>
        [client.name, client.rut, client.email, client.phone, client.commune]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch),
    );

    const openCreateModal = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    const openEditModal = (client: Client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingClient(null);
    };

    const handleDelete = () => {
        if (!clientToDelete) return;

        setIsDeleting(true);
        router.delete(`/clients/${clientToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Cliente eliminado correctamente.');
                setClientToDelete(null);
            },
            onError: () => toast.error('No se pudo eliminar el cliente.'),
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <>
            <Head title="Clientes" />

            <div className="space-y-6 p-4 md:p-6">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                            Clientes
                        </h1>
                        <p className="text-sm text-slate-500">
                            Gestiona la información y detalles de contacto de
                            tus clientes.
                        </p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="h-10 rounded-lg bg-slate-950 px-4 text-white shadow-sm hover:bg-slate-800"
                    >
                        <Plus className="size-4" />
                        Nuevo cliente
                    </Button>
                </header>

                <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
                    <CardHeader className="gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
                        <div>
                            <CardTitle className="text-lg text-slate-900">
                                Lista de clientes
                            </CardTitle>
                            <CardDescription className="mt-1 text-slate-500">
                                {filteredClients.length}{' '}
                                {filteredClients.length === 1
                                    ? 'registro'
                                    : 'registros'}{' '}
                                disponibles
                            </CardDescription>
                        </div>
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                placeholder="Buscar por nombre, RUT, email o teléfono..."
                                aria-label="Buscar clientes"
                                className="h-10 rounded-lg border-slate-200 pl-9 text-sm shadow-none focus-visible:ring-slate-400"
                            />
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="w-full overflow-x-auto">
                            <Table className="w-full min-w-[900px] table-auto">
                                <TableHeader className="bg-slate-50/80">
                                    <TableRow className="border-slate-200 hover:bg-transparent">
                                        <TableHead className="w-auto px-3 py-3 text-sm font-medium whitespace-nowrap text-slate-500 normal-case md:px-5">
                                            Nombre Completo
                                        </TableHead>
                                        <TableHead className="w-auto px-3 py-3 text-sm font-medium whitespace-nowrap text-slate-500 normal-case md:px-5">
                                            RUT
                                        </TableHead>
                                        <TableHead className="w-auto px-3 py-3 text-sm font-medium whitespace-nowrap text-slate-500 normal-case md:px-5">
                                            Correo Electrónico
                                        </TableHead>
                                        <TableHead className="w-auto px-3 py-3 text-sm font-medium whitespace-nowrap text-slate-500 normal-case md:px-5">
                                            Teléfono
                                        </TableHead>
                                        <TableHead className="w-auto px-3 py-3 text-sm font-medium whitespace-nowrap text-slate-500 normal-case md:px-5">
                                            Comuna
                                        </TableHead>
                                        <TableHead className="w-auto px-3 py-3 text-right text-sm font-medium whitespace-nowrap text-slate-500 normal-case md:px-5">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredClients.map((client) => (
                                        <TableRow
                                            key={client.id}
                                            className="border-slate-100 hover:bg-slate-50/70"
                                        >
                                            <TableCell className="text-foreground px-3 py-4 text-sm font-normal whitespace-nowrap md:px-5">
                                                {client.name}
                                            </TableCell>
                                            <TableCell className="text-foreground px-3 py-4 text-sm font-normal whitespace-nowrap md:px-5">
                                                {formatRut(client.rut)}
                                            </TableCell>
                                            <TableCell className="text-foreground px-3 py-4 text-sm font-normal whitespace-nowrap md:px-5">
                                                {client.email || 'Sin correo'}
                                            </TableCell>
                                            <TableCell className="text-foreground px-3 py-4 text-sm font-normal whitespace-nowrap md:px-5">
                                                {formatPhone(client.phone)}
                                            </TableCell>
                                            <TableCell className="text-foreground px-3 py-4 text-sm font-normal whitespace-nowrap md:px-5">
                                                {client.commune || 'Sin comuna'}
                                            </TableCell>
                                            <TableCell className="px-3 py-4 text-right whitespace-nowrap md:px-5">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        asChild
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title={`Descargar ficha PDF de ${client.name}`}
                                                        aria-label={`Descargar ficha PDF de ${client.name}`}
                                                        className="size-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                                    >
                                                        <a
                                                            href={
                                                                clientPdfRoute(
                                                                    client.id,
                                                                ).url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <FileDown className="size-4" />
                                                        </a>
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title={`Ver a ${client.name}`}
                                                        aria-label={`Ver a ${client.name}`}
                                                        onClick={() =>
                                                            router.visit(
                                                                clientRoute(
                                                                    client.id,
                                                                ).url,
                                                            )
                                                        }
                                                        className="size-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                                    >
                                                        <Eye className="size-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title={`Editar a ${client.name}`}
                                                        aria-label={`Editar a ${client.name}`}
                                                        onClick={() =>
                                                            openEditModal(
                                                                client,
                                                            )
                                                        }
                                                        className="size-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title={`Eliminar a ${client.name}`}
                                                        aria-label={`Eliminar a ${client.name}`}
                                                        onClick={() =>
                                                            setClientToDelete(
                                                                client,
                                                            )
                                                        }
                                                        className="size-8 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {filteredClients.length === 0 && (
                            <div className="flex min-h-40 flex-col items-center justify-center gap-2 px-6 text-center">
                                <Search className="size-5 text-slate-300" />
                                <p className="text-sm font-medium text-slate-700">
                                    No encontramos clientes
                                </p>
                                <p className="text-sm text-slate-500">
                                    Prueba con otro nombre, RUT, correo o
                                    teléfono.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ClientModal
                isOpen={isModalOpen}
                client={editingClient}
                onClose={closeModal}
            />

            <Dialog
                open={!!clientToDelete}
                onOpenChange={(open) => !open && setClientToDelete(null)}
            >
                <DialogContent className="rounded-xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Eliminar cliente</DialogTitle>
                        <DialogDescription>
                            Esta acción no se puede deshacer. ¿Quieres eliminar
                            a <strong>{clientToDelete?.name}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setClientToDelete(null)}
                            disabled={isDeleting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            Eliminar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
