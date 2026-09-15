export interface Client {
    id: number;
    name: string;
    rut: string;
    street?: string | null;
    number?: string | null;
    commune?: string | null;
    region?: string | null;
    occupation?: string | null;
    marital_status?: string | null;
    phone?: string | null;
    email?: string | null;
    nationality?: string | null;
    created_at: string;
    updated_at: string;
}

export interface ClientForm {
    name: string;
    rut: string;
    street?: string | null;
    number?: string | null;
    commune?: string | null;
    region?: string | null;
    occupation?: string | null;
    marital_status?: string | null;
    phone?: string | null;
    email?: string | null;
    nationality?: string | null;
}
