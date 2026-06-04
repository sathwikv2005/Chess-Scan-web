import { FaCopy, FaCheck } from 'react-icons/fa6'
import styles from './Util.module.css'
import { useState } from 'react'

export default function Util({ fen, setFen }) {
	const [copied, setCopied] = useState(false)

	const [showAdvanced, setShowAdvanced] = useState(false)

	const { board, turn, castling, ep, halfmove, fullmove } = parseFen(fen)

	const rights = {
		K: castling.includes('K'),
		Q: castling.includes('Q'),
		k: castling.includes('k'),
		q: castling.includes('q'),
	}

	function updateTurn(fen, turn, setFen) {
		const { board, castling, ep, halfmove, fullmove } = parseFen(fen)

		setFen(`${board} ${turn} ${castling} ${ep} ${halfmove} ${fullmove}`)
	}

	function updateCastling(fen, right, enabled, setFen) {
		const { board, turn, castling, ep, halfmove, fullmove } = parseFen(fen)

		let rights = castling === '-' ? [] : castling.split('')

		if (enabled) {
			if (!rights.includes(right)) rights.push(right)
		} else {
			rights = rights.filter((r) => r !== right)
		}

		const order = ['K', 'Q', 'k', 'q']

		rights.sort((a, b) => order.indexOf(a) - order.indexOf(b))

		const result = rights.length ? rights.join('') : '-'

		setFen(`${board} ${turn} ${result} ${ep} ${halfmove} ${fullmove}`)
	}

	async function handleCopy() {
		try {
			if (navigator.clipboard) {
				await navigator.clipboard.writeText(fen)
			} else {
				const textarea = document.createElement('textarea')
				textarea.value = fen
				document.body.appendChild(textarea)
				textarea.select()
				document.execCommand('copy')
				document.body.removeChild(textarea)
			}

			setCopied(true)

			setTimeout(() => {
				setCopied(false)
			}, 1500)
		} catch (err) {
			console.error(err)
		}
	}

	const encodedFen = encodeURIComponent(fen)

	const chessComUrl = `https://www.chess.com/analysis?fen=${encodedFen}`
	const lichessUrl = `https://lichess.org/analysis/${fen}`

	return (
		<div className={styles.container}>
			<div className={styles.inputwrapper}>
				<input
					className={styles.input}
					type="text"
					value={fen}
					onChange={(e) => setFen(e.target.value)}
				/>

				<button
					className={`${styles.copy} ${copied ? styles.copied : ''}`}
					onClick={handleCopy}
					title={copied ? 'Copied!' : 'Copy FEN'}
				>
					{copied ? <FaCheck /> : <FaCopy />}
				</button>
			</div>

			<div className={styles.btnwrapper}>
				<button onClick={() => resetBoard(setFen)}>Reset</button>
				<button onClick={() => clearBoard(setFen)}>Clear</button>
				<button onClick={() => swapColors(fen, setFen)}>Swap Colors</button>
				<button onClick={() => flipBoard(fen, setFen)}>Flip Board</button>
			</div>
			<div className={styles.advanced}>
				<button className={styles.advancedToggle} onClick={() => setShowAdvanced(!showAdvanced)}>
					{showAdvanced ? '▼' : '▶'} Advanced Options
				</button>

				{showAdvanced && (
					<div className={styles.advancedPanel}>
						<div className={styles.section}>
							<label>Side to Move</label>

							<div className={styles.segmented}>
								<button
									className={turn === 'w' ? styles.active : ''}
									onClick={() => updateTurn(fen, 'w', setFen)}
								>
									White
								</button>

								<button
									className={turn === 'b' ? styles.active : ''}
									onClick={() => updateTurn(fen, 'b', setFen)}
								>
									Black
								</button>
							</div>
						</div>

						<div className={styles.section}>
							<label>Castling Rights</label>

							<div className={styles.castlingGrid}>
								<label>
									<input
										type="checkbox"
										checked={rights.K}
										onChange={(e) => updateCastling(fen, 'K', e.target.checked, setFen)}
									/>
									White O-O
								</label>

								<label>
									<input
										type="checkbox"
										checked={rights.Q}
										onChange={(e) => updateCastling(fen, 'Q', e.target.checked, setFen)}
									/>
									White O-O-O
								</label>

								<label>
									<input
										type="checkbox"
										checked={rights.k}
										onChange={(e) => updateCastling(fen, 'k', e.target.checked, setFen)}
									/>
									Black O-O
								</label>

								<label>
									<input
										type="checkbox"
										checked={rights.q}
										onChange={(e) => updateCastling(fen, 'q', e.target.checked, setFen)}
									/>
									Black O-O-O
								</label>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className={styles.linkwrapper}>
				<a href={chessComUrl} target="_blank" rel="noopener noreferrer">
					Open in Chess.com
				</a>

				<a href={lichessUrl} target="_blank" rel="noopener noreferrer">
					Open in Lichess
				</a>
			</div>
		</div>
	)
}

const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

const EMPTY_FEN = '8/8/8/8/8/8/8/8 w - - 0 1'

function parseFen(fen) {
	const parts = fen.trim().split(/\s+/)

	return {
		board: parts[0] || '8/8/8/8/8/8/8/8',
		turn: parts[1] || 'w',
		castling: parts[2] || '-',
		ep: parts[3] || '-',
		halfmove: parts[4] || '0',
		fullmove: parts[5] || '1',
	}
}

function resetBoard(setFen) {
	setFen(DEFAULT_FEN)
}

function clearBoard(setFen) {
	setFen(EMPTY_FEN)
}

function swapColors(fen, setFen) {
	const [board, turn, castling, ep, halfmove, fullmove] = fen.split(' ')

	const swappedBoard = [...board]
		.map((c) => {
			if (/[a-z]/.test(c)) return c.toUpperCase()
			if (/[A-Z]/.test(c)) return c.toLowerCase()
			return c
		})
		.join('')

	const swappedTurn = turn

	const swappedCastling =
		castling === '-'
			? '-'
			: [...castling]
					.map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
					.sort((a, b) => {
						const order = 'KQkq'
						return order.indexOf(a) - order.indexOf(b)
					})
					.join('')

	setFen(`${swappedBoard} ${swappedTurn} ${swappedCastling} ${ep} ${halfmove} ${fullmove}`)
}

function flipBoard(fen, setFen) {
	const [board, turn, castling, ep, halfmove, fullmove] = fen.split(' ')

	const ranks = board.split('/')

	const expanded = ranks.map((rank) => {
		const squares = []

		for (const char of rank) {
			if (/\d/.test(char)) {
				squares.push(...Array(Number(char)).fill(''))
			} else {
				squares.push(char)
			}
		}

		return squares
	})

	const flippedBoard = expanded
		.reverse()
		.map((rank) => rank.reverse())
		.map((rank) => {
			let result = ''
			let empty = 0

			for (const square of rank) {
				if (!square) {
					empty++
				} else {
					if (empty) {
						result += empty
						empty = 0
					}
					result += square
				}
			}

			if (empty) result += empty

			return result
		})
		.join('/')

	let flippedEp = '-'

	if (ep !== '-') {
		const file = ep[0]
		const rank = Number(ep[1])

		flippedEp = `${String.fromCharCode(
			'h'.charCodeAt(0) - (file.charCodeAt(0) - 'a'.charCodeAt(0)),
		)}${9 - rank}`
	}

	setFen(`${flippedBoard} ${turn} ${castling} ${flippedEp} ${halfmove} ${fullmove}`)
}
