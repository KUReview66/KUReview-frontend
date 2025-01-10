import { useState } from 'react';
import '../styles/ContentPanel.module.css';
import styles from '../styles/ContentPanel.module.css'

export default function ContentPanel() {
    // State to manage which lesson is expanded
    const [expandedLesson, setExpandedLesson] = useState(null);

    const handleToggle = (lesson) => {
        setExpandedLesson(expandedLesson === lesson ? null : lesson);
    };

    return (
        <div style={{ borderLeft: '1px solid #B8B8B8', padding: '5px 2rem', marginRight: '2rem' }}>
            <h3>Lessons Overview</h3>
            <table>
                <tbody>
                    <tr>
                        <td className={styles['lesson-name']}>Loop</td>
                        <td onClick={() => handleToggle('Loop')} className={styles['dropdown']}>
                            <i className={`bi bi-chevron-${expandedLesson === 'Loop' ? 'up' : 'down'}`}></i>
                        </td>
                    </tr>
                    {expandedLesson === 'Loop' && (
                        <tr>
                            <td colSpan="2">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt felis at efficitur condimentum.</p>
                                <video controls>
                                    <source src="path-to-loop-video.mp4" type="video/mp4" />
                                </video>
                            </td>
                        </tr>
                    )}
                    
                    <tr>
                        <td className={styles['lesson-name']}>Condition</td>
                        <td onClick={() => handleToggle('Condition')} className={styles['dropdown']}>
                            <i className={`bi bi-chevron-${expandedLesson === 'Condition' ? 'up' : 'down'}`}></i>
                        </td>
                    </tr>
                    {expandedLesson === 'Condition' && (
                        <tr>
                            <td colSpan="2">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt felis at efficitur condimentum.</p>
                                <video controls>
                                    <source src="path-to-condition-video.mp4" type="video/mp4" />
                                </video>
                            </td>
                        </tr>
                    )}

                    <tr>
                        <td className={styles['lesson-name']}>List</td>
                        <td onClick={() => handleToggle('List')} className={styles['dropdown']}>
                            <i className={`bi bi-chevron-${expandedLesson === 'List' ? 'up' : 'down'}`}></i>
                        </td>
                    </tr>
                    {expandedLesson === 'List' && (
                        <tr>
                            <td colSpan="2">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt felis at efficitur condimentum.</p>
                                <video controls>
                                    <source src="path-to-list-video.mp4" type="video/mp4" />
                                </video>
                            </td>
                        </tr>
                    )}

                    <tr>
                        <td className={styles['lesson-name']}>Function</td>
                        <td onClick={() => handleToggle('Function')} className={styles['dropdown']}>
                            <i className={`bi bi-chevron-${expandedLesson === 'Function' ? 'up' : 'down'}`}></i>
                        </td>
                    </tr>
                    {expandedLesson === 'Function' && (
                        <tr>
                            <td colSpan="2">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt felis at efficitur condimentum.</p>
                                <video controls>
                                    <source src="path-to-function-video.mp4" type="video/mp4" />
                                </video>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
