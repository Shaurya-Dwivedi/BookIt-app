// client/src/pages/CheckoutPage.tsx
import { useState } from 'react';
import { useBooking } from '../context/BookingContext.js';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = () => {
  const { bookingDetails } = useBooking();
  const navigate = useNavigate();

  // Form State
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState<{ type: 'flat' | 'percentage', value: number } | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!bookingDetails.experience) {
    return <Navigate to="/" />;
  }

  // Price Calculation
  const subtotal = bookingDetails.experience.price * bookingDetails.quantity;
  const taxes = subtotal * 0.05;
  const discountAmount = discount
    ? discount.type === 'flat' ? discount.value : subtotal * (discount.value / 100)
    : 0;
  const total = subtotal + taxes - discountAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleApplyPromo = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/promo/validate', { promoCode });
      if (res.data.isValid) {
        setDiscount(res.data.discount);
        setError('');
      }
    } catch (err) {
      setError('Invalid promo code.');
      setDiscount(null);
    }
  };
  
  const handleConfirmBooking = async () => {
    if (!userInfo.name || !userInfo.email) {
        setError('Please fill in your name and email.');
        return;
    }
    setIsSubmitting(true);
    setError('');

    try {
        const bookingPayload = {
            experienceId: bookingDetails.experience?._id,
            userName: userInfo.name,
            userEmail: userInfo.email,
            date: bookingDetails.date,
            time: bookingDetails.time,
            quantity: bookingDetails.quantity,
            totalPrice: total,
        };
        const res = await axios.post('http://localhost:3001/api/bookings', bookingPayload);
        // Navigate to a success/result page
        navigate(`/result?ref=${res.data.bookingRef}`);
    } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to create booking. The slot might have been taken.');
        setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Form */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full name</label>
              <input type="text" name="name" id="name" value={userInfo.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input type="email" name="email" id="email" value={userInfo.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
            </div>
          </div>
          <div className="flex gap-2">
            <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="Promo code" className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"/>
            <button onClick={handleApplyPromo} className="bg-gray-200 px-4 rounded-md text-sm font-semibold">Apply</button>
          </div>
        </div>

        {/* Right Side: Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Experience:</span><span className="font-semibold">{bookingDetails.experience.title}</span></div>
              {/* ... other summary details ... */}
              <hr className="my-2"/>
              <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Taxes (5%):</span><span>₹{taxes.toFixed(2)}</span></div>
              {discount && <div className="flex justify-between text-green-600"><span>Discount:</span><span>- ₹{discountAmount.toFixed(2)}</span></div>}
              <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>₹{total.toFixed(2)}</span></div>
            </div>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <button onClick={handleConfirmBooking} disabled={isSubmitting} className="w-full bg-primary font-bold py-3 mt-6 rounded-lg disabled:bg-gray-300">
              {isSubmitting ? 'Processing...' : 'Pay and Confirm'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;