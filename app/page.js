'use client';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { products, collections, testimonials } from '@/data/products';
import styles from './page.module.css';

export default function Home() {
  const bestSellers = products.filter(p => p.badge === 'Bestseller' || p.badge === 'New').slice(0, 4);
  const featuredProducts = products.slice(0, 8);

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>✨ Premium Home Decor</span>
            <h1>Satyam Traders – Elevate Your Home Style</h1>
            <p>Premium home decor pieces to transform your living space. Discover elegant, modern designs crafted with exceptional quality.</p>
            <div className={styles.heroButtons}>
              <Link href="/shop" className="btn btn-primary btn-lg">Shop Home Decor</Link>
              <Link href="/shop" className="btn btn-secondary btn-lg">Explore Collection</Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <Image src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800" alt="Premium Home Decor" width={600} height={500} priority style={{ objectFit: 'cover', borderRadius: '20px' }} />
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className={`section ${styles.collections}`}>
        <div className="container">
          <div className="section-header">
            <h2>Shop by Collection</h2>
            <p>Explore our curated collections of beautiful home decor pieces</p>
          </div>
          <div className={styles.collectionsGrid}>
            {collections.map((collection) => (
              <Link href={`/shop?category=${encodeURIComponent(collection.name)}`} key={collection.name} className={styles.collectionCard}>
                <Image src={collection.image} alt={collection.name} fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: 'cover' }} />
                <div className={styles.collectionOverlay}>
                  <h3>{collection.name}</h3>
                  <span>{collection.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Best Selling Products</h2>
            <p>Our most loved pieces by customers across India</p>
          </div>
          <div className={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className={styles.viewAll}>
            <Link href="/shop" className="btn btn-secondary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Satyam Traders?</h2>
            <p>We're committed to bringing quality and elegance to every home</p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💎</div>
              <h4>Premium Quality Materials</h4>
              <p>Every piece is crafted with the finest materials for lasting beauty and durability.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>✨</div>
              <h4>Elegant & Modern Designs</h4>
              <p>Contemporary aesthetics that blend seamlessly with any interior style.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💰</div>
              <h4>Affordable Pricing</h4>
              <p>Luxury decor at prices that won't break the bank. Quality for everyone.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🚚</div>
              <h4>Pan-India Delivery</h4>
              <p>Safe and secure delivery to every corner of India with careful packaging.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Join thousands of happy customers who've transformed their homes</p>
          </div>
          <div className={styles.testimonialsSlider}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>{'⭐'.repeat(testimonial.rating)}</div>
                <p className={styles.testimonialText}>"{testimonial.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{testimonial.name.charAt(0)}</div>
                  <div>
                    <h5>{testimonial.name}</h5>
                    <span>{testimonial.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={styles.newsletter}>
        <div className="container">
          <div className={styles.newsletterContent}>
            <h2>Join Our Community</h2>
            <p>Subscribe for exclusive offers, new arrivals, and home styling tips delivered to your inbox.</p>
            <form className={styles.newsletterForm} onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }}>
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit" className="btn btn-gold">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
