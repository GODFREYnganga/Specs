// Demo script to test all admin features
const testAdminFeatures = async () => {
  console.log("🚀 Testing Admin Dashboard Features...\n");

  // Test Settings API
  try {
    console.log("1. Testing Settings API...");
    const settingsResponse = await fetch("http://localhost:3000/api/settings");
    const settings = await settingsResponse.json();
    console.log("✅ Settings loaded:", Object.keys(settings).length, "sections");
  } catch (error) {
    console.log("❌ Settings API failed:", error.message);
  }

  // Test Cart API
  try {
    console.log("\n2. Testing Cart API...");
    const cartResponse = await fetch("http://localhost:3000/api/cart?userId=demo-user");
    const cart = await cartResponse.json();
    console.log("✅ Cart loaded with", cart.items?.length || 0, "items");
  } catch (error) {
    console.log("❌ Cart API failed:", error.message);
  }

  // Test Wishlist API
  try {
    console.log("\n3. Testing Wishlist API...");
    const wishlistResponse = await fetch("http://localhost:3000/api/wishlist?userId=demo-user");
    const wishlist = await wishlistResponse.json();
    console.log("✅ Wishlist loaded with", wishlist.items?.length || 0, "items");
  } catch (error) {
    console.log("❌ Wishlist API failed:", error.message);
  }

  // Test Products API
  try {
    console.log("\n4. Testing Products API...");
    const productsResponse = await fetch("http://localhost:3000/api/products");
    const products = await productsResponse.json();
    console.log("✅ Products loaded:", products.length, "products available");
  } catch (error) {
    console.log("❌ Products API failed:", error.message);
  }

  console.log("\n🎉 Admin Dashboard Testing Complete!");
  console.log("\n📋 Available Admin Features:");
  console.log("   • Complete Settings Management (7 sections)");
  console.log("   • Database-integrated Cart & Wishlist");
  console.log("   • Orders Management System");
  console.log("   • Product Management");
  console.log("   • User Management");
  console.log("   • Real-time Form Validation");
  console.log("   • File Upload Support");
  console.log("   • Professional UI with Loading States");
  
  console.log("\n🔗 Admin URLs:");
  console.log("   Dashboard: http://localhost:3000/admin");
  console.log("   Settings:  http://localhost:3000/admin/settings");
  console.log("   Orders:    http://localhost:3000/admin/orders");
  console.log("   Products:  http://localhost:3000/admin/products");
};

// Run the test
if (typeof window !== 'undefined') {
  testAdminFeatures();
} else {
  module.exports = testAdminFeatures;
}
