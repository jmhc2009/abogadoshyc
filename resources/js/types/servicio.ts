export interface Servicio {
    id: number;
    nombre: string;
    valor: number;
    valor_formatted: string;
    medio_pago: string;
    cantidad_cuotas: number;
    cuota_inicial: number | null;
    cuota_inicial_formatted: string | null;
    observaciones: string | null;
    created_at: string;
    updated_at: string;
}

export interface ServicioForm {
    nombre: string;
    valor: number;
    medio_pago: string;
    cantidad_cuotas: number;
    cuota_inicial: number | null;
    observaciones: string | null;
}