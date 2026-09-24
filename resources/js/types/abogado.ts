export interface Abogado {
    id: number;
    nombres: string;
    apellidos: string;
    rut: string;
    rut_formatted: string;
    email: string;
    phone?: string | null;
    especialidad?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface AbogadoForm {
    nombres: string;
    apellidos: string;
    rut: string;
    email: string;
    telefono?: string | null;
    especialidad?: string | null;
    is_active?: boolean;
}
