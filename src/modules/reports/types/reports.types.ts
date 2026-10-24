export interface ReportFilters{from?:string;to?:string;company_id?:number;store_id?:number}
export interface ReportDefinition{id:string;name:string;category:'Comercial'|'Clínica'|'Laboratorio'|'Inventario'|'Finanzas';description:string;owner?:string;available:boolean}
export interface AuditFilters{search?:string;module?:string;action?:string;user_id?:number;from?:string;to?:string;limit?:number;offset?:number}
export interface AuditEntry{id:number;code:string;entity:string;action:string;user_name:string;detail?:string;created_at:string;previous_value?:string;new_value?:string}
