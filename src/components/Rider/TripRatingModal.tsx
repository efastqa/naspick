import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, CheckCircle, Heart, ThumbsUp, DollarSign, X, Receipt, Sparkles } from 'lucide-react';
import { Ride } from '../../types';

interface TripRatingModalProps {
  ride: Ride;
  onSubmitRating: (rating: number, review: string, tipLkr: number) => void;
  onClose: () => void;
}

export const TripRatingModal: React.FC<TripRatingModalProps> = ({
  ride,
  onSubmitRating,
  onClose,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedTip, setSelectedTip] = useState<number>(100);
  const [customTip, setCustomTip] = useState('');
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>([
    'Safe & Smooth Ride',
    'Friendly Ayubowan',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trigger celebration confetti upon reaching destination
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#06b6d4', '#ffffff'],
      });
    } catch (e) {
      // Ignore if confetti not supported
    }
  }, []);

  const complimentOptions = [
    'Safe & Smooth Ride',
    'Friendly Ayubowan',
    'Clean Vehicle',
    'Expert Colombo Route',
    'Punctual Pickup',
    'Great AC / Breeze',
  ];

  const toggleCompliment = (comp: string) => {
    if (selectedCompliments.includes(comp)) {
      setSelectedCompliments(selectedCompliments.filter((c) => c !== comp));
    } else {
      setSelectedCompliments([...selectedCompliments, comp]);
    }
  };

  const handleFinish = () => {
    setIsSubmitting(true);
    const finalTip = customTip ? parseInt(customTip, 10) || 0 : selectedTip;
    const combinedReview = [
      review,
      selectedCompliments.length > 0 ? `[Tags: ${selectedCompliments.join(', ')}]` : '',
    ]
      .filter(Boolean)
      .join(' ');

    onSubmitRating(rating, combinedReview, finalTip);
  };

  return (
    <div 
      id="trip-rating-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="text-center pt-2 pb-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/10">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-black text-white font-heading">You Have Arrived!</h3>
          <p className="text-xs text-slate-400 mt-1">
            Trip to <strong className="text-slate-200">{ride.dropoff.name}</strong> completed safely.
          </p>
        </div>

        {/* Digital e-Receipt Card */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 mb-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
              <Receipt className="w-3.5 h-3.5 text-emerald-400" />
              <span>Naspick e-Receipt ({ride.id})</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold rounded">
              PAID VIA {ride.paymentMethod.toUpperCase()}
            </span>
          </div>

          <div className="py-3 space-y-1.5 text-xs text-slate-300 border-b border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Distance Traveled</span>
              <span className="font-semibold">{ride.fare.distanceKm} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Trip Duration</span>
              <span className="font-semibold">{ride.fare.estimatedMinutes} mins</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Base Fare & Distance</span>
              <span>LKR {(ride.fare.baseFare + ride.fare.distanceFare).toLocaleString()}</span>
            </div>
            {ride.fare.discountLkr > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Promo Discount</span>
                <span>-LKR {ride.fare.discountLkr}</span>
              </div>
            )}
          </div>

          <div className="pt-3 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200">Total Charged</span>
            <span className="text-xl font-black text-white font-heading">
              LKR {ride.fare.totalLkr.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Driver Profile */}
        {ride.driver && (
          <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800 mb-5">
            <img
              src={ride.driver.avatar}
              alt={ride.driver.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
            />
            <div className="flex-1">
              <h4 className="font-bold text-white text-sm">{ride.driver.name}</h4>
              <p className="text-xs text-slate-400">
                {ride.driver.vehicleModel} •{' '}
                <span className="font-mono font-bold text-emerald-400">{ride.driver.vehiclePlate}</span>
              </p>
            </div>
          </div>
        )}

        {/* Interactive Star Rating */}
        <div className="text-center mb-5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Rate your trip experience
          </label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                id={`rate-star-${star}`}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 text-slate-600 hover:text-amber-400 transition-transform active:scale-125 focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    (hoverRating || rating) >= star
                      ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                      : 'text-slate-700'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-amber-400 font-semibold mt-1">
            {rating === 5 && 'Excellent! 5 Star Service'}
            {rating === 4 && 'Good Service'}
            {rating === 3 && 'Average'}
            {rating <= 2 && 'Needs Improvement'}
          </p>
        </div>

        {/* Compliment Badges */}
        <div className="mb-5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            What went well? (Compliments)
          </label>
          <div className="flex flex-wrap gap-2">
            {complimentOptions.map((comp) => {
              const active = selectedCompliments.includes(comp);
              return (
                <button
                  key={comp}
                  type="button"
                  onClick={() => toggleCompliment(comp)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                    active
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {comp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Driver Tip in Sri Lankan Rupees */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Add a Tip for {ride.driver?.name || 'Driver'} (LKR)
            </label>
            <span className="text-[10px] text-emerald-400 font-medium">100% goes to driver</span>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-2">
            {[0, 100, 200, 500].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => {
                  setSelectedTip(amount);
                  setCustomTip('');
                }}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  selectedTip === amount && !customTip
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {amount === 0 ? 'No Tip' : `Rs. ${amount}`}
              </button>
            ))}
          </div>

          <input
            type="number"
            placeholder="Or enter custom tip in LKR..."
            value={customTip}
            onChange={(e) => {
              setCustomTip(e.target.value);
              setSelectedTip(0);
            }}
            className="w-full py-2 px-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Written Review */}
        <div className="mb-5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Leave Feedback for the Naspick Community
          </label>
          <textarea
            id="trip-review-textarea"
            rows={2}
            placeholder="Share details about driver punctuality, vehicle cleanliness, or driving style..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
          ></textarea>
        </div>

        {/* Submit Rating Button */}
        <button
          id="trip-submit-rating-button"
          onClick={handleFinish}
          disabled={isSubmitting}
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Submit Review & Complete</span>
        </button>
      </div>
    </div>
  );
};
