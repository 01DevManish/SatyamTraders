"use client";

interface CategoryBarProps {
  categories: { id: number, name: string, image: string }[];
}

export default function CategoryBar({ categories }: CategoryBarProps) {
  return (
    <div className="category-bar">
      <div className="container">
        <div className="category-scroller">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div key={cat.id} className="category-pill">
                <div className="category-icon">
                  <img src={cat.image} alt={cat.name} />
                </div>
                <span className="category-label">{cat.name}</span>
              </div>
            ))
          ) : (
            // Empty state
            <div className="text-muted text-xs">Explore our premium range</div>
          )}
        </div>
      </div>

    </div>
  );
}
