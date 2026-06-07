export type DeepLinkType = 'profile' | 'event' | 'listing' | 'unknown'

export interface ParsedDeepLink {
	type: DeepLinkType
	id: string
}
