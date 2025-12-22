import React from "react";

const Billing = () => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl lg:text-3xl font-bold text-dark mb-6">
        Billing Details
      </h2>

      <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-dark mb-2">
              First Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="John"
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-dark mb-2">
              Last Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Smith"
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
            />
          </div>
        </div>

        {/* Airline / Company (Optional but useful for pilots) */}
        <div className="mb-6">
          <label htmlFor="airline" className="block text-sm font-medium text-dark mb-2">
            Airline / Company (optional)
          </label>
          <input
            type="text"
            id="airline"
            name="airline"
            placeholder="e.g., Emirates, Delta Air Lines, Private Owner"
            className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
          />
          <p className="text-sm text-dark-4 mt-2">
            Helps us verify aviation-related purchases and offer pilot discounts
          </p>
        </div>

        {/* Country / Region */}
        <div className="mb-6">
          <label htmlFor="country" className="block text-sm font-medium text-dark mb-2">
            Country / Region <span className="text-red">*</span>
          </label>
          <select
            id="country"
            name="country"
            required
            className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition appearance-none bg-white"
          >
            <option value="">Select a country</option>
            <option value="AE">United Arab Emirates</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="CA">Canada</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="SA">Saudi Arabia</option>
            <option value="QA">Qatar</option>
            <option value="KW">Kuwait</option>
            {/* Add more as needed */}
            <option value="other">Other</option>
          </select>
        </div>

        {/* Street Address */}
        <div className="mb-6">
          <label htmlFor="address" className="block text-sm font-medium text-dark mb-2">
            Street Address <span className="text-red">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="House number and street name"
            required
            className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition mb-4"
          />
          <input
            type="text"
            name="address2"
            placeholder="Apartment, suite, unit, etc. (optional)"
            className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
          />
        </div>

        {/* Town / City */}
        <div className="mb-6">
          <label htmlFor="city" className="block text-sm font-medium text-dark mb-2">
            Town / City <span className="text-red">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
          />
        </div>

        {/* Phone & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-dark mb-2">
              Phone Number <span className="text-red">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="+965 1234 5678"
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
              Email Address <span className="text-red">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john@pilot.com"
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
            />
          </div>
        </div>

        {/* Create Account Checkbox */}
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            id="createAccount"
            name="createAccount"
            className="mt-1 w-5 h-5 text-blue border-gray-300 rounded focus:ring-blue"
          />
          <label htmlFor="createAccount" className="text-dark cursor-pointer">
            Create an account for faster checkout next time and to track your orders
          </label>
        </div>
      </div>
    </div>
  );
};

export default Billing;