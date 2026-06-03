import { useEffect, useState } from 'react'
import Board from '../board/Board'
import Input from './Input'
import styles from './Scan.module.css'

export default function Scan() {
	const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
	useEffect(() => {
		console.log(fen)
	}, [fen])
	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div className={`${styles.box}`}>
					<Input />
				</div>
				<div className={styles.box}>{<Board fen={fen} setFen={setFen} />}</div>
			</div>
		</div>
	)
}
