// Represents the three async states every network-backed view needs to handle.
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface ApiErrorBody {
  message: string;
}
