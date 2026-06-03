import Header from '../components/home/Header'
import Scan from '../components/scan/Scan'
import styles from './Home.module.css'

export default function Home() {
	return (
		<div className={styles.container}>
			<Header />
			<Scan />
		</div>
	)
}
