export interface Audiencia {
    id: number;
    tipo: string;
    fecha: string;
    hora: string;
    tribunal: string;
    comparecencia: string;
    observaciones: string | null;
}

export interface AudienciaForm {
    tipo: string;
    fecha: string;
    hora: string;
    tribunal: string;
    comparecencia: string;
    observaciones: string | null;
}
