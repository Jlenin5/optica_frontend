export type LensFeatureType = 'FOCUS'|'MATERIAL'|'SERVICE'|'TREATMENT'|'INDEX'|'FILTER'|'OTHER'
export interface LensFeature { id:number; company_id:number; type:LensFeatureType; code:string; name:string; description:string|null; status:boolean }
export interface LensTypeFeature { id:number; feature_id:number; lens_type_id:number; extra_price:string; feature?:LensFeature }
export interface LensType { id:number; company_id:number; code:string; name:string; description:string|null; base_price:string; status:boolean; features:LensFeature[]; lens_type_features?:LensTypeFeature[] }
export interface LensFeatureDTO { type:LensFeatureType; code:string; name:string; description?:string|null; status?:boolean }
export interface LensTypeDTO { code:string; name:string; description?:string|null; base_price:number; feature_ids:number[]; status?:boolean }
