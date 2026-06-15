import { apiClient } from "./client";
import { Property, PropertyFilters } from "../types/property";

function toQueryString(filters: PropertyFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, value);
    }
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

export const propertyApi = {
  list(filters: PropertyFilters, signal?: AbortSignal) {
    return apiClient.get<Property[]>(`/properties${toQueryString(filters)}`, signal);
  },
  listMine(signal?: AbortSignal) {
    return apiClient.get<Property[]>("/properties/mine", signal);
  },
  getOne(id: string, signal?: AbortSignal) {
    return apiClient.get<Property>(`/properties/${id}`, signal);
  },
  create(form: FormData) {
    return apiClient.post<Property>("/properties", form, { isFormData: true });
  },
  update(id: string, form: FormData) {
    return apiClient.put<Property>(`/properties/${id}`, form, { isFormData: true });
  },
  remove(id: string) {
    return apiClient.delete<{ message: string }>(`/properties/${id}`);
  },
};
