import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { propertyApi } from "../api/property.api";
import { Property } from "../types/property";
import Navbar from "../components/Navbar";
import PropertyCard from "../components/PropertyCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import ConfirmDialog from "../components/ConfirmDialog";
import "./HomePage.css";

function MyListingsPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback((signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    propertyApi
      .listMine(signal)
      .then(setProperties)
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err instanceof Error ? err.message : "Could not load your listings");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  async function confirmDelete(): Promise<void> {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await propertyApi.remove(pendingDelete._id);
      setProperties((prev) => prev.filter((item) => item._id !== pendingDelete._id));
      setPendingDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete listing");
    } finally {
      setDeleting(false);
    }
  }

  function renderContent() {
    if (loading) return <Loader label="Loading your listings..." />;
    if (error) return <ErrorState message={error} onRetry={() => load()} />;
    if (properties.length === 0) {
      return (
        <EmptyState
          title="No listings yet"
          message="Create your first property listing to see it here."
          action={
            <Link to="/properties/new" className="btn btn-primary">
              <FiPlus size={16} />
              Add a listing
            </Link>
          }
        />
      );
    }
    return (
      <div className="property-grid">
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            onEdit={(p) => navigate(`/properties/${p._id}/edit`)}
            onDelete={(p) => setPendingDelete(p)}
          />
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
            <h1 className="page-title">My listings</h1>
            <p className="page-subtitle">Manage the properties you have published.</p>
          </div>
          <Link to="/properties/new" className="btn btn-primary">
            <FiPlus size={16} />
            Add listing
          </Link>
        </div>

        {renderContent()}
      </main>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this listing?"
        message={`"${pendingDelete?.title ?? ""}" will be permanently removed from the marketplace.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}

export default MyListingsPage;
