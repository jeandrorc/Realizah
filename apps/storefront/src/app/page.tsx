export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Welcome to Realizah Store</h1>
      <p className="text-lg mb-8">Your ecommerce platform powered by Medusa.js</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Content will go here */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
          <p>Check out our latest products</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Collections</h2>
          <p>Browse our collections</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">About Us</h2>
          <p>Learn more about our store</p>
        </div>
      </div>
    </div>
  )
} 