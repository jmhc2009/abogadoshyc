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

import AbogadoModal from '@/components/abogados/AbogadoModal';
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
import type { Abogado } from '@/types/abogado';
import {
    pdf as abogadoPdfRoute,
    show as abogadoShowRoute,
} from '@/routes/abogados';

interface IndexProps {
    abogados: {
        data: Abogado[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search: string;
    };
}

const formatPhone = (phone?: string | null) => {
    if (!phone) return 'Sin teléfono';
    return phone.startsWith('+') ? phone : `+56 ${phone}`;
};

export default function Index({ abogados, filters }: IndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAbogado, setEditingAbogado] = useState<Abogado | null>(null);
    const [abogadoToDelete, setAbogadoToDelete] = useState<Abogado | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    const normalizedSearch = (searchTerm || '').trim().toLowerCase();
    const filteredAbogados = abogados.data.filter((abogado) =>
        [
            abogado.nombres,
            abogado.apellidos,
            abogado.rut,
            abogado.email,
            abogado.especialidad,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch),
    );

    const openCreateModal = () => {
        setEditingAbogado(null);
        setIsModalOpen(true);
    };

    const openEditModal = (abogado: Abogado) => {
        setEditingAbogado(abogado);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAbogado(null);
    };

    const handleDelete = () => {
        if (!abogadoToDelete) return;

        setIsDeleting(true);
        router.delete(`/abogados/${abogadoToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Abogado eliminado correctamente.');
                setAbogadoToDelete(null);
            },
            onError: () => toast.error('No se pudo eliminar el abogado.'),
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <>
            <Head title="Abogados" />

            <div className="space-y-6 p-4 md:p-6">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                            Abogados
                        </h1>
                        <p className="text-sm text-slate-500">
                            Gestiona la información y detalles de contacto de
                            tus abogados.
                        </p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="h-10 rounded-lg bg-slate-950 px-4 text-white shadow-sm hover:bg-slate-800"
                    >
                        <Plus className="size-4" />
                        Nuevo abogado
                    </Button>
                </header>

                <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
                    <CardHeader className="gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
                        <div>
                            <CardTitle className="text-lg text-slate-900">
                                Lista de abogados
                            </CardTitle>
                            <CardDescription className="mt-1 text-slate-500">
                                {filteredAbogados.length}{' '}
                                {filteredAbogados.length === 1
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
                                placeholder="Buscar por nombre, RUT, email o especialidad..."
                                aria-label="Buscar abogados"
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
                                            Especialidad
                                        </TableHead>
                                        <TableHead className="w-auto px-3 py-3 text-right text-sm font-medium whitespace-nowrap text-slate-500 normal-case md:px-5">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAbogados.map((abogado) => (
                                        <TableRow
                                            key={abogado.id}
                                            className="border-slate-100 hover:bg-slate-50/70"
                                        >
                                            <TableCell className="text-foreground px-3 py-4 text-sm font-normal whitespace-nowrap md:px-5">
                                                {abogado.nombres}{' '}
                                                {abogado.apellidos}
                                            </TableCell>
                                            <TableCell className="text-foreground px-3 py-4 text-sm font-normal whitespace-nowrap md:px-5">
                                                {abogado.rut_formatted}
                                            </TableCell>
                                            <TableCell className="text-foreground px-3 py-4 text-sm font-normal whitespace-nowrap md:px-5">
                                                {abogado.email || 'Sin correo'}
                                            </TableCell>
                                            <TableCell className="text-foreground px-3 py-4 text-sm font-normal whitespace-nowrap md:px-5">
                                                {formatPhone(abogado.phone)}
                                            </TableCell>
                                            <TableCell className="text-foreground px-3 py-4 text-sm font-normal whitespace-nowrap md:px-5">
                                                {abogado.especialidad ||
                                                    'Sin especialidad'}
                                            </TableCell>
                                            <TableCell className="px-3 py-4 text-right whitespace-nowrap md:px-5">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        asChild
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title={`Descargar ficha PDF de ${abogado.nombres} ${abogado.apellidos}`}
                                                        aria-label={`Descargar ficha PDF de ${abogado.nombres} ${abogado.apellidos}`}
                                                        className="size-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                                    >
                                                        <a
                                                            href={
                                                                abogadoPdfRoute(
                                                                    abogado.id,
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
                                                        title={`Ver a ${abogado.nombres} ${abogado.apellidos}`}
                                                        aria-label={`Ver a ${abogado.nombres} ${abogado.apellidos}`}
                                                        onClick={() =>
                                                            router.visit(
                                                                abogadoShowRoute(
                                                                    abogado.id,
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
                                                        title={`Editar a ${abogado.nombres} ${abogado.apellidos}`}
                                                        aria-label={`Editar a ${abogado.nombres} ${abogado.apellidos}`}
                                                        onClick={() =>
                                                            openEditModal(
                                                                abogado,
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
                                                        title={`Eliminar a ${abogado.nombres} ${abogado.apellidos}`}
                                                        aria-label={`Eliminar a ${abogado.nombres} ${abogado.apellidos}`}
                                                        onClick={() =>
                                                            setAbogadoToDelete(
                                                                abogado,
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

                        {filteredAbogados.length === 0 && (
                            <div className="flex min-h-40 flex-col items-center justify-center gap-2 px-6 text-center">
                                <Search className="size-5 text-slate-300" />
                                <p className="text-sm font-medium text-slate-700">
                                    No encontramos abogados
                                </p>
                                <p className="text-sm text-slate-500">
                                    Prueba con otro nombre, RUT, correo,
                                    teléfono o especialidad.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AbogadoModal
                isOpen={isModalOpen}
                abogado={editingAbogado}
                onClose={closeModal}
            />

            <Dialog
                open={!!abogadoToDelete}
                onOpenChange={(open) => !open && setAbogadoToDelete(null)}
            >
                <DialogContent className="rounded-xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Eliminar abogado</DialogTitle>
                        <DialogDescription>
                            Esta acción no se puede deshacer. ¿Quieres eliminar
                            a{' '}
                            <strong>
                                {abogadoToDelete?.nombres}{' '}
                                {abogadoToDelete?.apellidos}
                            </strong>
                            ?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setAbogadoToDelete(null)}
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
