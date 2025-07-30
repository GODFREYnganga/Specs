"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle, Lock, MapPin, User, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCart } from '@/hooks/use-modern-cart'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

interface ShippingOption {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
  isDefault?: boolean
}

interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  isDefault?: boolean
}

interface StoreSettings {
  currency: string
  taxRate: number
  freeShippingThreshold: number
  shippingFlat: number
  allowGuestCheckout: boolean
  requirePhoneNumber: boolean
  acceptedPaymentMethods: string[]
}

export default function ModernCheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  
  const { 
    items, 
    totals, 
    appliedCoupon, 
    clearCart
  } = useCart()

  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping')
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null)

  const [formData, setFormData] = useState({
    // Contact Information
    email: '',
    phone: '',
    
    // Shipping Address
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Kenya',
    
    // Shipping Method
    shippingMethod: '',
      // Payment Information
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    mpesaPhone: '', // Add M-Pesa phone number field
    
    // Billing Address
    billingAddressSameAsShipping: true,
    billingFirstName: '',
    billingLastName: '',
    billingCompany: '',
    billingAddress: '',
    billingApartment: '',
    billingCity: '',
    billingState: '',
    billingPostalCode: '',
    billingCountry: 'Kenya',
    
    // Additional Options
    saveInfo: false,
    subscribeNewsletter: false,
    specialInstructions: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Check authentication on mount
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to continue with checkout.',
        variant: 'destructive'
      })
      router.push('/login?redirect=/checkout/modern')
      return
    }
    
    // Pre-fill form with user data if available
    if (user && isAuthenticated) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      }))
    }
  }, [authLoading, isAuthenticated, user, router, toast])

  // Load store settings and shipping options
  useEffect(() => {
    if (isAuthenticated) {
      loadInitialData()
    }
  }, [isAuthenticated])

  // Recalculate totals when shipping method changes
  useEffect(() => {    if (formData.shippingMethod) {
      const selectedShipping = shippingOptions.find(option => option.id === formData.shippingMethod)
      if (selectedShipping) {
        // Shipping method is already handled by the totals calculation
        console.log('Selected shipping:', selectedShipping)
      }
    }
  }, [formData.shippingMethod, shippingOptions])

  const loadInitialData = async () => {
    setIsLoading(true)
    try {
      // Load store settings
      const settingsResponse = await fetch('/api/settings')
      if (settingsResponse.ok) {
        const settings = await settingsResponse.json()
        setStoreSettings(settings)
      }

      // Load shipping options
      const shippingResponse = await fetch('/api/shipping/options')
      if (shippingResponse.ok) {
        const options = await shippingResponse.json()
        setShippingOptions(options)
        
        // Set default shipping method
        const defaultOption = options.find((opt: ShippingOption) => opt.isDefault) || options[0]
        if (defaultOption) {
          setFormData(prev => ({ ...prev, shippingMethod: defaultOption.id }))
        }
      }
    } catch (error) {
      console.error('Error loading checkout data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load checkout information. Please refresh and try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (currentStep: string): boolean => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 'shipping') {
      if (!formData.email) newErrors.email = 'Email is required'
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
      if (!formData.address) newErrors.address = 'Address is required'
      if (!formData.city) newErrors.city = 'City is required'
      if (!formData.postalCode) newErrors.postalCode = 'Postal code is required'
      if (!formData.shippingMethod) newErrors.shippingMethod = 'Please select a shipping method'
      
      if (storeSettings?.requirePhoneNumber && !formData.phone) {
        newErrors.phone = 'Phone number is required'
      }
    }    if (currentStep === 'payment') {
      if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required'
        if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required'
        if (!formData.cvv) newErrors.cvv = 'CVV is required'
        if (!formData.cardName) newErrors.cardName = 'Cardholder name is required'
      } else if (formData.paymentMethod === 'mpesa') {
        if (!formData.mpesaPhone) {
          newErrors.mpesaPhone = 'M-Pesa phone number is required'
        } else if (!/^254\d{9}$/.test(formData.mpesaPhone.replace(/\s/g, ''))) {
          newErrors.mpesaPhone = 'Please enter a valid Kenyan phone number (e.g., 254712345678)'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStepForward = () => {
    if (!validateStep(step)) return

    if (step === 'shipping') {
      setStep('payment')
    } else if (step === 'payment') {
      setStep('review')
    }
  }

  const handleStepBack = () => {
    if (step === 'payment') {
      setStep('shipping')
    } else if (step === 'review') {
      setStep('payment')
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }
  const handlePlaceOrder = async () => {
    if (!validateStep('payment')) return

    setIsProcessing(true)
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item.color,
          variant: item.variant,
          size: item.size
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        billingAddress: formData.billingAddressSameAsShipping ? null : {
          firstName: formData.billingFirstName,
          lastName: formData.billingLastName,
          company: formData.billingCompany,
          address: formData.billingAddress,
          apartment: formData.billingApartment,
          city: formData.billingCity,
          state: formData.billingState,
          postalCode: formData.billingPostalCode,
          country: formData.billingCountry
        },
        shippingMethod: formData.shippingMethod,
        paymentMethod: {
          type: formData.paymentMethod,
          ...(formData.paymentMethod === 'card' && {
            cardNumber: formData.cardNumber.replace(/\s/g, ''),
            expiryDate: formData.expiryDate,
            cvv: formData.cvv,
            cardName: formData.cardName
          }),
          ...(formData.paymentMethod === 'mpesa' && {
            phoneNumber: formData.mpesaPhone
          })
        },
        totals: totals,
        appliedCoupon: appliedCoupon,
        specialInstructions: formData.specialInstructions,
        subscribeNewsletter: formData.subscribeNewsletter
      }      // Create the order first
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create order')
      }

      const order = await response.json()
      
      // If payment method is M-Pesa, initiate STK Push
      if (formData.paymentMethod === 'mpesa') {
        const mpesaResponse = await fetch('/api/mpesa/initiate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: formData.mpesaPhone,
            amount: totals.total,
            orderId: order._id
          })
        })

        const mpesaResult = await mpesaResponse.json()
        
        if (mpesaResponse.ok && mpesaResult.success) {
          toast({
            title: 'M-Pesa payment initiated',
            description: 'Please check your phone and enter your M-Pesa PIN to complete the payment.'
          })
          
          // Clear cart after initiating M-Pesa payment
          await clearCart()
          
          // Redirect to payment status page
          router.push(`/orders/${order._id}/payment-status?checkoutRequestId=${mpesaResult.data.CheckoutRequestID}`)
        } else {
          throw new Error(mpesaResult.message || 'Failed to initiate M-Pesa payment')
        }
      } else {
        // For other payment methods, proceed normally
        await clearCart()
        
        toast({
          title: 'Order placed successfully!',
          description: `Your order #${order.orderNumber} has been confirmed.`
        })

        router.push(`/orders/${order._id}/confirmation`)
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast({
        title: 'Order failed',
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: <CreditCard className="h-5 w-5" />,
      isDefault: true
    },
    {
      id: 'mpesa',
      name: 'M-Pesa',
      description: 'Pay with your mobile money',
      icon: <Phone className="h-5 w-5" />
    }
  ]

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">
              Add some items to your cart before checking out.
            </p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/cart/modern" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          
          <h1 className="text-3xl font-bold">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-6">
            {[
              { id: 'shipping', label: 'Shipping', icon: Truck },
              { id: 'payment', label: 'Payment', icon: CreditCard },
              { id: 'review', label: 'Review', icon: CheckCircle }
            ].map((stepItem, index) => {
              const isActive = step === stepItem.id
              const isCompleted = 
                (step === 'payment' && stepItem.id === 'shipping') ||
                (step === 'review' && (stepItem.id === 'shipping' || stepItem.id === 'payment'))
              
              return (
                <div key={stepItem.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                    ${isActive || isCompleted 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : 'border-muted bg-background text-muted-foreground'
                    }
                  `}>
                    <stepItem.icon className="h-5 w-5" />
                  </div>
                  <span className={`ml-3 font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {stepItem.label}
                  </span>
                  {index < 2 && (
                    <div className={`
                      w-8 h-0.5 mx-4 transition-colors
                      ${isCompleted ? 'bg-primary' : 'bg-muted'}
                    `} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Shipping Information */}
            {step === 'shipping' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact & Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Contact Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your@email.com"
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">
                          Phone Number {storeSettings?.requirePhoneNumber && '*'}
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+254 700 000 000"
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Shipping Address */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Shipping Address
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={errors.firstName ? 'border-red-500' : ''}
                        />
                        {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={errors.lastName ? 'border-red-500' : ''}
                        />
                        {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="123 Main Street"
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="apartment">Apartment, suite, etc. (Optional)</Label>
                      <Input
                        id="apartment"
                        value={formData.apartment}
                        onChange={(e) => handleInputChange('apartment', e.target.value)}
                        placeholder="Apartment, suite, unit, building, floor, etc."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={errors.city ? 'border-red-500' : ''}
                        />
                        {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="state">State/County</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          className={errors.postalCode ? 'border-red-500' : ''}
                        />
                        {errors.postalCode && <p className="text-sm text-red-500 mt-1">{errors.postalCode}</p>}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Shipping Method */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Shipping Method
                    </h3>
                    
                    <RadioGroup 
                      value={formData.shippingMethod} 
                      onValueChange={(value) => handleInputChange('shippingMethod', value)}
                      className="space-y-3"
                    >
                      {shippingOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <div className="flex-1">
                            <Label htmlFor={option.id} className="flex items-center justify-between cursor-pointer">
                              <div>
                                <div className="font-medium">{option.name}</div>
                                <div className="text-sm text-muted-foreground">{option.description}</div>
                                <div className="text-sm text-muted-foreground">{option.estimatedDays}</div>
                              </div>
                              <div className="font-semibold">
                                {option.price === 0 ? 'Free' : `${storeSettings?.currency || 'KSh'} ${(option.price / 100).toFixed(2)}`}
                              </div>
                            </Label>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.shippingMethod && <p className="text-sm text-red-500">{errors.shippingMethod}</p>}
                  </div>

                  {/* Additional Options */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="saveInfo"
                        checked={formData.saveInfo}
                        onCheckedChange={(checked) => handleInputChange('saveInfo', checked ? 'true' : 'false')}
                      />
                      <Label htmlFor="saveInfo" className="text-sm">
                        Save this information for next time
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="subscribeNewsletter"
                        checked={formData.subscribeNewsletter}
                        onCheckedChange={(checked) => handleInputChange('subscribeNewsletter', checked ? 'true' : 'false')}
                      />
                      <Label htmlFor="subscribeNewsletter" className="text-sm">
                        Subscribe to our newsletter for exclusive offers
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Information */}
            {step === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Method Selection */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Payment Method</h3>
                    
                    <RadioGroup 
                      value={formData.paymentMethod} 
                      onValueChange={(value) => handleInputChange('paymentMethod', value)}
                      className="space-y-3"
                    >
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <div className="flex-1">
                            <Label htmlFor={method.id} className="flex items-center gap-3 cursor-pointer">
                              {method.icon}
                              <div>
                                <div className="font-medium">{method.name}</div>
                                <div className="text-sm text-muted-foreground">{method.description}</div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>                  {/* Card Details */}
                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={errors.cardNumber ? 'border-red-500' : ''}
                        />
                        {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={errors.expiryDate ? 'border-red-500' : ''}
                          />
                          {errors.expiryDate && <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>}
                        </div>
                        
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                            placeholder="123"
                            maxLength={4}
                            className={errors.cvv ? 'border-red-500' : ''}
                          />
                          {errors.cvv && <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="cardName">Cardholder Name *</Label>
                        <Input
                          id="cardName"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange('cardName', e.target.value)}
                          placeholder="John Doe"
                          className={errors.cardName ? 'border-red-500' : ''}
                        />
                        {errors.cardName && <p className="text-sm text-red-500 mt-1">{errors.cardName}</p>}
                      </div>
                    </div>
                  )}

                  {/* M-Pesa Details */}
                  {formData.paymentMethod === 'mpesa' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 mb-2">
                          <Phone className="h-4 w-4" />
                          <span className="font-medium">M-Pesa Payment</span>
                        </div>
                        <p className="text-sm text-green-600">
                          You will receive an STK push notification on your phone to complete the payment.
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="mpesaPhone">M-Pesa Phone Number *</Label>
                        <Input
                          id="mpesaPhone"
                          value={formData.mpesaPhone}
                          onChange={(e) => {
                            // Format phone number as user types
                            let value = e.target.value.replace(/\D/g, '')
                            if (value.length <= 12) {
                              if (value.startsWith('0')) {
                                value = '254' + value.slice(1)
                              } else if (!value.startsWith('254')) {
                                value = '254' + value
                              }
                              handleInputChange('mpesaPhone', value)
                            }
                          }}
                          placeholder="254712345678"
                          className={errors.mpesaPhone ? 'border-red-500' : ''}
                        />
                        {errors.mpesaPhone && <p className="text-sm text-red-500 mt-1">{errors.mpesaPhone}</p>}
                        <p className="text-xs text-gray-500 mt-1">
                          Enter your phone number in format: 254712345678
                        </p>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Billing Address */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Billing Address</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="billingAddressSameAsShipping"
                        checked={formData.billingAddressSameAsShipping}
                        onCheckedChange={(checked) => handleInputChange('billingAddressSameAsShipping', checked ? 'true' : 'false')}
                      />
                      <Label htmlFor="billingAddressSameAsShipping" className="text-sm">
                        Same as shipping address
                      </Label>
                    </div>

                    {!formData.billingAddressSameAsShipping && (
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="billingFirstName">First Name *</Label>
                            <Input
                              id="billingFirstName"
                              value={formData.billingFirstName}
                              onChange={(e) => handleInputChange('billingFirstName', e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="billingLastName">Last Name *</Label>
                            <Input
                              id="billingLastName"
                              value={formData.billingLastName}
                              onChange={(e) => handleInputChange('billingLastName', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="billingAddress">Street Address *</Label>
                          <Input
                            id="billingAddress"
                            value={formData.billingAddress}
                            onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="billingCity">City *</Label>
                            <Input
                              id="billingCity"
                              value={formData.billingCity}
                              onChange={(e) => handleInputChange('billingCity', e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="billingState">State/County</Label>
                            <Input
                              id="billingState"
                              value={formData.billingState}
                              onChange={(e) => handleInputChange('billingState', e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="billingPostalCode">Postal Code *</Label>
                            <Input
                              id="billingPostalCode"
                              value={formData.billingPostalCode}
                              onChange={(e) => handleInputChange('billingPostalCode', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Review */}
            {step === 'review' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Review Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Items */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.color}-${item.variant}`} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.image || '/placeholder.svg'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            {item.color && <div>Color: {item.color}</div>}
                            {item.variant && <div>Variant: {item.variant}</div>}
                            {item.size && <div>Size: {item.size}</div>}
                            <div>Quantity: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {storeSettings?.currency || 'KSh'} {((item.price * item.quantity) / 100).toFixed(2)}
                          </div>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <div className="text-sm text-muted-foreground line-through">
                              {storeSettings?.currency || 'KSh'} {((item.originalPrice * item.quantity) / 100).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Order Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{storeSettings?.currency || 'KSh'} {(totals?.subtotal / 100 || 0).toFixed(2)}</span>
                    </div>
                    
                    {totals?.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount {appliedCoupon && `(${appliedCoupon.code})`}</span>
                        <span>-{storeSettings?.currency || 'KSh'} {(totals.discount / 100).toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {totals?.shipping === 0 ? 'Free' : `${storeSettings?.currency || 'KSh'} ${(totals?.shipping / 100 || 0).toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{storeSettings?.currency || 'KSh'} {(totals?.tax / 100 || 0).toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{storeSettings?.currency || 'KSh'} {(totals?.total / 100 || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Special Instructions */}
                  <div>
                    <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                    <Input
                      id="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                      placeholder="Any special delivery instructions..."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleStepBack}
                disabled={step === 'shipping'}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              {step !== 'review' ? (
                <Button onClick={handleStepForward}>
                  Continue
                </Button>
              ) : (
                <Button 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="min-w-32"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-4 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.color}-${item.variant}`} className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.image || '/placeholder.svg'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {item.quantity}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.color} {item.variant && `• ${item.variant}`} {item.size && `• ${item.size}`}
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {storeSettings?.currency || 'KSh'} {((item.price * item.quantity) / 100).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{storeSettings?.currency || 'KSh'} {(totals?.subtotal / 100 || 0).toFixed(2)}</span>
                  </div>
                  
                  {totals?.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{storeSettings?.currency || 'KSh'} {(totals.discount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {totals?.shipping === 0 ? 'Free' : `${storeSettings?.currency || 'KSh'} ${(totals?.shipping / 100 || 0).toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{storeSettings?.currency || 'KSh'} {(totals?.tax / 100 || 0).toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{storeSettings?.currency || 'KSh'} {(totals?.total / 100 || 0).toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4">
                  <Shield className="h-4 w-4" />
                  <span>Secure SSL Encrypted Checkout</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
