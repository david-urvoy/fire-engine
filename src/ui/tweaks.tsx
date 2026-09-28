import { Leva, useControls } from 'leva'
import type { LevaRootProps } from 'leva/dist/declarations/src/components/Leva/LevaRoot'
import { useSnapshot } from 'valtio'

import { game } from '../game'

export function Tweaks(props: LevaRootProps) {
	const {
		debug: { enabled: isDebugEnabled },
		tweaks: { expanded: isTweaksExpanded },
	} = useSnapshot(game)

	useControls({
		keepOpen: {
			value: false,
			onChange: (value) => {
				game.tweaks.keepOpen = value
			},
		},
	})

	return (
		<Leva
			hidden={!isDebugEnabled}
			collapsed={{
				collapsed: !isTweaksExpanded,
				onChange: (expanded) => {
					game.tweaks.expanded = !expanded
				},
			}}
			theme={{
				colors: {
					elevation1: '#292d39',
					elevation2: '#181C20',
					elevation3: '#373C4B',
					accent1: '#0066DC',
					accent2: '#007BFF',
					accent3: '#3C93FF',
					highlight1: '#535760',
					highlight2: '#8C92A4',
					highlight3: '#FEFEFE',
					vivid1: '#ffcc00',
				},
				radii: {
					xs: '2px',
					sm: '0px',
					lg: '8px',
				},
				space: {
					sm: '2px',
					md: '8px',
					rowGap: '2px',
					colGap: '4px',
				},
				fontSizes: {
					root: '11px',
				},
				sizes: {
					rootWidth: '400px',
					controlWidth: '160px',
					scrubberWidth: '4px',
					scrubberHeight: '16px',
					rowHeight: '24px',
					checkboxSize: '16px',
					joystickWidth: '100px',
					joystickHeight: '100px',
					colorPickerWidth: '160px',
					colorPickerHeight: '100px',
					monitorHeight: '60px',
					titleBarHeight: '24px',
				},
				borderWidths: {
					root: '0px',
					input: '1px',
					focus: '1px',
					hover: '1px',
					active: '1px',
					folder: '2px',
				},
				fontWeights: {
					label: 'normal',
					folder: 'bold',
					button: 'normal',
				},
			}}
			{...props}
		/>
	)
}
