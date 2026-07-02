import { useState, useEffect } from 'react';
import { 
  Leaf, 
  Search, 
  ShoppingBag, 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  Plus, 
  Minus, 
  Trash2, 
  Calendar, 
  Users, 
  Check, 
  ChevronRight, 
  Flame, 
  Utensils, 
  X, 
  MessageSquare, 
  Gift, 
  Sparkles, 
  Heart,
  Send,
  Navigation,
  Compass
} from 'lucide-react';
import { menuData, reviewsData } from './data/menu';
import heroImg from './assets/hero_indian_veg.png';

function App() {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [spiceFilter, setSpiceFilter] = useState('All');
  const [onlyBestSellers, setOnlyBestSellers] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Cart & Order State
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [orderTimelineStep, setOrderTimelineStep] = useState(0);
  const [orderTimeLeft, setOrderTimeLeft] = useState(25);
  const [simulatedOrderDetails, setSimulatedOrderDetails] = useState(null);

  // Reservation State
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    guests: '2',
    date: '',
    time: '19:30',
    requests: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Reviews State
  const [reviews, setReviews] = useState(reviewsData);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    text: '',
    role: 'Food Lover'
  });
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Track scroll position for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Delivery tracker simulation timeline
  useEffect(() => {
    let interval;
    if (checkoutSuccess && orderTimelineStep < 3) {
      interval = setInterval(() => {
        setOrderTimelineStep((prev) => {
          if (prev >= 3) return 3;
          return prev + 1;
        });
        setOrderTimeLeft((prev) => Math.max(0, prev - Math.floor(Math.random() * 5 + 5)));
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [checkoutSuccess, orderTimelineStep]);

  // Cart helper actions
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.item.id === item.id);
      if (existing) {
        return prevCart.map((i) => 
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.item.id === itemId);
      if (existing.quantity === 1) {
        return prevCart.filter((i) => i.item.id !== itemId);
      }
      return prevCart.map((i) => 
        i.item.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const deleteFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((i) => i.item.id !== itemId));
  };

  const getCartQuantity = (itemId) => {
    const found = cart.find((i) => i.item.id === itemId);
    return found ? found.quantity : 0;
  };

  const getSubtotal = () => {
    return cart.reduce((total, entry) => total + (entry.item.price * entry.quantity), 0);
  };

  const applyPromoCode = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'TRIMURTI20') {
      setCouponApplied(true);
      setDiscountPercent(20);
    } else {
      alert('Invalid coupon code! Try TRIMURTI20');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setSimulatedOrderDetails({
      items: [...cart],
      id: 'ORD-' + Math.floor(Math.random() * 90000 + 10000),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      total: getGrandTotal()
    });
    setCheckoutSuccess(true);
    setOrderTimelineStep(0);
    setOrderTimeLeft(25);
    setCart([]);
    setCouponApplied(false);
    setCouponCode('');
    setDiscountPercent(0);
    setIsCartOpen(false);
  };

  // Reservation handling
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const resId = 'TR-' + Math.floor(Math.random() * 9000 + 1000);
    setConfirmedBooking({
      ...bookingForm,
      id: resId
    });
    setBookingSuccess(true);
  };

  // Review handling
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    const addedReview = {
      id: reviews.length + 1,
      name: newReview.name,
      rating: newReview.rating,
      text: newReview.text,
      role: newReview.role || 'Food Lover',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&w=150&h=150&q=80`
    };
    setReviews([addedReview, ...reviews]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewFormOpen(false);
      setNewReview({ name: '', rating: 5, text: '', role: 'Food Lover' });
    }, 2000);
  };

  // Contact handling
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  // Calculations
  const subtotal = getSubtotal();
  const discountAmount = subtotal * (discountPercent / 100);
  const gstRate = 0.05; // 5% GST for restaurants
  const gstAmount = (subtotal - discountAmount) * gstRate;
  const packingDeliveryFee = subtotal > 0 ? (subtotal > 300 ? 0 : 35) : 0;
  
  const getGrandTotal = () => {
    return Math.round(subtotal - discountAmount + gstAmount + packingDeliveryFee);
  };

  // Filters logic
  const filteredMenu = menuData.filter((item) => {
    // Category filter
    const matchesCategory = activeTab === 'All' || item.category === activeTab;
    
    // Search query filter
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Spicy level filter
    let matchesSpice = true;
    if (spiceFilter === 'Mild') matchesSpice = item.spicy === 0;
    else if (spiceFilter === 'Medium') matchesSpice = item.spicy === 1 || item.spicy === 2;
    else if (spiceFilter === 'Spicy') matchesSpice = item.spicy === 3;

    // Best Sellers filter
    const matchesBestSeller = !onlyBestSellers || item.tags.includes('Best Seller');

    return matchesCategory && matchesSearch && matchesSpice && matchesBestSeller;
  });

  return (
    <div className="min-h-screen text-stone-900 bg-stone-50 font-sans selection:bg-brand-orange-medium selection:text-white relative">
      
      {/* Top Banner Message */}
      <div className="bg-brand-green-dark text-stone-100 text-xs py-2 px-4 text-center font-medium flex justify-between items-center transition-all">
        <span className="flex items-center gap-1 mx-auto">
          <Leaf className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 inline" />
          <span>100% PURE INDIAN VEGETARIAN HOTEL - HEALTHY & HYGIENIC DINING</span>
        </span>
        <div className="hidden md:flex gap-4 items-center mr-4">
          <span>Offers: 20% OFF code: <strong className="text-amber-400">TRIMURTI20</strong></span>
        </div>
      </div>

      {/* Navigation Header */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-stone-900/95 backdrop-blur-md py-3 shadow-lg' 
          : 'bg-stone-900 py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg flex items-center justify-center border border-emerald-500 shadow-md">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-serif font-black tracking-wider text-white">TRIMURTI</span>
                <span className="border border-emerald-500 bg-emerald-950 text-[9px] text-emerald-400 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
                  PURE VEG
                </span>
              </div>
              <p className="text-[10px] tracking-widest text-amber-500 font-medium uppercase font-devanagari hindi-text -mt-1">
                त्रिमूर्ति शुद्ध शाकाहारी होटल
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-stone-300 font-semibold text-sm">
            <a href="#" className="hover:text-amber-400 transition-colors">Home</a>
            <a href="#menu-section" className="hover:text-amber-400 transition-colors">Our Menu</a>
            <a href="#thali-section" className="hover:text-amber-400 transition-colors">Grand Thali</a>
            <a href="#booking-section" className="hover:text-amber-400 transition-colors">Table Booking</a>
            <a href="#reviews-section" className="hover:text-amber-400 transition-colors">Testimonials</a>
            <a href="#contact-section" className="hover:text-amber-400 transition-colors">Contact</a>
          </nav>

          {/* Cart & Quick Call Buttons */}
          <div className="flex items-center gap-4">
            <a 
              href="tel:+919876543210" 
              className="hidden sm:flex items-center gap-2 text-stone-200 hover:text-amber-400 text-xs font-bold border border-stone-700 px-3.5 py-1.5 rounded-full hover:bg-stone-800 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>Call Us: +91 98765 43210</span>
            </a>
            
            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative bg-amber-500 hover:bg-amber-600 text-stone-950 px-4 py-2.5 rounded-full font-bold text-sm shadow-md shadow-amber-500/20 hover:scale-105 transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>My Order</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 border-2 border-stone-900 text-white font-black text-xs w-6 h-6 rounded-full flex items-center justify-center animate-bounce">
                  {cart.reduce((tot, i) => tot + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-900 text-white pt-10 pb-16 lg:py-24">
        {/* Decorative backdrop shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-400 text-xs font-semibold">
                <Leaf className="w-3.5 h-3.5 fill-emerald-400" />
                <span>100% Traditional Indian Vegetarian Heritage</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight text-white">
                Taste the Purity of <br />
                <span className="text-amber-400 font-serif">Trimurti Cuisine</span>
              </h1>
              
              <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-xl">
                Indulge in a premium dining experience featuring slow-simmered rich curries, smoky clay-oven tandoori appetizers, and soft, ghee-soaked South Indian classics. Prepared using pure spices and handpicked ingredients.
              </p>

              {/* Hindi Callout */}
              <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 flex items-center gap-4 max-w-md">
                <span className="text-3xl font-devanagari text-amber-500 font-bold border-r border-stone-700 pr-4">
                  शुद्धता
                </span>
                <div>
                  <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Our Promise</p>
                  <p className="text-sm font-devanagari text-stone-300">बिना मिलावट का शुद्ध शाकाहारी स्वादिष्ट भोजन।</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="#menu-section"
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 px-8 py-3.5 rounded-full font-bold text-base shadow-lg shadow-amber-500/25 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Explore Menu</span>
                </a>
                <a 
                  href="#booking-section"
                  className="bg-transparent hover:bg-stone-800 text-white border-2 border-stone-600 hover:border-white px-8 py-3.5 rounded-full font-bold text-base transition-all duration-200 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Reserve Table</span>
                </a>
              </div>

              {/* Features list */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-800/80">
                <div>
                  <h3 className="text-amber-400 font-bold text-lg">100% Pure</h3>
                  <p className="text-xs text-stone-400">Strict vegetarian kitchen</p>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-lg">Fresh Spices</h3>
                  <p className="text-xs text-stone-400">House-ground masalas</p>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-lg">Hygienic</h3>
                  <p className="text-xs text-stone-400">5-Star safety standards</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative w-full max-w-md sm:max-w-lg aspect-square">
                {/* Image border/shadow decoration */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 to-emerald-600 rounded-3xl blur-md opacity-75"></div>
                <div className="relative w-full h-full bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800">
                  <img 
                    src={heroImg} 
                    alt="Trimurti Grand Vegetarian Dining Feast" 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                  />
                  {/* Floating best seller tag */}
                  <div className="absolute bottom-6 right-6 bg-stone-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-amber-500/30 flex items-center gap-3 shadow-lg">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 font-black">
                      4.9★
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Top Rated Indian Veg</p>
                      <p className="text-sm font-bold text-white">Trimurti Grand Thali</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Quality Highlights Section */}
      <section className="py-12 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 shrink-0">
                <Leaf className="w-6 h-6 fill-emerald-600/20" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 font-serif text-lg">Pure Vegetarian</h4>
                <p className="text-stone-500 text-sm mt-1">Separate preparation units, no meat, egg, or animal fat ingredients used.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-amber-50 p-3 rounded-2xl text-amber-600 shrink-0">
                <Flame className="w-6 h-6 fill-amber-600/20" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 font-serif text-lg">Tandoori Wonders</h4>
                <p className="text-stone-500 text-sm mt-1">Grilled at high temperatures in a real charcoal-fired clay oven (Tandoor).</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-stone-100 p-3 rounded-2xl text-stone-700 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 font-serif text-lg">18-Hour Slow Cook</h4>
                <p className="text-stone-500 text-sm mt-1">Traditional recipes like our signature Dal Makhani slow-cooked overnight.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 shrink-0">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 font-serif text-lg">Hygienic Kitchen</h4>
                <p className="text-stone-500 text-sm mt-1">Water filtration, fresh ingredients sourced daily, and staff hygiene checklists.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grand Trimurti Thali Highlight Section */}
      <section id="thali-section" className="py-16 bg-gradient-to-br from-stone-950 to-emerald-950 text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-amber-400 text-sm uppercase tracking-widest font-extrabold flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 fill-amber-400" /> Signature Royal Feast
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black mt-2 text-white">The Trimurti Grand Maharaja Thali</h2>
            <p className="text-stone-300 mt-3 text-base">
              A lavish collection of our absolute best recipes served in copper bowls on a single royal bronze thali. A complete culinary experience fit for royalty.
            </p>
          </div>

          <div className="bg-stone-900/60 backdrop-blur-md rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2">
              
              {/* Thali Image */}
              <div className="relative h-64 md:h-auto min-h-[300px]">
                <img 
                  src={heroImg} 
                  alt="Trimurti Grand Thali Feast" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-950 via-stone-950/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 fill-white" />
                  <span>100% Unlimited Refills (Dine-in Only)</span>
                </div>
              </div>

              {/* Thali Details */}
              <div className="p-8 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-amber-500/25 border border-amber-500/55 text-amber-300 px-3 py-1 rounded-full text-xs font-extrabold">
                        Royal Special
                      </span>
                      <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white mt-2">The Ultimate Feast</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-stone-400 line-through">₹450</p>
                      <p className="text-2xl lg:text-3xl font-bold text-amber-400">₹350</p>
                    </div>
                  </div>

                  <p className="text-stone-300 text-sm mt-4 leading-relaxed">
                    Indulge in a dynamic variety of tastes. This special thali is custom assembled by our head chef to give you the perfect balance of sweet, spicy, sour, and savory.
                  </p>

                  <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider mt-6 mb-2.5">What's Included:</h4>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-stone-200">
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Paneer Butter Masala</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Trimurti Special Dal Makhani</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Mix Veg Sabzi (Dry)</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Aromatic Basmati Jeera Rice</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 2 Fresh Tandoori Butter Naan</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Cold Raita, Salad & Papad</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 2 Hot Gulab Jamuns (Sweet)</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Spiced Masala Butter Milk</div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-2 text-stone-400 text-xs">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Serving Time: 11:30 AM - 11:00 PM</span>
                  </div>
                  
                  <button 
                    onClick={() => addToCart({
                      id: "thali-grand",
                      name: "Trimurti Grand Maharaja Thali",
                      category: "Main Course",
                      price: 350,
                      spicy: 1,
                      description: "Signature unlimited thali featuring paneer, dal, dry veg, naan, rice, raita, gulab jamun and butter milk.",
                      image: heroImg
                    })}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-stone-950 px-6 py-3 rounded-full font-bold text-sm shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Thali to Order</span>
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Main Menu Section (Interactive Filtering) */}
      <section id="menu-section" className="py-16 bg-stone-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Menu Title */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-emerald-600 text-xs font-black uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full inline-block">
              Culinary Delights
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black mt-3">Explore Our Pure Veg Menu</h2>
            <p className="text-stone-500 mt-2">
              Browse through our authentic Indian recipe collection. Filter by categories, search for dishes, or adjust spice levels.
            </p>
          </div>

          {/* Interactive Filters Bar */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative w-full lg:max-w-md">
                <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Search paneer, dosa, naan, desserts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-all bg-stone-50/50"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Advanced Controls (Spicy, Best Sellers) */}
              <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-end">
                {/* Spicy Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Spice Level:</span>
                  <select 
                    value={spiceFilter}
                    onChange={(e) => setSpiceFilter(e.target.value)}
                    className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 font-semibold cursor-pointer"
                  >
                    <option value="All">All Spice Levels</option>
                    <option value="Mild">Mild / Sweet (0-1 Flame)</option>
                    <option value="Medium">Medium Spicy (1-2 Flames)</option>
                    <option value="Spicy">Very Spicy (3 Flames)</option>
                  </select>
                </div>

                {/* Best Sellers Filter Toggle */}
                <button 
                  onClick={() => setOnlyBestSellers(!onlyBestSellers)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                    onlyBestSellers 
                      ? 'bg-amber-500 border-amber-500 text-stone-950 font-extrabold shadow-sm'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Best Sellers Only</span>
                </button>
              </div>

            </div>

            {/* Category Tabs */}
            <div className="border-t border-stone-100 pt-4 overflow-x-auto scrollbar-none flex gap-2">
              {['All', 'Breakfast', 'Starters', 'Main Course', 'Breads & Rice', 'Desserts', 'Beverages'].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === category
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/60'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          {filteredMenu.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMenu.map((item) => {
                const qty = getCartQuantity(item.id);
                return (
                  <div 
                    key={item.id}
                    className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image and badges */}
                      <div className="relative h-48 overflow-hidden bg-stone-100">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Veg green indicator mark */}
                        <div className="absolute top-3 left-3 bg-white p-1 rounded border border-emerald-500 flex items-center justify-center shadow-md">
                          <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></div>
                        </div>

                        {/* Rating badge */}
                        <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1 text-[11px] font-bold text-amber-400 border border-stone-800">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{item.rating}</span>
                        </div>

                        {/* Spice Level indicator */}
                        {item.spicy > 0 && (
                          <div className="absolute bottom-3 left-3 bg-stone-900/85 backdrop-blur-md px-2 py-1 rounded-lg border border-stone-850 flex items-center gap-0.5 text-orange-500">
                            {[...Array(item.spicy)].map((_, i) => (
                              <Flame key={i} className="w-3 h-3 fill-orange-500" />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Content details */}
                      <div className="p-4 space-y-2 text-left">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag, idx) => (
                            <span key={idx} className="bg-amber-50 text-[10px] font-bold text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <h3 className="font-serif font-bold text-stone-900 text-lg group-hover:text-emerald-700 transition-colors">
                          {item.name}
                        </h3>
                        
                        <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Price and Cart Control */}
                    <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between mt-3">
                      <div>
                        <span className="text-xs text-stone-400 font-semibold block uppercase tracking-wide">Price</span>
                        <span className="text-lg font-black text-stone-900 font-mono">₹{item.price}</span>
                      </div>

                      {qty > 0 ? (
                        <div className="bg-emerald-600 text-white rounded-full flex items-center overflow-hidden border border-emerald-700 shadow-md">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 hover:bg-emerald-700 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-sm font-black min-w-[20px] text-center font-mono">
                            {qty}
                          </span>
                          <button 
                            onClick={() => addToCart(item)}
                            className="p-2 hover:bg-emerald-700 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addToCart(item)}
                          className="bg-stone-900 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add to Cart</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto">
              <Search className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h3 className="font-serif font-bold text-lg">No dishes found</h3>
              <p className="text-stone-500 text-sm mt-1">
                We couldn't find any dishes matching your filters or search query. Try clearing filters or searching for something else.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSpiceFilter('All');
                  setOnlyBestSellers(false);
                  setActiveTab('All');
                }}
                className="mt-4 bg-amber-500 hover:bg-amber-600 text-stone-950 px-5 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Online Reservation Section */}
      <section id="booking-section" className="py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side details */}
            <div className="lg:col-span-5 text-left space-y-6">
              <span className="text-amber-600 text-xs font-black uppercase tracking-widest bg-amber-50 px-3.5 py-1.5 rounded-full inline-block">
                Table Booking
              </span>
              <h2 className="text-3.5xl font-serif font-black leading-tight text-stone-900">
                Reserve Your Dining <br />
                Table in Advance
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                Planning a family gathering, lunch meet, or a festive celebration? Book a table at Trimurti Pure Veg Hotel. Avoid queues and secure the best spots.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-sm">Flexible Timings</h4>
                    <p className="text-stone-500 text-xs mt-0.5">Available for Breakfast, Lunch & Dinner. Slots from 7:00 AM - 10:30 PM.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 mt-0.5">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-sm">Large Group Hosting</h4>
                    <p className="text-stone-500 text-xs mt-0.5">We can arrange special layouts for large family dinners or corporate lunches.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 mt-0.5">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-sm">Celebration Friendly</h4>
                    <p className="text-stone-500 text-xs mt-0.5">Let us know if it is a birthday or anniversary! We can provide a complimentary sweet platter.</p>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block shrink-0 animate-ping"></span>
                <span>Booking confirmation is instant. We'll send booking details to your phone via SMS.</span>
              </div>
            </div>

            {/* Right side form */}
            <div className="lg:col-span-7">
              {bookingSuccess ? (
                /* Ticket Receipt Reservation Confirmed view */
                <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-2xl relative overflow-hidden text-left max-w-xl mx-auto">
                  {/* Decorative tickets holes */}
                  <div className="absolute top-1/2 -left-4 w-8 h-8 bg-white rounded-full"></div>
                  <div className="absolute top-1/2 -right-4 w-8 h-8 bg-white rounded-full"></div>
                  
                  <div className="text-center border-b border-dashed border-stone-700 pb-6 mb-6">
                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-500/20">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Reservation Confirmed</span>
                    <h3 className="text-2xl font-serif font-bold text-white mt-1">We are ready to serve you!</h3>
                    <p className="text-stone-400 text-xs mt-1">Please show this digital confirmation ticket upon arrival.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm mb-6">
                    <div>
                      <p className="text-xs text-stone-400">Reservation ID</p>
                      <p className="font-bold text-amber-400 font-mono">{confirmedBooking?.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">Guest Name</p>
                      <p className="font-bold text-white">{confirmedBooking?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">Date & Time</p>
                      <p className="font-bold text-white">{confirmedBooking?.date} at {confirmedBooking?.time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">Number of Guests</p>
                      <p className="font-bold text-white">{confirmedBooking?.guests} Persons</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">Contact Number</p>
                      <p className="font-bold text-white">{confirmedBooking?.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">Table Preference</p>
                      <p className="font-bold text-white">Main Dining Area</p>
                    </div>
                  </div>

                  {confirmedBooking?.requests && (
                    <div className="bg-stone-850 p-3 rounded-xl border border-stone-800 text-xs text-stone-300 mb-6">
                      <strong>Special Note:</strong> "{confirmedBooking.requests}"
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-800">
                    <button 
                      onClick={() => setBookingSuccess(false)}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-stone-950 py-3 rounded-xl font-bold text-sm transition-all text-center"
                    >
                      Book Another Table
                    </button>
                    <button 
                      onClick={() => {
                        alert('Calendar event created mock!');
                      }}
                      className="flex-1 bg-stone-800 hover:bg-stone-700 border border-stone-700 py-3 rounded-xl font-semibold text-xs text-stone-300 transition-all"
                    >
                      Add to Google Calendar
                    </button>
                  </div>
                </div>
              ) : (
                /* Reservation Form view */
                <form 
                  onSubmit={handleBookingSubmit}
                  className="bg-stone-50 border border-stone-200 p-6 sm:p-10 rounded-3xl shadow-sm text-left max-w-2xl mx-auto space-y-4"
                >
                  <h3 className="font-serif font-black text-xl text-stone-900 border-b border-stone-200 pb-3">
                    Reserve Your Table
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1">Full Name *</label>
                      <input 
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-amber-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1">Phone Number *</label>
                      <input 
                        type="tel"
                        required
                        placeholder="Enter phone number"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-amber-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1">Guests *</label>
                      <select
                        value={bookingForm.guests}
                        onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-amber-500 text-sm"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 Persons</option>
                        <option value="4">4 Persons</option>
                        <option value="5-8">5-8 Persons</option>
                        <option value="9+">Large Gathering (9+)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1">Select Date *</label>
                      <input 
                        type="date"
                        required
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-amber-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1">Select Time *</label>
                      <select
                        value={bookingForm.time}
                        onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-amber-500 text-sm"
                      >
                        <option value="08:00">08:00 AM (Breakfast)</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="12:30">12:30 PM (Lunch)</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="16:00">04:00 PM</option>
                        <option value="19:30">07:30 PM (Dinner)</option>
                        <option value="21:00">09:00 PM</option>
                        <option value="22:00">10:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1">Email Address (Optional)</label>
                    <input 
                      type="email"
                      placeholder="email@example.com"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1">Special Requests (Optional)</label>
                    <textarea 
                      rows="3"
                      placeholder="Wheelchair access, high chair for kids, candlelit setup, etc."
                      value={bookingForm.requests}
                      onChange={(e) => setBookingForm({ ...bookingForm, requests: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-amber-500 text-sm resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm Reservation</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* Customer Testimonials & Add Review Section */}
      <section id="reviews-section" className="py-16 bg-stone-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div className="text-left max-w-xl">
              <span className="text-emerald-600 text-xs font-black uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full inline-block">
                Guest Reviews
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-black mt-3">What Our Guests Say</h2>
              <p className="text-stone-500 mt-2 text-sm">
                Real feedback from real food lovers. We take pride in delivering clean, hygienic, and authentic pure veg food.
              </p>
            </div>

            <button 
              onClick={() => setReviewFormOpen(!reviewFormOpen)}
              className="bg-amber-500 hover:bg-amber-600 text-stone-950 px-5 py-2.5 rounded-full font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{reviewFormOpen ? 'Close Review Form' : 'Write a Review'}</span>
            </button>
          </div>

          {/* Add Review Panel */}
          {reviewFormOpen && (
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-xl mx-auto mb-10 text-left shadow-lg relative">
              <button 
                onClick={() => setReviewFormOpen(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-3 mb-4">
                Share Your Dining Experience
              </h3>

              {reviewSubmitted ? (
                <div className="py-8 text-center text-emerald-600 font-bold flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <p>Thank you! Your review was successfully published.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1">Your Name *</label>
                      <input 
                        type="text"
                        required
                        placeholder="E.g. Rajesh Patil"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:border-amber-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1">Who are you? (Optional)</label>
                      <input 
                        type="text"
                        placeholder="E.g. Food Lover, Chef, Local"
                        value={newReview.role}
                        onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:border-amber-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Stars Rating Selector */}
                  <div>
                    <span className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5">Rating *</span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="text-stone-300 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star className={`w-7 h-7 ${
                            star <= (hoverRating || newReview.rating) 
                              ? 'text-amber-400 fill-amber-400' 
                              : 'text-stone-200'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1">Your Review *</label>
                    <textarea 
                      required
                      rows="3"
                      placeholder="Tell others about the food quality, taste, hygiene, service..."
                      value={newReview.text}
                      onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:border-amber-500 text-sm resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publish Review</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div 
                key={rev.id} 
                className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between text-left hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {/* Verified stamp */}
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Dine-in Guest
                    </span>
                  </div>

                  <p className="text-stone-600 text-sm leading-relaxed italic mb-6">
                    "{rev.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-stone-100 pt-4">
                  <img 
                    src={rev.avatar} 
                    alt={rev.name} 
                    className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{rev.name}</h4>
                    <p className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Map, Opening Hours & Contact Section */}
      <section id="contact-section" className="py-16 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Contact Details & Feedback Form */}
            <div className="lg:col-span-5 text-left flex flex-col justify-between space-y-8">
              
              <div className="space-y-4">
                <span className="text-emerald-600 text-xs font-black uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full inline-block">
                  Location & Info
                </span>
                <h2 className="text-3xl font-serif font-black text-stone-900">Visit Our Restaurant</h2>
                <p className="text-stone-500 text-sm">
                  We are conveniently located at a key junction with ample parking space. Bring your family for an unforgettable vegetarian feast.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm font-serif">Address</h4>
                      <p className="text-stone-500 text-xs mt-0.5">Trimurti Chowk, Opp. Gold Heights, Ring Road, Pune, Maharashtra - 411030</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm font-serif">Opening Hours</h4>
                      <p className="text-stone-500 text-xs mt-0.5">Everyday: 7:00 AM - 11:00 PM</p>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Kitchen closes at 10:45 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm font-serif">Contact Details</h4>
                      <p className="text-stone-500 text-xs mt-0.5">Reservations: +91 98765 43210</p>
                      <p className="text-stone-500 text-xs">Email: info@trimurtipureveg.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact Form */}
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
                <h3 className="font-serif font-bold text-stone-900 text-base mb-3">Send a Quick Message</h3>
                {contactSuccess ? (
                  <p className="text-emerald-600 text-xs font-bold py-2">✓ Message received! We will reply to your email shortly.</p>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text"
                        required
                        placeholder="Your Name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-amber-500"
                      />
                      <input 
                        type="email"
                        required
                        placeholder="Email Address"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <textarea 
                      required
                      rows="2"
                      placeholder="Your questions or feedback..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-amber-500 resize-none"
                    ></textarea>
                    <button 
                      type="submit"
                      className="bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>

            </div>

            {/* Map Mockup container */}
            <div className="lg:col-span-7 relative h-72 lg:h-auto min-h-[350px] bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 shadow-inner flex flex-col items-center justify-center p-6 text-center">
              
              {/* Styled SVG Map Graphic to represent Map */}
              <div className="absolute inset-0 bg-stone-100/80 pointer-events-none opacity-40">
                {/* Simulated streets lines grid */}
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 0,50 L 500,50 M 0,150 L 500,150 M 0,250 L 500,250 M 100,0 L 100,300 M 250,0 L 250,300 M 400,0 L 400,300" stroke="#e7e5e4" strokeWidth="3" fill="none" />
                  <path d="M -50,100 C 150,120 300,50 550,110" stroke="#fcd34d" strokeWidth="6" fill="none" opacity="0.8" />
                  <path d="M 120,-50 C 180,150 150,220 200,350" stroke="#34d399" strokeWidth="5" fill="none" opacity="0.6" />
                </svg>
              </div>

              {/* Map Floating Card */}
              <div className="relative z-10 bg-white p-6 rounded-2xl border border-stone-200 shadow-xl max-w-sm">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-600 animate-bounce">
                  <MapPin className="w-6 h-6 fill-amber-600/30" />
                </div>
                <h4 className="font-serif font-black text-stone-900 text-base">Trimurti Pure Veg</h4>
                <p className="text-stone-500 text-xs mt-1.5">Pune Ring Road Junction, near Gold Heights.</p>
                
                <div className="flex gap-2.5 mt-4 justify-center">
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>
                  <button 
                    onClick={() => alert('Simulated GPS location shared to your device!')}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                  >
                    Share Location
                  </button>
                </div>
              </div>

              {/* Extra GPS compass sticker */}
              <div className="absolute bottom-4 right-4 bg-stone-900/90 text-white p-2 rounded-xl text-[10px] font-mono flex items-center gap-1.5 shadow border border-stone-850">
                <Compass className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span>18.5204° N, 73.8567° E</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white pt-12 pb-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-800 text-left">
            
            {/* Col 1 Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-600 p-1.5 rounded flex items-center justify-center">
                  <Utensils className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-serif font-black tracking-wider text-white">TRIMURTI</span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                Traditional taste, hygiene-focused, and 100% vegetarian culinary excellence. Savor the flavors of authentic Indian kitchens.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] border border-emerald-900/60 bg-emerald-950/40 w-fit px-2.5 py-1 rounded">
                <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
                <span>CERTIFIED PURE VEG KITCHEN</span>
              </div>
            </div>

            {/* Col 2 Quick Links */}
            <div>
              <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2 text-stone-400 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Home Page</a></li>
                <li><a href="#menu-section" className="hover:text-white transition-colors">Our Food Menu</a></li>
                <li><a href="#thali-section" className="hover:text-white transition-colors">Grand Maharaja Thali</a></li>
                <li><a href="#booking-section" className="hover:text-white transition-colors">Table Reservation</a></li>
                <li><a href="#reviews-section" className="hover:text-white transition-colors">Customer Reviews</a></li>
              </ul>
            </div>

            {/* Col 3 Categories */}
            <div>
              <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-4">Our Categories</h4>
              <ul className="space-y-2 text-stone-400 text-xs font-serif">
                <li>South Indian Breakfast</li>
                <li>Tandoori Charcoal Starters</li>
                <li>Punjabi Rich Main Course</li>
                <li>Fresh Naan & Roti Breads</li>
                <li>Traditional Indian Desserts</li>
                <li>Mango Lassi & Beverages</li>
              </ul>
            </div>

            {/* Col 4 Social & Support */}
            <div className="space-y-4">
              <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider">Join Our Newsletter</h4>
              <p className="text-stone-400 text-xs">Get special discounts, recipe insights and festival offers.</p>
              <div className="flex gap-2">
                <input 
                  type="email"
                  placeholder="Enter email"
                  className="bg-stone-800 border border-stone-700 text-white px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-amber-500 w-full"
                />
                <button 
                  onClick={() => alert('Thank you for subscribing!')}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                >
                  Join
                </button>
              </div>
            </div>

          </div>

          {/* Copyright line */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-stone-500 text-xs gap-4 text-center">
            <p>© {new Date().getFullYear()} Trimurti Pure Veg Hotel. All Rights Reserved. Designed for premium dining.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-stone-300 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-stone-300 transition-colors">Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>

      {/* Cart Right Drawer/Sidebar Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop click to close */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
          ></div>
          
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-500" />
                  <h3 className="font-serif font-black text-lg">My Plate (Order Cart)</h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Items list */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length > 0 ? (
                  cart.map((entry) => (
                    <div 
                      key={entry.item.id}
                      className="flex items-center gap-4 bg-stone-50 p-3 rounded-xl border border-stone-200/60 relative group"
                    >
                      <img 
                        src={entry.item.image} 
                        alt={entry.item.name} 
                        className="w-16 h-16 object-cover rounded-lg border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-start gap-1">
                          <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full shrink-0 mt-1 border border-emerald-500 inline-block"></span>
                          <h4 className="font-bold text-stone-900 text-sm truncate">{entry.item.name}</h4>
                        </div>
                        <p className="text-xs text-stone-400 font-mono mt-0.5">₹{entry.item.price} each</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2.5 mt-2">
                          <button 
                            onClick={() => removeFromCart(entry.item.id)}
                            className="bg-stone-200 hover:bg-stone-300 text-stone-700 p-1 rounded-full cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black font-mono">{entry.quantity}</span>
                          <button 
                            onClick={() => addToCart(entry.item)}
                            className="bg-stone-200 hover:bg-stone-300 text-stone-700 p-1 rounded-full cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Total and Trash */}
                      <div className="text-right flex flex-col justify-between h-14">
                        <button 
                          onClick={() => deleteFromCart(entry.item.id)}
                          className="text-stone-400 hover:text-red-500 self-end transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="font-bold font-mono text-sm text-stone-950">
                          ₹{entry.item.price * entry.quantity}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-700 text-sm">Your plate is empty!</h4>
                      <p className="text-stone-400 text-xs mt-1">Add some delicious pure vegetarian starters or mains to get started.</p>
                    </div>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow transition-all cursor-pointer"
                    >
                      Browse Menu
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Footer billing and coupon details */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
                  {/* Coupon Code section */}
                  <form onSubmit={applyPromoCode} className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Enter TRIMURTI20"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-white border border-stone-200 text-stone-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 w-full uppercase font-mono font-bold"
                    />
                    <button 
                      type="submit"
                      className="bg-stone-900 text-white hover:bg-amber-500 hover:text-stone-950 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>

                  {couponApplied && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-700 font-medium flex justify-between items-center">
                      <span>✓ 20% discount code active!</span>
                      <button 
                        onClick={() => {
                          setCouponApplied(false);
                          setDiscountPercent(0);
                        }}
                        className="text-emerald-700 font-extrabold hover:text-red-600 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Summary math */}
                  <div className="space-y-1.5 text-xs text-stone-600 border-b border-stone-250 pb-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono">₹{subtotal}</span>
                    </div>
                    
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Promo Discount (20%)</span>
                        <span className="font-mono">-₹{discountAmount}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>GST (5%)</span>
                      <span className="font-mono">₹{gstAmount.toFixed(1)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        Delivery & Packing 
                        {packingDeliveryFee === 0 && (
                          <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Free</span>
                        )}
                      </span>
                      <span className="font-mono">
                        {packingDeliveryFee > 0 ? `₹${packingDeliveryFee}` : '₹0'}
                      </span>
                    </div>
                  </div>

                  {/* Grand total and checkout */}
                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Grand Total</span>
                      <span className="text-2xl font-black text-stone-950 font-mono">₹{getGrandTotal()}</span>
                    </div>

                    <button 
                      onClick={handleCheckout}
                      className="bg-amber-500 hover:bg-amber-600 text-stone-950 px-6 py-3 rounded-full font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
                    >
                      <span>Checkout Order</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Simulated Live Order Tracker Modal */}
      {checkoutSuccess && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-xl w-full border border-stone-200 shadow-2xl relative text-left">
            
            {/* Modal Header */}
            <div className="bg-emerald-600 text-white p-6 flex justify-between items-start">
              <div>
                <span className="bg-emerald-700/60 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  Live Food Tracker
                </span>
                <h3 className="font-serif font-black text-xl mt-1.5">Your order is being cooked!</h3>
                <p className="text-xs text-emerald-100 mt-1">Order ID: <span className="font-mono font-bold text-amber-300">{simulatedOrderDetails?.id}</span></p>
              </div>
              <button 
                onClick={() => setCheckoutSuccess(false)}
                className="bg-emerald-700/40 hover:bg-emerald-700/80 p-1.5 rounded-full text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Estimated Delivery and Progress Tracker */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Estimated Delivery</span>
                  <span className="text-3xl font-black text-stone-900 font-mono">
                    {orderTimeLeft > 0 ? `${orderTimeLeft} mins` : 'Arrived!'}
                  </span>
                </div>
                <div className="bg-amber-100 p-3 rounded-full text-amber-600 animate-pulse">
                  <Clock className="w-7 h-7" />
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="relative pl-8 space-y-6">
                {/* Timeline vertical bar */}
                <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-stone-200"></div>

                {/* Step 1: Received */}
                <div className="relative flex gap-3 text-sm">
                  <div className={`absolute -left-[27px] w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black z-10 ${
                    orderTimelineStep >= 0 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : 'bg-white border-stone-300 text-stone-400'
                  }`}>
                    {orderTimelineStep > 0 ? '✓' : '1'}
                  </div>
                  <div>
                    <h4 className={`font-bold ${orderTimelineStep >= 0 ? 'text-emerald-700' : 'text-stone-400'}`}>Order Received & Confirmed</h4>
                    <p className="text-xs text-stone-500">Trimurti restaurant team accepted your order at {simulatedOrderDetails?.time}.</p>
                  </div>
                </div>

                {/* Step 2: Preparing */}
                <div className="relative flex gap-3 text-sm">
                  <div className={`absolute -left-[27px] w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black z-10 ${
                    orderTimelineStep >= 1 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : 'bg-white border-stone-300 text-stone-400'
                  }`}>
                    {orderTimelineStep > 1 ? '✓' : '2'}
                  </div>
                  <div>
                    <h4 className={`font-bold ${orderTimelineStep >= 1 ? 'text-emerald-700' : 'text-stone-400'}`}>Chef is preparing meal</h4>
                    <p className="text-xs text-stone-500">Our chefs are layering your food with freshly ground spice blends.</p>
                  </div>
                </div>

                {/* Step 3: Out for Delivery */}
                <div className="relative flex gap-3 text-sm">
                  <div className={`absolute -left-[27px] w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black z-10 ${
                    orderTimelineStep >= 2 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : 'bg-white border-stone-300 text-stone-400'
                  }`}>
                    {orderTimelineStep > 2 ? '✓' : '3'}
                  </div>
                  <div>
                    <h4 className={`font-bold ${orderTimelineStep >= 2 ? 'text-emerald-700' : 'text-stone-400'}`}>Out for Delivery</h4>
                    <p className="text-xs text-stone-500">Rider Rajesh Kumar has picked up your food in hot-insulated bags.</p>
                  </div>
                </div>

                {/* Step 4: Arrived */}
                <div className="relative flex gap-3 text-sm">
                  <div className={`absolute -left-[27px] w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black z-10 ${
                    orderTimelineStep >= 3 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : 'bg-white border-stone-300 text-stone-400'
                  }`}>
                    4
                  </div>
                  <div>
                    <h4 className={`font-bold ${orderTimelineStep >= 3 ? 'text-emerald-700' : 'text-stone-400'}`}>Delivered!</h4>
                    <p className="text-xs text-stone-500">Enjoy your steaming hot 100% pure Indian vegetarian feast!</p>
                  </div>
                </div>
              </div>

              {/* Rider details */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" 
                  alt="Delivery Rider Rajesh Kumar" 
                  className="w-12 h-12 rounded-full object-cover border border-stone-200 shrink-0"
                />
                <div className="flex-1 text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-stone-900 text-sm">Rajesh Kumar</h4>
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold text-[10px]">4.9 ★ (2,500+ deliveries)</span>
                  </div>
                  <p className="text-stone-500 mt-0.5">Your assigned professional delivery partner.</p>
                  
                  <div className="flex gap-2.5 mt-2.5">
                    <button 
                      onClick={() => alert('Simulating call to rider at +91 99887 76655')}
                      className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                    >
                      Call Rajesh
                    </button>
                    <button 
                      onClick={() => alert('Simulating messenger chat!')}
                      className="bg-stone-200 hover:bg-stone-300 text-stone-700 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </div>

              {/* Order items mini summary */}
              <div className="border-t border-stone-150 pt-4">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2">Order Items:</h4>
                <div className="max-h-24 overflow-y-auto space-y-1.5">
                  {simulatedOrderDetails?.items.map((entry) => (
                    <div key={entry.item.id} className="flex justify-between text-xs text-stone-600">
                      <span>{entry.item.name} <strong className="font-bold text-stone-800">×{entry.quantity}</strong></span>
                      <span className="font-mono">₹{entry.item.price * entry.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-black text-stone-950 text-sm pt-2 border-t border-stone-100 mt-2">
                  <span>Amount Paid</span>
                  <span className="font-mono">₹{simulatedOrderDetails?.total}</span>
                </div>
              </div>
            </div>

            {/* Close tracker */}
            <div className="p-4 border-t border-stone-150 bg-stone-50 text-center">
              <button 
                onClick={() => setCheckoutSuccess(false)}
                className="bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
              >
                Track in Background / Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
