import { createContext, type RefObject } from 'react'

export const AppContext = createContext<{ canvasRef: RefObject<HTMLCanvasElement | null> }>({
	canvasRef: { current: null },
})
