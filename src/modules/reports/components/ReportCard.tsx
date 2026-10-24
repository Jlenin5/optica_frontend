import type {ReportDefinition} from '../types/reports.types'
export const ReportCard=({report}:{report:ReportDefinition})=><article className="operational-report-card"><span>{report.category}</span><h3>{report.name}</h3><p>{report.description}</p><small>{report.owner??'Administración'}</small></article>
