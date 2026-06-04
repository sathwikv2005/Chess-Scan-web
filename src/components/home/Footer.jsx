import { FaGithub, FaNpm } from 'react-icons/fa'
import styles from './Footer.module.css'

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.content}>
				<div className={styles.brand}>
					<h3>Chess Scan</h3>
					<p>Extract chess positions from images with high accuracy.</p>
				</div>

				<div className={styles.links}>
					<a
						href="https://github.com/sathwikv2005/Chess-Scan-web"
						target="_blank"
						rel="noopener noreferrer"
						className={styles.link}
					>
						<FaGithub />
						<span>GitHub</span>
					</a>

					<a
						href="https://www.npmjs.com/package/chess-scan"
						target="_blank"
						rel="noopener noreferrer"
						className={styles.link}
					>
						<FaNpm />
						<span>NPM Package</span>
					</a>
				</div>
			</div>

			<div className={styles.bottom}>© {new Date().getFullYear()} Chess Scan</div>
		</footer>
	)
}
