export type NavItemType = {
	id: string
	label?: string
	auth?: string[] | string
	requiredFeature?: string
	icon?: string
	url?: string
	target?: string
	type?: string
	disabled?: boolean
	active?: boolean
	end?: boolean
	children?: NavItemType[]
	hasPermission?: boolean
}

export type FlatNavItemType = Omit<NavItemType, 'children' | 'sx'> & { children?: string[]; order: string }