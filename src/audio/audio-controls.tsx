import { useControls } from 'leva'

import { audioStore } from './audio.store'

export function AudioControls() {
	// const icons = ['🔇', '🔈', '🔊']
	// function getVolumeIcon(volume: number) {
	// 	return volume >= 30
	// 		? '█'
	// 		: volume >= 25
	// 			? '▇'
	// 			: volume >= 20
	// 				? '▆'
	// 				: volume >= 15
	// 					? '▅'
	// 					: volume >= 10
	// 						? '▄'
	// 						: volume >= 5
	// 							? '▃'
	// 							: '▂'
	// }

	useControls(
		`🔈 Audio`,
		{
			voices: {
				value: audioStore.voices.volume,
				min: 0,
				max: 50,
				step: 1,
				onChange: (volume) => {
					audioStore.voices.volume = volume
				},
			},
			music: {
				value: audioStore.music.volume,
				min: 0,
				max: 1,
				step: 0.1,
				onChange: (volume) => {
					audioStore.music.volume = volume
				},
			},
			soundEffects: {
				value: audioStore.soundEffects.volume,
				min: 0,
				max: 50,
				step: 1,
				onChange: (volume) => {
					audioStore.soundEffects.volume = volume
				},
			},
			mute: {
				value: audioStore.isMuted,
				onChange: (isMuted) => {
					audioStore.isMuted = isMuted
				},
			},
		},
		{ collapsed: true },
	)

	return <></>
}
