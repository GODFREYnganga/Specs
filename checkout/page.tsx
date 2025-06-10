import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    alert("Checkout successful! Thank you for your purchase.");
    clearCart();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600">KSh {item.price} x {item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <h2 className="text-lg font-bold">Total: KSh {total}</h2>
            <Button variant="primary" className="mt-2" onClick={handleCheckout}>
              Confirm Purchase
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
