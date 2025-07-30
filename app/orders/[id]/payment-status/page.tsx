"use client"

import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, Smartphone, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed' | 'timeout'
  message: string
  transactionId?: string
  amount?: number
  phoneNumber?: string
}

export default function PaymentStatusPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const orderId = params.id as string
  const checkoutRequestId = searchParams.get('checkoutRequestId')
  
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: 'pending',
    message: 'Waiting for payment confirmation...'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [countdown, setCountdown] = useState(300) // 5 minutes timeout

  useEffect(() => {
    if (!checkoutRequestId) {
      setPaymentStatus({
        status: 'failed',
        message: 'Invalid payment request. Please try again.'
      })
      setIsLoading(false)
      return
    }

    checkPaymentStatus()
    
    // Check payment status every 5 seconds
    const interval = setInterval(checkPaymentStatus, 5000)
    
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setPaymentStatus({
            status: 'timeout',
            message: 'Payment request has timed out. Please try again.'
          })
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(countdownInterval)
    }
  }, [checkoutRequestId])

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/mpesa/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkoutRequestId,
          orderId
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        setPaymentStatus(result)
        
        if (result.status === 'completed') {
          toast({
            title: 'Payment successful!',
            description: 'Your M-Pesa payment has been confirmed.'
          })
          
          // Redirect to order confirmation after a short delay
          setTimeout(() => {
            router.push(`/orders/${orderId}/confirmation`)
          }, 2000)
        } else if (result.status === 'failed') {
          toast({
            title: 'Payment failed',
            description: result.message || 'Your M-Pesa payment was not successful.',
            variant: 'destructive'
          })
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusIcon = () => {
    switch (paymentStatus.status) {
      case 'pending':
        return <Clock className="h-12 w-12 text-yellow-500 animate-pulse" />
      case 'completed':
        return <CheckCircle className="h-12 w-12 text-green-500" />
      case 'failed':
      case 'timeout':
        return <XCircle className="h-12 w-12 text-red-500" />
    }
  }

  const getStatusColor = () => {
    switch (paymentStatus.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'failed':
      case 'timeout':
        return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/checkout/modern">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Checkout
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Payment Status</h1>
        </div>

        {/* Payment Status Card */}
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <CardTitle className="text-2xl">
              {paymentStatus.status === 'pending' && 'Processing Payment'}
              {paymentStatus.status === 'completed' && 'Payment Successful'}
              {paymentStatus.status === 'failed' && 'Payment Failed'}
              {paymentStatus.status === 'timeout' && 'Payment Timeout'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Status Badge */}
            <Badge className={`text-sm px-3 py-1 border ${getStatusColor()}`}>
              {paymentStatus.status.charAt(0).toUpperCase() + paymentStatus.status.slice(1)}
            </Badge>

            {/* Status Message */}
            <p className="text-gray-600 text-lg">
              {paymentStatus.message}
            </p>

            {/* M-Pesa Instructions for Pending */}
            {paymentStatus.status === 'pending' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
                  <Smartphone className="h-5 w-5" />
                  <span className="font-medium">Check your phone</span>
                </div>
                <p className="text-sm text-green-600">
                  An STK push notification has been sent to your phone. 
                  Please enter your M-Pesa PIN to complete the payment.
                </p>
              </div>
            )}

            {/* Countdown Timer */}
            {paymentStatus.status === 'pending' && countdown > 0 && (
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Request expires in: <span className="font-mono font-medium">{formatTime(countdown)}</span>
                </p>
              </div>
            )}

            {/* Payment Details */}
            {paymentStatus.amount && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Payment Details</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">KSh {paymentStatus.amount.toLocaleString()}</span>
                  </div>
                  {paymentStatus.phoneNumber && (
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span className="font-medium">{paymentStatus.phoneNumber}</span>
                    </div>
                  )}
                  {paymentStatus.transactionId && (
                    <div className="flex justify-between">
                      <span>Transaction ID:</span>
                      <span className="font-mono text-xs">{paymentStatus.transactionId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              {paymentStatus.status === 'pending' && (
                <Button 
                  variant="outline" 
                  onClick={checkPaymentStatus}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Check Status
                </Button>
              )}
              
              {paymentStatus.status === 'completed' && (
                <Button asChild>
                  <Link href={`/orders/${orderId}/confirmation`}>
                    View Order Details
                  </Link>
                </Button>
              )}
              
              {(paymentStatus.status === 'failed' || paymentStatus.status === 'timeout') && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline"
                    asChild
                  >
                    <Link href="/checkout/modern">
                      Try Again
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/contact">
                      Contact Support
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Having trouble with your payment? {' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
