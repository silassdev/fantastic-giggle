import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  qty: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shipping: {
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  appliedCoupon?: {
    id: any;
    code: string;
    percent: number;
    discountAmount: number;
  };
  status: 'PENDING_PAYMENT' | 'PAID' | 'SHIPPED' | 'CANCELLED' | 'DELIVERED';
  total: number;
  paymentMethod?: string;
  paymentRef?: string;
  paymentStatus?: string;
  trackingStatus?: string;
  trackingUpdates?: Array<{
    status: string;
    message: string;
    location?: string;
    updatedBy?: any;
    createdAt: Date;
  }>;
  deliveryProof?: {
    imageUrl?: string;
    signature?: string;
    deliveredAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TrackingUpdateSchema = new Schema({
  status: { type: String },
  message: { type: String },
  location: { type: String },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [{ productId: Schema.Types.ObjectId, name: String, price: Number, qty: Number }],
  shipping: { phone: String, address: String, city: String, state: String, country: String },
  appliedCoupon: {
    id: { type: Schema.Types.ObjectId, ref: 'Coupon' },
    code: String,
    percent: Number,
    discountAmount: Number,
  },
  status: { type: String, enum: ['PENDING_PAYMENT', 'PAID', 'SHIPPED', 'CANCELLED', 'DELIVERED'], default: 'PENDING_PAYMENT' },
  total: Number,

  // payment tracking
  paymentMethod: { type: String },
  paymentRef: { type: String },
  paymentStatus: { type: String },
  trackingStatus: { type: String, default: 'pending' },
  trackingUpdates: { type: [TrackingUpdateSchema], default: [] },

  deliveryProof: {
    imageUrl: String,
    signature: String,
    deliveredAt: Date,
  },
}, { timestamps: true });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
