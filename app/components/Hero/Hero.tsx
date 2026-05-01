export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-img-container">
        <img 
          src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1600&q=80" 
          alt="Premium Bedding Collection — Satyam Trders" 
          className="hero-bg-img"
        />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-container container">
        <div className="hero-content">
          <div className="hero-badge">Luxury Lifestyle</div>
          <h1 className="hero-title">
            Buy Single, Double &amp; Premium<br />Cotton Bed Sheets Online
          </h1>
          <p className="hero-subtitle">
            Up to 70% off — Handcrafted bedding &amp; decor,
            delivered direct from Satyam Trders.
          </p>
          <div className="hero-actions">
            <button className="btn-hero-primary">
              Shop Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="btn-hero-ghost">Our Collections</button>
          </div>
        </div>
      </div>
    </section>
  );
}
