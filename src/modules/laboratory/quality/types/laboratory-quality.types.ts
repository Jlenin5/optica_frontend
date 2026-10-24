export type QualityStatus='Pendiente'|'En proceso'|'Observado'|'Listo'|'Completado'|'Cancelado'
export interface QualityFilters{search?:string;status?:QualityStatus;company_id?:number;limit?:number;offset?:number}
export interface LaboratoryQuality{id:number;code:string;laboratory_order_code:string;lens_description?:string;status:QualityStatus;technician_name?:string;result?:string;notes?:string;checked_at?:string}
export interface LaboratoryQualityDTO{laboratory_order_code:string;lens_description?:string;status?:QualityStatus;technician_name?:string;result?:string;notes?:string;company_id?:number}
