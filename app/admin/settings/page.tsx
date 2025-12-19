"use client";
import React from 'react';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-serif mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total Products</p>
          <h3 className="text-4xl font-serif">--</h3>
        </div>
        <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total Categories</p>
          <h3 className="text-4xl font-serif">--</h3>
        </div>
        <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">WhatsApp Inquiries</p>
          <h3 className="text-4xl font-serif">Active</h3>
        </div>
      </div>
      
      <div className="mt-12 bg-black text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-serif mb-2">Welcome, Admin!</h2>
        <p className="text-gray-400 text-sm">Manage your premium store products and settings from here.</p>
      </div>
    </div>
  );
}
