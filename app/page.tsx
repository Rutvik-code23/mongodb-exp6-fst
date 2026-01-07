"use client";

import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
  });

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= CREATE PRODUCT ================= */
  const createProduct = async () => {
    if (!form.name || !form.price || !form.category) return;

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        category: form.category,
      }),
    });

    setForm({ name: "", price: "", category: "" });
    fetchProducts();
  };

  /* ================= DELETE PRODUCT ================= */
  const deleteProduct = async (id: string) => {
    await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  };

  /* ================= UPDATE PRODUCT ================= */
  const increasePrice = async (id: string, price: number) => {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: price + 100 }),
    });
    fetchProducts();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Products CRUD (Frontend)</h1>

      {/* ========== CREATE FORM ========== */}
      <div className="space-y-3 mb-8">
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 w-full"
        />

        <button
          onClick={createProduct}
          className="bg-black text-white px-4 py-2"
        >
          Add Product
        </button>
      </div>

      {/* ========== PRODUCT LIST ========== */}
      <ul className="space-y-4">
        {products.map((p) => (
          <li
            key={p._id}
            className="border p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{p.name}</p>
              <p>
                ₹{p.price} • {p.category}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => increasePrice(p._id, p.price)}
                className="text-blue-600"
              >
                Increase Price
              </button>

              <button
                onClick={() => deleteProduct(p._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
