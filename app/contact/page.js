'use client';
import { useState } from 'react';
import styles from './page.module.css';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <h1>Contact Us</h1>
                    <p>We'd love to hear from you. Get in touch with us!</p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div className={styles.contactLayout}>
                        <div className={styles.contactForm}>
                            <h3>Send us a Message</h3>
                            {submitted ? (
                                <div className={styles.successMessage}>
                                    <div className={styles.successIcon}>✓</div>
                                    <h4>Thank you for reaching out!</h4>
                                    <p>We've received your message and will get back to you within 24 hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-group"><label>Name *</label><input type="text" required /></div>
                                        <div className="form-group"><label>Email *</label><input type="email" required /></div>
                                    </div>
                                    <div className="form-group"><label>Phone</label><input type="tel" /></div>
                                    <div className="form-group"><label>Subject *</label><input type="text" required /></div>
                                    <div className="form-group">
                                        <label>Message *</label>
                                        <textarea rows="5" required placeholder="How can we help you?"></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-lg">Send Message</button>
                                </form>
                            )}
                        </div>

                        <div className={styles.contactInfo}>
                            <h3>Get in Touch</h3>
                            <div className={styles.contactItem}>
                                <div className={styles.contactIcon}>📍</div>
                                <div>
                                    <h5>Visit Us</h5>
                                    <p>Satyam Traders, Chandni Chowk<br />Delhi, 110006</p>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.contactIcon}>📞</div>
                                <div>
                                    <h5>Call Us</h5>
                                    <p>+91 85959 99696</p>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.contactIcon}>✉️</div>
                                <div>
                                    <h5>Email Us</h5>
                                    <p>hello@satyamtraders.com<br />support@satyamtraders.com</p>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.contactIcon}>🕐</div>
                                <div>
                                    <h5>Working Hours</h5>
                                    <p>Monday - Saturday: 10AM - 7PM<br />Sunday: Closed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
