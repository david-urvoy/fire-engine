import { useCallback, useState } from 'react'

export function useFlag(initialValue = false) {
	const [value, setValue] = useState(initialValue)
	const setTrue = useCallback(() => setValue(true), [])
	const setFalse = useCallback(() => setValue(false), [])
	return [value, setTrue, setFalse] as const
}
