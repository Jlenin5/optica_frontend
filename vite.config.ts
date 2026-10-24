import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
			jsxImportSource: '@emotion/react'
		}),
		tailwindcss(),
  ],
	base: "/optica_frontend/",
  resolve: {
		alias: {
			'@': '/src',
			'@styles': '/src/styles',
			'@components': '/src/components',
			'@config': '/src/app/config',
			'@roles': '/src/modules/roles',
			'@users': '/src/modules/users',
			'@appointments': '/src/modules/clinical/appointments',
			'@patients': '/src/modules/clinical/patients',
			'@prescriptions': '/src/modules/clinical/prescriptions',
			'@companies': '/src/modules/organizations/companies',
			'@branch-offices': '/src/modules/organizations/branch-offices',
			'@warehouses': '/src/modules/organizations/warehouses',
			'@stores': '/src/modules/organizations/stores',
			'@categories': '/src/modules/inventory/categories',
			'@brands': '/src/modules/inventory/brands',
			'@products': '/src/modules/inventory/products',
			'@currencies': '/src/modules/finance/accounting/currencies',
			'@banks': '/src/modules/finance/banking/banks',
			'@receipts': '/src/modules/documents/receipts',
			'@type-of-documents': '/src/modules/documents/type-of-documents',
			'@plans': '/src/modules/billing/plans',
			'@mock-api': '/src/@mock-api',
			'app/configs': '/src/app/configs',
		}
	},
  optimizeDeps: {
		include: [
			'@mui/icons-material',
			'@mui/material',
			'@mui/base',
			'@mui/styles',
			'@mui/system',
			'@mui/utils',
			'@emotion/cache',
			'@emotion/react',
			'@emotion/styled',
			'date-fns',
			'lodash'
		],
		exclude: [],
		esbuildOptions: {
			loader: {
				'.js': 'jsx'
			}
		}
	}
})