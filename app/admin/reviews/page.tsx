"use client";

import { useEffect, useState } from "react";

type Review = { _id: string; userName: string; rating: number; comment: string };

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    fetch("/api/admin/reviews").then((r) => r.json()).then(setReviews);
  }, []);

  return (
    <div className="space-y-2">
      {reviews.map((r) => (
        <div key={r._id} className="rounded-xl bg-white p-3">
          <p className="font-medium">{r.userName} ({r.rating}/5)</p>
          <p className="text-sm">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
