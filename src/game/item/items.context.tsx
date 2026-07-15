import { createContext, useContext } from 'react'

const ItemContext = createContext<{ itemId: string | null }>({ itemId: null })

export function ItemProvider({ id, children }: { id: string; children: React.ReactNode }) {
	return <ItemContext.Provider value={{ itemId: id }}>{children}</ItemContext.Provider>
}

export function useItem() {
	const context = useContext(ItemContext)
	if (!context) {
		throw new Error('useItem must be used within an ItemProvider')
	}
	return context
}
