import { useFrame } from '@react-three/fiber'
import { useEffect } from 'react'
import { useWindowFocus } from '../hooks/useWindowFocus'
import { time, timer } from './time-store'

export function useGameTime() {
	// const controls = useMoveControl()

	// useEffect(() => {
	// 	const unsubscribeTime = time.start()
	// 	const unsubscribeKeys = subscribeKeys(
	// 		({ save }) => ({ save }),
	// 		({ save: saveKey }) => {
	// 			const { alt } = getKeys()
	// 			if (alt && saveKey) {
	// 				time.save()
	// 				console.log('saved !')
	// 			}
	// 		},
	// 	)
	// 	return () => {
	// 		unsubscribeTime()
	// 		unsubscribeKeys()
	// 	}
	// }, [subscribeKeys, getKeys])
	const visibility = useWindowFocus()

	console.log('visibility', visibility)

	useEffect(() => {
		time.start()
	}, [])
	useEffect(() => {
		if (!visibility) {
			timer.update()
			time.freeze()
		} else {
			timer.reset()
			time.resume()
		}
	}, [visibility])

	useFrame(() => timer.update())
}
