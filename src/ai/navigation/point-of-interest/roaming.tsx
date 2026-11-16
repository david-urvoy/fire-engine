import { useEffect, useState } from 'react'
import { MathUtils } from 'yuka'

import { PointOfInterestNavigation } from './navigation'

export function PointOfInterestRoam({
	group,
	interval = 60_000,
}: {
	group: string
	interval?: number
}) {
	const [shouldRoam, setShouldRoam] = useState(false)
	const [nextPointOfInterest, setNextPointOfInterest] = useState('bar')

	useEffect(() => {
		const intervalId = setInterval(() => {
			setNextPointOfInterest((prev) => {
				const options = ['bar', 'counter', 'sink', 'table', 'fridge'].filter(
					(option) => option !== prev,
				)
				const next = options[MathUtils.randInt(0, options.length - 1)]
				console.log(next)
				if (!next) return prev
				return next
			})
			setShouldRoam(true)
		}, interval)

		return () => clearInterval(intervalId)
	}, [interval])

	return shouldRoam ? (
		<PointOfInterestNavigation group={group} pointOfInterest={nextPointOfInterest} />
	) : null
}
