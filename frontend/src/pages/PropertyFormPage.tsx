import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { propertyApi } from "../api/property.api";
import { Property } from "../types/property";
import {
  validateRequired,
  validatePrice,
} from "../utils/validation";
import Navbar from "../components/Navbar";
import InputField from "../components/InputField";
import TextAreaField from "../components/TextAreaField";
import SelectField from "../components/SelectField";
import FileUpload from "../components/FileUpload";
import Loader from "../components/Loader";
import "./PropertyFormPage.css";

interface FormState {
  title: string;
  description: string;
  price: string;
  purpose: string;
  city: string;
  country: string;
  propertyType: string;
}

const INITIAL_STATE: FormState = {
  title: "",
  description: "",
  price: "",
  purpose: "rent",
  city: "",
  country: "",
  propertyType: "Apartment",
};

function PropertyFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // In edit mode, prefill the form with the existing listing.
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    propertyApi
      .getOne(id, controller.signal)
      .then((property: Property) => {
        setForm({
          title: property.title,
          description: property.description,
          price: String(property.price),
          purpose: property.purpose,
          city: property.city,
          country: property.country,
          propertyType: property.propertyType,
        });
        setExistingImages(property.images);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setServerError(err instanceof Error ? err.message : "Could not load listing");
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  function update(key: keyof FormState, value: string): void {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const fieldErrors = {
      title: validateRequired(form.title, "Title") ?? undefined,
      description: validateRequired(form.description, "Description") ?? undefined,
      price: validatePrice(form.price) ?? undefined,
      city: validateRequired(form.city, "City") ?? undefined,
      country: validateRequired(form.country, "Country") ?? undefined,
    };
    setErrors(fieldErrors);
    return !Object.values(fieldErrors).some(Boolean);
  }

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (!validate()) return;

    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("description", form.description);
    payload.append("price", form.price);
    payload.append("purpose", form.purpose);
    payload.append("city", form.city);
    payload.append("country", form.country);
    payload.append("propertyType", form.propertyType);
    files.forEach((file) => payload.append("images", file));
    // Preserve images the user kept when editing.
    if (existingImages.length > 0) {
      payload.append("imageUrls", existingImages.join(","));
    }

    setSubmitting(true);
    setServerError(null);
    try {
      const saved =
        isEdit && id
          ? await propertyApi.update(id, payload)
          : await propertyApi.create(payload);
      navigate(`/properties/${saved._id}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Could not save listing");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page">
          <Loader label="Loading listing..." />
        </main>
      </>
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

        <div className="page-header">
          <div>
            <h1 className="page-title">{isEdit ? "Edit listing" : "Add a new listing"}</h1>
            <p className="page-subtitle">
              Provide accurate details so the right buyers and renters find you.
            </p>
          </div>
        </div>

        {serverError ? <div className="alert alert-error">{serverError}</div> : null}

        <form className="property-form card" onSubmit={handleSubmit} noValidate>
          <InputField
            label="Title"
            name="title"
            placeholder="Bright two-bedroom apartment"
            value={form.title}
            error={errors.title}
            onChange={(e) => update("title", e.target.value)}
          />

          <TextAreaField
            label="Description"
            name="description"
            placeholder="Describe the space, amenities, and neighborhood."
            value={form.description}
            error={errors.description}
            onChange={(e) => update("description", e.target.value)}
          />

          <div className="form-row">
            <InputField
              label="Price (FCFA)"
              name="price"
              type="number"
              min={0}
              placeholder="120,000"
              value={form.price}
              error={errors.price}
              onChange={(e) => update("price", e.target.value)}
            />
            <SelectField
              label="Purpose"
              name="purpose"
              value={form.purpose}
              onChange={(e) => update("purpose", e.target.value)}
              options={[
                { label: "For rent", value: "rent" },
                { label: "For sale", value: "sale" },
              ]}
            />
          </div>

          <div className="form-row">
            <InputField
              label="City"
              name="city"
              placeholder="Douala"
              value={form.city}
              error={errors.city}
              onChange={(e) => update("city", e.target.value)}
            />
            <InputField
              label="Country"
              name="country"
              placeholder="Cameroon"
              value={form.country}
              error={errors.country}
              onChange={(e) => update("country", e.target.value)}
            />
          </div>

          <SelectField
            label="Property type"
            name="propertyType"
            value={form.propertyType}
            onChange={(e) => update("propertyType", e.target.value)}
            options={[
              { label: "Apartment", value: "Apartment" },
              { label: "House", value: "House" },
              { label: "Studio", value: "Studio" },
            ]}
          />

          <FileUpload
            files={files}
            onChange={setFiles}
            existingImages={existingImages}
            onRemoveExisting={(url) =>
              setExistingImages((prev) => prev.filter((item) => item !== url))
            }
          />

          <button className="btn btn-primary" disabled={submitting}>
            <FiSave size={16} />
            {submitting ? "Saving..." : isEdit ? "Save changes" : "Publish listing"}
          </button>
        </form>
      </main>
    </>
  );
}

export default PropertyFormPage;
