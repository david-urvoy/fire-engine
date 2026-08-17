import { Billboard, Float, Text } from '@react-three/drei'
import { Suspense, type PropsWithChildren } from 'react'

export function Bark({ children, visible }: PropsWithChildren<{ visible?: boolean }>) {
	return (
		<Suspense fallback={null}>
			<Billboard visible={visible}>
				<Float speed={10} rotationIntensity={1} floatIntensity={0.5}>
					<Text position-y={0.3} fontSize={0.1} color="white" anchorX="center" anchorY="middle">
						{children}
					</Text>
				</Float>
			</Billboard>
		</Suspense>
	)
}
