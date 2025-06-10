import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600">KSh {item.price}</p>
                  <div className="flex items-center space-x-2">
                    <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                    <input
                      id={`quantity-${item.id}`}
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, item.color, parseInt(e.target.value, 10))
                      }
                      className="w-16 border rounded p-1"
                    />
                  </div>
                </div>
                <Button variant="destructive" onClick={() => removeFromCart(item.id, item.color)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <h2 className="text-lg font-bold">Total: KSh {total}</h2>
            <Button variant="primary" className="mt-2">
              Proceed to Checkout
            </Button>
            <Button variant="secondary" className="mt-2" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
