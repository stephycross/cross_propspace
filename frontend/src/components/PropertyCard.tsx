import { Link } from "react-router-dom";
import { FiMapPin, FiHome, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Property } from "../types/property";
import "./PropertyCard.css";

interface PropertyCardProps {
  property: Property;
  // When provided, owner controls are shown (used on the My Listings screen).
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
}

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><rect width="100%" height="100%" fill="#ede9fe"/><text x="50%" y="50%" fill="#7c3aed" font-family="sans-serif" font-size="18" text-anchor="middle" dy=".3em">No image</text></svg>'
  );

function formatPrice(value: number, purpose: string): string {
  const amount = new Intl.NumberFormat("en-US").format(value);
  return purpose === "rent" ? `$${amount}/mo` : `$${amount}`;
}

function PropertyCard({ property, onEdit, onDelete }: PropertyCardProps) {
  const cover = property.images[0] ?? PLACEHOLDER;

  return (
    <article className="property-card">
      <Link to={`/properties/${property._id}`} className="property-card-media">
        <img src={cover} alt={property.title} loading="lazy" />
        <span className={`property-badge property-badge--${property.purpose}`}>
          For {property.purpose}
        </span>
      </Link>

      <div className="property-card-body">
        <span className="property-price">{formatPrice(property.price, property.purpose)}</span>
        <Link to={`/properties/${property._id}`} className="property-title">
          {property.title}
        </Link>

        <div className="property-meta">
          <span className="property-meta-item">
            <FiMapPin size={14} />
            {property.city}, {property.country}
          </span>
          <span className="property-meta-item">
            <FiHome size={14} />
            {property.propertyType}
          </span>
        </div>

        {onEdit || onDelete ? (
          <div className="property-card-actions">
            {onEdit ? (
              <button className="btn btn-ghost" onClick={() => onEdit(property)}>
                <FiEdit2 size={15} />
                Edit
              </button>
            ) : null}
            {onDelete ? (
              <button className="btn btn-danger" onClick={() => onDelete(property)}>
                <FiTrash2 size={15} />
                Delete
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default PropertyCard;
