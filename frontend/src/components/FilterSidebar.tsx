import { FormEvent } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { PropertyFilters } from "../types/property";
import InputField from "./InputField";
import SelectField from "./SelectField";
import "./FilterSidebar.css";

interface FilterSidebarProps {
  filters: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
  onApply: () => void;
  onReset: () => void;
}

function FilterSidebar({ filters, onChange, onApply, onReset }: FilterSidebarProps) {
  function update(key: keyof PropertyFilters, value: string): void {
    onChange({ ...filters, [key]: value });
  }

  function handleSubmit(event: FormEvent): void {
    event.preventDefault();
    onApply();
  }

  return (
    <form className="filter-sidebar card" onSubmit={handleSubmit}>
      <h2 className="filter-title">Search filters</h2>

      <InputField
        label="City"
        name="city"
        placeholder="e.g. Lisbon"
        value={filters.city ?? ""}
        onChange={(e) => update("city", e.target.value)}
      />

      <div className="filter-row">
        <InputField
          label="Min price"
          name="minPrice"
          type="number"
          min={0}
          placeholder="0"
          value={filters.minPrice ?? ""}
          onChange={(e) => update("minPrice", e.target.value)}
        />
        <InputField
          label="Max price"
          name="maxPrice"
          type="number"
          min={0}
          placeholder="Any"
          value={filters.maxPrice ?? ""}
          onChange={(e) => update("maxPrice", e.target.value)}
        />
      </div>

      <SelectField
        label="Purpose"
        name="purpose"
        value={filters.purpose ?? ""}
        onChange={(e) => update("purpose", e.target.value)}
        options={[
          { label: "Any", value: "" },
          { label: "For rent", value: "rent" },
          { label: "For sale", value: "sale" },
        ]}
      />

      <SelectField
        label="Property type"
        name="propertyType"
        value={filters.propertyType ?? ""}
        onChange={(e) => update("propertyType", e.target.value)}
        options={[
          { label: "Any", value: "" },
          { label: "Apartment", value: "Apartment" },
          { label: "House", value: "House" },
          { label: "Studio", value: "Studio" },
        ]}
      />

      <div className="filter-actions">
        <button type="submit" className="btn btn-primary btn-block">
          <FiSearch size={16} />
          Search
        </button>
        <button type="button" className="btn btn-ghost btn-block" onClick={onReset}>
          <FiX size={16} />
          Clear
        </button>
      </div>
    </form>
  );
}

export default FilterSidebar;
