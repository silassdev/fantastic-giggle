import React from 'react';
import ProductExplorer from './components/ProductExplorer';

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-6 py-10">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-gray-500">Explore our computers and accessories</p>
        </div>
      </header>

      <ProductExplorer />
    </div>
  );
}
