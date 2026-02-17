import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useSnapshot } from 'valtio'
import { game } from '../game'

export function Menu() {
	const { uiMode } = useSnapshot(game)
	const isPaused = uiMode === 'pause'

	return (
		<div
			className={clsx(
				'fixed inset-0 z-100',
				'h-screen max-h-none w-screen max-w-none',
				'm-0 border-none bg-transparent p-0',
				'flex items-center justify-center',
				'transition-opacity duration-200',
				'pointer-events-none',
				!isPaused && 'opacity-0',
			)}
		>
			<div
				className={clsx(
					'h-1/2 w-2/5 min-w-fit',
					'rounded-2xl',
					'border border-cyan-400/30',
					'bg-linear-to-br from-slate-800/90 to-slate-900/90',
					'backdrop-blur-md',
					'shadow-[0_0_40px_rgba(56,189,248,0.15)]',
					'flex flex-col',
					'px-10 py-8',
					isPaused ? 'pointer-events-auto' : 'pointer-events-none',
				)}
			>
				<span
					className={clsx(
						'mb-10 pb-4',
						'text-center',
						'font-bebas tracking-[0.3em]',
						'text-4xl',
						'text-cyan-300',
						'uppercase',
						'relative',
						'after:content-[""]',
						'after:absolute after:-bottom-1 after:left-1/2',
						'after:-translate-x-1/2',
						'after:h-px after:w-24',
						'after:bg-linear-to-r after:from-transparent after:via-cyan-400 after:to-transparent',
					)}
				>
					Menu
				</span>

				<ul className="flex flex-1 flex-col items-center gap-6 overflow-scroll">
					<li>
						<ResumeButton isPaused={isPaused} />
					</li>
					<li>
						<MenuButton label="Save" />
					</li>
					<li>
						<MenuButton label="Load" />
					</li>
					<li>
						<MenuButton label="Settings" />
					</li>
					<li className="mt-auto">
						<MenuButton label="Quit" variant="red" />
					</li>
				</ul>
			</div>
		</div>
	)
}

function MenuButton({
	label,
	disabled,
	className,
	onClick,
	variant = 'cyan',
}: {
	label: string
	disabled?: boolean
	className?: string
	onClick?: () => void
	variant?: 'cyan' | 'green' | 'red'
}) {
	const colors = {
		cyan: {
			bg: 'bg-cyan-500/10',
			border: 'border border-cyan-400/30',
			text: 'text-cyan-100',
			hoverBg: 'hover:bg-cyan-400/20',
			hoverBorder: 'hover:border-cyan-300',
			hoverShadow: 'hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]',
			focus: 'focus-visible:ring-cyan-400',
		},
		green: {
			bg: 'bg-green-500/10',
			border: 'border border-green-400/30',
			text: 'text-green-100',
			hoverBg: 'hover:bg-green-400/20',
			hoverBorder: 'hover:border-green-300',
			hoverShadow: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]',
			focus: 'focus-visible:ring-green-400',
		},
		red: {
			bg: 'bg-red-500/10',
			border: 'border border-red-400/30',
			text: 'text-red-100',
			hoverBg: 'hover:bg-red-400/20',
			hoverBorder: 'hover:border-red-300',
			hoverShadow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]',
			focus: 'focus-visible:ring-red-400',
		},
	}

	const c = colors[variant]

	return (
		<button
			id={label.toLowerCase()}
			disabled={disabled}
			onClick={onClick}
			className={twMerge(
				className,
				'px-10 py-3 rounded-lg font-bebas text-xl tracking-wider uppercase transition-all duration-300 backdrop-blur-sm',
				c.bg,
				c.border,
				c.text,
				c.hoverBg,
				c.hoverBorder,
				c.hoverShadow,
				'focus:outline-none',
				c.focus,
				'disabled:opacity-40 disabled:cursor-not-allowed',
			)}
		>
			{label}
		</button>
	)
}

function ResumeButton({ isPaused }: { isPaused: boolean }) {
	const [isResumeReady, setIsResumeReady] = useState(false)

	useEffect(() => {
		if (!isPaused) return

		setIsResumeReady(false)

		const timeout = setTimeout(() => {
			setIsResumeReady(true)
		}, 1000)

		return () => clearTimeout(timeout)
	}, [isPaused])

	return (
		<MenuButton disabled={!isResumeReady} label="Resume" onClick={game.resume} variant="green" />
	)
}
