import http from '@/services/http'
import type {PaginatedResponse} from '@/types/global.types'
import type {AuditEntry,AuditFilters,ReportDefinition,ReportFilters} from '../types/reports.types'
export const getReports=async(params:ReportFilters={})=>(await http.get<ReportDefinition[]>('/reports',{params})).data
export const getAuditEntries=async(params:AuditFilters={})=>(await http.get<PaginatedResponse<AuditEntry>>('/audit-log',{params})).data
