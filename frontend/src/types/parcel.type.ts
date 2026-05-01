export const PARCEL_TYPES = [
  { value: "DOCUMENT", label: "Document" },
  { value: "BOX", label: "Box" },
  { value: "FRAGILE", label: "Fragile" },
  { value: "LIQUID", label: "Liquid" },
  { value: "FOOD", label: "Food" },
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "OTHER", label: "OTHER" },
];

export interface ICreateParcel {
  receiver: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  address: string;
  weight: number;
  parcel_type:
    | "DOCUMENT"
    | "BOX"
    | "FRAGILE"
    | "LIQUID"
    | "FOOD"
    | "ELECTRONICS"
    | "OTHER";

  description?: string;
}

export type IUpdateParcel = Partial<ICreateParcel>;

export interface IHistory {
  _id: string;
  sender: string;
  receiver: Receiver;
  tracking_number: string;
  weight: number;
  fees: number;
  delivery_date: string;
  current_status: CurrentStatus;
  trackingEvents: TrackingEvent[];
  parcel_type: string;
  createdAt: string;
  updatedAt: string;
}

export interface Receiver {
  name: string;
  email: string;
  phone: string;
  address: string;
  _id: string;
}

export interface CurrentStatus {
  _id: string;
  status: string;
  paid_status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingEvent {
  status: string;
  paid_status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

/// Assigned Parcel

export interface IAssignedParcel {
  _id: string;
  sender: string;
  receiver: Receiver;
  tracking_number: string;
  weight: number;
  fees: number;
  delivery_date: string;
  current_status: CurrentStatus;
  trackingEvents: TrackingEvent[];
  parcel_type: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
}

export interface Receiver {
  name: string;
  email: string;
  phone: string;
  address: string;
  _id: string;
}

export interface CurrentStatus {
  _id: string;
  status: string;
  paid_status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingEvent {
  status: string;
  paid_status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
