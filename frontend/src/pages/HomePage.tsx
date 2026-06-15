import { useCallback, useEffect, useState } from "react";
import { propertyApi } from "../api/property.api";
import { Property, PropertyFilters } from "../types/property";
import Navbar from "../components/Navbar";
import FilterSidebar from "../components/FilterSidebar";
import PropertyCard from "../components/PropertyCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import "./HomePage.css";

const EMPTY_FILTERS: PropertyFilters = {
  city: "",
  minPrice: "",
  maxPrice: "",
  purpose: "",
  propertyType: "",
};

function HomePage() {
  const [filters, setFilters] = useState<PropertyFilters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<PropertyFilters>(EMPTY_FILTERS);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProperties = useCallback((signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    propertyApi
      .list(appliedFilters, signal)
      .then(setProperties)
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err instanceof Error ? err.message : "Could not load properties");
        }
      })
      .finally(() => setLoading(false));
  }, [appliedFilters]);

  // Run the fetch on mount and whenever applied filters change; abort the
  // in-flight request on unmount to avoid setting state on a gone component.
  useEffect(() => {
    const controller = new AbortController();
    loadProperties(controller.signal);
    return () => controller.abort();
  }, [loadProperties]);

  function handleReset(): void {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
  }

  function renderResults() {
    if (loading) {
      return <Loader label="Loading properties..." />;
    }
    if (error) {
      return <ErrorState message={error} onRetry={() => loadProperties()} />;
    }
    if (properties.length === 0) {
      return (
        <EmptyState
          title="No properties found"
          message="Try widening your search filters to see more listings."
        />
      );
    }
    return (
      <div className="property-grid">
        {properties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Find your next space</h1>
            <p className="page-subtitle">Browse properties for rent and sale.</p>
          </div>
        </div>

        <div className="home-layout">
          <aside>
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onApply={() => setAppliedFilters(filters)}
              onReset={handleReset}
            />
          </aside>
          <section>{renderResults()}</section>
        </div>
      </main>
    </>
  );
}

export default HomePage;
