import type { ReactNode } from 'react'
import { createContext, type PropsWithChildren, useContext, useState } from 'react'

const NarrativeContext = createContext<{ setNarrative: (content: ReactNode) => void } | null>(null)

export function NarrativeProvider({ intro, children }: PropsWithChildren<{ intro?: ReactNode }>) {
	const [narrative, setNarrative] = useState<ReactNode>(intro)
	return (
		<NarrativeContext.Provider value={{ setNarrative }}>
			{narrative !== null ? (
				<div
					id="narrative"
					className="fixed top-0 left-0 z-50 h-full w-full"
					onClick={() => setNarrative(null)}
				>
					{narrative}
				</div>
			) : (
				children
			)}
		</NarrativeContext.Provider>
	)
}

export function useNarrative() {
	const context = useContext(NarrativeContext)
	if (!context) {
		throw new Error('useNarrative must be used within a NarrativeProvider')
	}
	return context
}
