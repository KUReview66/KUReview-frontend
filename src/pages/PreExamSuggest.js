import Navbar from "../components/navBar";
import styles from '../styles/PreExamSuggest.module.css';

export default function PreExamSuggest() {
    return(
        <>
        <div style={{display: 'flex'}}>
                <Navbar />
                <div className={styles['content-panel-pre-exam']}>
                    <div className={styles['header']}>
                        <h2 style={{textAlign: 'left'}}>Start Strong</h2>
                        <p style={{textAlign: 'left'}}>Key Topics You Should Focus On</p>
                        <a className={styles['btn-pre-suggest']} href="/suggest">
                            Get Started &#8594;
                        </a>
                    </div>
                    <img 
                        src="https://png.pngtree.com/png-vector/20231214/ourmid/pngtree-3d-student-holding-book-character-cartoon-three-dimensional-cute-occupation-png-image_11335854.png"
                        alt="study"
                    />
                </div>
            </div>
        </>
    )
}