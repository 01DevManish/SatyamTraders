import Image from 'next/image';
import styles from './page.module.css';

export const metadata = {
    title: 'About Us - Satyam Traders',
    description: 'Learn about Satyam Traders, our mission, values, and commitment to bringing premium home decor to every Indian home.',
};

export default function AboutPage() {
    return (
        <>
            <section className={styles.aboutHero}>
                <div className="container">
                    <h1>About Satyam Traders</h1>
                    <p>Transforming homes with premium, elegantly crafted decor pieces since 2015</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className={styles.aboutContent}>
                        <div className={styles.aboutImage}>
                            <Image src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600" alt="Beautiful home interior" width={500} height={400} style={{ objectFit: 'cover', borderRadius: '12px' }} />
                        </div>
                        <div className={styles.aboutText}>
                            <h2>Our Story</h2>
                            <p>Satyam Traders was born from a simple passion: to help people create beautiful, inspiring living spaces without breaking the bank. What started as a small family business has grown into a trusted name in premium home decor across India.</p>
                            <p>We believe that every home deserves beautiful decor that reflects the personality and taste of its inhabitants. That's why we carefully curate each piece in our collection, ensuring it meets our high standards for quality, design, and value.</p>
                            <p>From handcrafted wall art to elegant lighting fixtures, from artisan planters to statement showpieces – every item we sell is chosen with love and care.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Values</h2>
                        <p>The principles that guide everything we do</p>
                    </div>
                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>💎</div>
                            <h4>Quality First</h4>
                            <p>We never compromise on quality. Every product undergoes rigorous quality checks before reaching you.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>🎨</div>
                            <h4>Design Excellence</h4>
                            <p>We work with talented designers to bring you pieces that are both beautiful and functional.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>🤝</div>
                            <h4>Customer First</h4>
                            <p>Your satisfaction is our priority. We're here to help you every step of the way.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>🌱</div>
                            <h4>Sustainability</h4>
                            <p>We're committed to eco-friendly practices and sustainable sourcing wherever possible.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className={styles.mission}>
                        <h2>Our Mission</h2>
                        <p>To make premium home decor accessible to every Indian household. We believe that beautiful spaces inspire beautiful lives, and everyone deserves to come home to a place that brings them joy.</p>
                    </div>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Trust Us?</h2>
                    </div>
                    <div className={styles.trustGrid}>
                        <div className={styles.trustItem}><span className={styles.trustNumber}>10K+</span><span>Happy Customers</span></div>
                        <div className={styles.trustItem}><span className={styles.trustNumber}>500+</span><span>Products</span></div>
                        <div className={styles.trustItem}><span className={styles.trustNumber}>50+</span><span>Cities Served</span></div>
                        <div className={styles.trustItem}><span className={styles.trustNumber}>4.8★</span><span>Average Rating</span></div>
                    </div>
                </div>
            </section>
        </>
    );
}
