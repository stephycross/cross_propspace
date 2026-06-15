import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiHome,
  FiUser,
  FiPhone,
  FiEdit2,
} from "react-icons/fi";
import { propertyApi } from "../api/property.api";
import { Property } from "../types/property";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import "./PropertyDetailPage.css";

function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    propertyApi
      .getOne(id, controller.signal)
      .then((data) => {
        setProperty(data);
        setActiveImage(0);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err instanceof Error ? err.message : "Could not load this property");
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  const owner = property && typeof property.owner === "object" ? property.owner : null;
  const isAuthor = Boolean(owner && user && owner._id === user.id);

  function renderBody() {
    if (loading) return <Loader label="Loading property..." />;
    if (error) return <ErrorState message={error} />;
    if (!property) return null;

    const images = property.images.length > 0 ? property.images : [];
    const formattedPrice = new Intl.NumberFormat("en-US").format(property.price);

    return (
      <article className="detail">
        <div className="detail-gallery">
          {images.length > 0 ? (
            <>
              <img className="detail-cover" src={images[activeImage]} alt={property.title} />
              {images.length > 1 ? (
                <div className="detail-thumbs">
                  {images.map((src, index) => (
                    <button
                      key={src}
                      className={`detail-thumb ${index === activeImage ? "is-active" : ""}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img src={src} alt={`View ${index + 1}`} />
                    </button>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="detail-cover detail-cover--empty">No images provided</div>
          )}
        </div>

        <div className="detail-info card">
          <span className={`property-badge property-badge--${property.purpose}`}>
            For {property.purpose}
          </span>
          <h1 className="detail-title">{property.title}</h1>
          <p className="detail-price">
            ${formattedPrice}
            {property.purpose === "rent" ? "/mo" : ""}
          </p>

          <div className="detail-meta">
            <span>
              <FiMapPin size={16} /> {property.city}, {property.country}
            </span>
            <span>
              <FiHome size={16} /> {property.propertyType}
            </span>
          </div>

          <h2 className="detail-section-title">Description</h2>
          <p className="detail-description">{property.description}</p>

          {owner ? (
            <div className="detail-owner">
              <h2 className="detail-section-title">Listed by</h2>
              <p>
                <FiUser size={15} /> {owner.username}
              </p>
              {owner.phone ? (
                <p>
                  <FiPhone size={15} /> {owner.phone}
                </p>
              ) : null}
            </div>
          ) : null}

          {isAuthor ? (
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/properties/${property._id}/edit`)}
            >
              <FiEdit2 size={15} />
              Edit listing
            </button>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <button className="btn btn-ghost detail-back" onClick={() => navigate(-1)}>
          <FiArrowLeft size={16} />
          Back
        </button>
        {renderBody()}
      </main>
    </>
  );
}

export default PropertyDetailPage;
