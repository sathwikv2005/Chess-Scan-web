import {
	TbChessFilled as Pawn,
	TbChessBishopFilled as Bishop,
	TbChessKingFilled as King,
	TbChessKnightFilled as Knight,
	TbChessQueenFilled as Queen,
	TbChessRookFilled as Rook,
} from 'react-icons/tb'

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './Board.module.css'

const PIECES = {
	P: { Icon: Pawn, color: 'white' },
	R: { Icon: Rook, color: 'white' },
	N: { Icon: Knight, color: 'white' },
	B: { Icon: Bishop, color: 'white' },
	Q: { Icon: Queen, color: 'white' },
	K: { Icon: King, color: 'white' },

	p: { Icon: Pawn, color: 'black' },
	r: { Icon: Rook, color: 'black' },
	n: { Icon: Knight, color: 'black' },
	b: { Icon: Bishop, color: 'black' },
	q: { Icon: Queen, color: 'black' },
	k: { Icon: King, color: 'black' },
}

function fenToBoard(fen) {
	const placement = fen.split(' ')[0]

	const board = []

	for (const rank of placement.split('/')) {
		const row = []

		for (const char of rank) {
			if (/\d/.test(char)) {
				for (let i = 0; i < Number(char); i++) {
					row.push(null)
				}
			} else {
				row.push(char)
			}
		}

		board.push(row)
	}

	return board
}

function boardToFen(board, oldFen) {
	const parts = oldFen.split(' ')

	const placement = board
		.map((row) => {
			let str = ''
			let empty = 0

			for (const square of row) {
				if (!square) {
					empty++
				} else {
					if (empty) {
						str += empty
						empty = 0
					}

					str += square
				}
			}

			if (empty) str += empty

			return str
		})
		.join('/')

	parts[0] = placement

	return parts.join(' ')
}

export default function Board({ fen, setFen }) {
	const [board, setBoard] = useState(() => fenToBoard(fen))
	const [selectedSquare, setSelectedSquare] = useState(null)
	const [dragged, setDragged] = useState(null)

	const boardRef = useRef(null)

	useEffect(() => {
		setBoard(fenToBoard(fen))
	}, [fen])

	useEffect(() => {
		setFen?.(boardToFen(board, fen))
	}, [board])

	useEffect(() => {
		function handleClickOutside(event) {
			if (boardRef.current && !boardRef.current.contains(event.target)) {
				setSelectedSquare(null)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const pieceOptions = useMemo(
		() => ['K', 'Q', 'R', 'B', 'N', 'P', 'k', 'q', 'r', 'b', 'n', 'p'],
		[],
	)

	function updateSquare(row, col, piece) {
		setBoard((prev) => {
			const next = prev.map((r) => [...r])
			next[row][col] = piece
			return next
		})
	}

	function handleDrop(row, col) {
		if (!dragged) return

		setBoard((prev) => {
			const next = prev.map((r) => [...r])

			next[row][col] = next[dragged.row][dragged.col]
			next[dragged.row][dragged.col] = null

			return next
		})

		setDragged(null)
	}

	return (
		<div className={styles.wrapper}>
			<div ref={boardRef} className={styles.board}>
				{board.map((row, rowIndex) =>
					row.map((piece, colIndex) => {
						const dark = (rowIndex + colIndex) % 2

						return (
							<div
								key={`${rowIndex}-${colIndex}`}
								className={`${styles.square} ${dark ? styles.dark : styles.light}`}
								onDragOver={(e) => e.preventDefault()}
								onDrop={() => handleDrop(rowIndex, colIndex)}
								onClick={() =>
									setSelectedSquare({
										row: rowIndex,
										col: colIndex,
									})
								}
							>
								{piece && (
									<Piece
										piece={piece}
										onDragStart={() =>
											setDragged({
												row: rowIndex,
												col: colIndex,
											})
										}
									/>
								)}

								{selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex && (
									<div className={styles.picker} onClick={(e) => e.stopPropagation()}>
										<div className={styles.pieceGrid}>
											{pieceOptions.map((option) => {
												const { Icon, color } = PIECES[option]

												return (
													<button
														key={option}
														className={styles.pickButton}
														onClick={() => {
															updateSquare(rowIndex, colIndex, option)
															setSelectedSquare(null)
														}}
													>
														<Icon className={color === 'white' ? styles.white : styles.black} />
													</button>
												)
											})}
										</div>

										{piece && (
											<button
												className={styles.deleteButton}
												onClick={() => {
													updateSquare(rowIndex, colIndex, null)
													setSelectedSquare(null)
												}}
											>
												Delete
											</button>
										)}
									</div>
								)}
							</div>
						)
					}),
				)}
			</div>
		</div>
	)
}

function Piece({ piece, onDragStart }) {
	const { Icon, color } = PIECES[piece]

	return (
		<div draggable onDragStart={onDragStart} className={styles.piece}>
			<Icon className={color === 'white' ? styles.white : styles.black} />
		</div>
	)
}
