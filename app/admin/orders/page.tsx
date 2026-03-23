"use client";

import { useEffect, useState } from "react";

type Order = {
  _id: string;
  customer: { name: string; phone: string };
  orderStatus: string;
  paymentStatus: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const load = () => fetch("/api/admin/orders").then((r) => r.json()).then(setOrders);
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-2">
      {orders.map((o) => (
        <div key={o._id} className="rounded-xl bg-white p-3">
          <p className="font-medium">Order #{o._id.slice(-6).toUpperCase()}</p>
          <p className="text-sm">{o.customer?.name} - {o.customer?.phone}</p>
          <p className="text-xs text-gray-600">{o.orderStatus} / {o.paymentStatus}</p>
        </div>
      ))}
    </div>
  );
}
