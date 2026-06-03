import Input from './Input'
import styles from './Scan.module.css'

export default function Scan() {
	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div className={`${styles.box}`}>
					<Input />
				</div>
				<div className={styles.box}></div>
			</div>
		</div>
	)
}
