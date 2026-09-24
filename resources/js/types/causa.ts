export interface Causa {
    id: number;
    identificador: string;
    tipo_identificador: 'ROL' | 'RIT' | 'RUC';
    numero_identificador: string;
    caratula: string;
    fecha_ingreso: string;
    tribunal: string;
    asunto: string | null;
    intervinientes_representado: string;
    representado_ids: number[];
    intervinientes_contraparte: string | null;
    estado: string;
    fecha_termino: string | null;
    observaciones: string | null;
}

export interface CausaForm {
    tipo_identificador: 'ROL' | 'RIT' | 'RUC' | '';
    numero_identificador: string;
    caratula: string;
    fecha_ingreso: string;
    tribunal: string;
    asunto: string | null;
    representado_ids: number[];
    intervinientes_contraparte: string | null;
    estado: string;
    fecha_termino: string | null;
    observaciones: string | null;
}