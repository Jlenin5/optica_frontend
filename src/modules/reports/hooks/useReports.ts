import {useQuery} from '@tanstack/react-query'
import {getAuditEntries,getReports} from '../api/reports.api'
import type {AuditFilters,ReportFilters} from '../types/reports.types'
export const useReports=(filters:ReportFilters={})=>useQuery({queryKey:['reports',filters],queryFn:()=>getReports(filters)})
export const useAudit=(filters:AuditFilters={})=>useQuery({queryKey:['audit-log',filters],queryFn:()=>getAuditEntries(filters)})
