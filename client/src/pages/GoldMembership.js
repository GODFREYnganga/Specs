"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import "./GoldMembership.css"

function GoldMembershipPage() {
  const [expandedFaq, setExpandedFaq] = useState(null)

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "What is Lens2Cart Gold Membership?",
      answer:
        "Lens2Cart Gold Membership is our premium loyalty program designed to provide exclusive benefits, discounts, and priority services to our most valued customers. Members enjoy special pricing on all products, early access to new collections, and personalized eyewear consultations.",
    },
    {
      question: "How much does the Gold Membership cost?",
      answer:
        "The Gold Membership is available for an annual fee of $99. This fee is quickly offset by the savings you'll enjoy on purchases throughout the year, making it an excellent value for regular customers.",
    },
    {
      question: "What benefits do I get with the Gold Membership?",
      answer:
        "Gold Members receive 15% off all regular-priced items, free shipping on all orders, exclusive access to limited edition frames, priority customer service, free annual eye exams, and special birthday offers. Members also receive invitations to VIP events and early access to sales.",
    },
    {
      question: "How do I sign up for the Gold Membership?",
      answer:
        "You can sign up for Gold Membership online through your account dashboard, in-store at any Lens2Cart location, or by contacting our customer service team. The membership is activated immediately upon payment.",
    },
    {
      question: "How do I use the Gold Membership discount?",
      answer:
        "Your discount is automatically applied when you're logged into your account while shopping online. In-store, simply inform the sales associate that you're a Gold Member and provide your membership ID or the phone number associated with your account.",
    },
    {
      question: "Is the discount applicable to all products?",
      answer:
        "The Gold Membership discount applies to all regular-priced items. Some exclusions may apply to already discounted items, special promotions, or select designer brands. These exclusions will be clearly marked.",
    },
    {
      question: "Can I cancel my Gold Membership?",
      answer:
        "Yes, you can cancel your Gold Membership at any time. However, the membership fee is non-refundable. Your benefits will continue until the end of your current membership period.",
    },
    {
      question: "Does the Gold Membership renew automatically?",
      answer:
        "Yes, your Gold Membership will automatically renew on your anniversary date. We'll send you a reminder email 30 days before renewal. You can manage your renewal preferences in your account settings at any time.",
    },
  ]

  return (
    <div className="gold-membership min-h-screen pt-160 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            <span className="gold-membership-border border-b-4 pb-2">FAQS</span>
          </h1>

          <ul className="space-y-4 mb-16">
            {faqs.map((faq, index) => (
              <li
                key={index}
                className="gold-membership bg-black gold-membership-border border rounded-lg overflow-hidden transition-all duration-300"
              >
                <button
                  className="w-full p-6 flex justify-between items-center text-left hover:bg-black/30 transition-colors"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={expandedFaq === index}
                >
                  <h3 className="text-xl font-semibold">{faq.question}</h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 flex-shrink-0 gold-membership-border" />
                  ) : (
                    <ChevronDown className="h-5 w-5 flex-shrink-0 gold-membership-border" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 pt-0 gold-membership-border border-t border-opacity-30">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="gold-membership gold-membership-border border-2 rounded-lg overflow-hidden max-w-md mx-auto">
            <div className="gold-membership-button py-3 px-4 text-center font-bold text-xl">1 Year Gold Membership</div>
            <div className="p-6 text-center">
              <p className="mb-4 text-lg">Enjoy exclusive benefits and savings with our premium membership program.</p>
              <ul className="text-left mb-6 space-y-2">
                <li>• 15% off all regular-priced items</li>
                <li>• Free shipping on all orders</li>
                <li>• Priority customer service</li>
                <li>• Free annual eye exam</li>
                <li>• Early access to new collections</li>
              </ul>
              <div className="text-2xl font-bold mb-6">$99/year</div>
              <button className="gold-membership-button border-none w-full py-6 text-lg">Add Gold Membership</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoldMembershipPage
