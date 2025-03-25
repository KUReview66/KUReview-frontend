import styles from '../styles/Popup.module.css';
import React from 'react';

export default function Popup(props) {

    return (props.trigger) ? (
        <>
            <divc className={styles['popup']}>
                <div className={styles['popup-inner']}>
                    <button className={styles['close-btn']} onClick={() => props.setTrigger(false)}>X</button>
                    {props.children}
                </div>
            </divc>
        </>
    ) : "";
}