import { useFrame } from '@react-three/fiber'
import { useVisibilityChange } from '@uidotdev/usehooks'
import { useEffect } from 'react'
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
	const visibility = useVisibilityChange()

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
