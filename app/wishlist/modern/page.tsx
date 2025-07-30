"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  Star,
  Share2,
  Filter,
  SortAsc,
  Eye,
  Tag,
  Package,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useWishlist } from '@/hooks/use-modern-wishlist'
import { useCart } from '@/hooks/use-modern-cart'

export default function ModernWishlistPage() {
  const { 
    items, 
    loading, 
    removeItem, 
    moveToCart, 
    moveAllToCart, 
    clearWishlist,
    updateItemPriority,
    updateItemNotes,
    shareWishlist,
    getWishlistStats
  } = useWishlist()
  const { addItem: addToCart } = useCart()
  const { toast } = useToast()
  
  const [sortBy, setSortBy] = useState('added_date')
  const [filterBy, setFilterBy] = useState('all')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [correctedImages, setCorrectedImages] = useState<{[key: string]: string}>({})

  // Image loading function
  const findCorrectImagePath = async (imagePath: string): Promise<string> => {
    try {
      const response = await fetch(`/api/images/find?path=${encodeURIComponent(imagePath)}`)
      const data = await response.json()
      return data.found ? data.correctedPath : "/placeholder.svg"
    } catch (error) {
      console.error('Error finding image path:', error)
      return "/placeholder.svg"
    }
  }

  // Load correct image paths for all items
  useEffect(() => {
    const loadImages = async () => {
      const imageMap: {[key: string]: string} = {}
      
      for (const item of items) {
        if (item.image && !correctedImages[item.id]) {
          const correctedPath = await findCorrectImagePath(item.image)
          imageMap[item.id] = correctedPath
        }
      }
      
      if (Object.keys(imageMap).length > 0) {
        setCorrectedImages(prev => ({ ...prev, ...imageMap }))
      }
    }

    if (items.length > 0) {
      loadImages()
    }
  }, [items, correctedImages])

  const stats = getWishlistStats()

  // Sort and filter items
  const filteredAndSortedItems = items
    .filter(item => {
      switch (filterBy) {
        case 'in_stock':
          return item.inStock
        case 'out_of_stock':
          return !item.inStock
        case 'high_priority':
          return item.priority === 'high'
        case 'on_sale':
          return item.discount && item.discount > 0
        default:
          return true
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price
        case 'price_high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2)
        default: // 'added_date'
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      }
    })

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId)
      setSelectedItems(prev => {
        const updated = new Set(prev)
        updated.delete(itemId)
        return updated
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove item from wishlist',
        variant: 'destructive'
      })
    }
  }

  const handleMoveToCart = async (itemId: string) => {
    try {
      await moveToCart(itemId)
      setSelectedItems(prev => {
        const updated = new Set(prev)
        updated.delete(itemId)
        return updated
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to move item to cart',
        variant: 'destructive'
      })
    }
  }

  const handleMoveAllToCart = async () => {
    try {
      await moveAllToCart()
      setSelectedItems(new Set())
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to move items to cart',
        variant: 'destructive'
      })
    }
  }

  const handleClearWishlist = async () => {
    try {
      await clearWishlist()
      setSelectedItems(new Set())
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear wishlist',
        variant: 'destructive'
      })
    }
  }

  const handleShareWishlist = async () => {
    try {
      const shareUrl = await shareWishlist()
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: 'Link copied!',
        description: 'Wishlist share link copied to clipboard'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate share link',
        variant: 'destructive'
      })
    }
  }

  const handleUpdatePriority = async (itemId: string, priority: 'low' | 'medium' | 'high') => {
    try {
      await updateItemPriority(itemId, priority)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update priority',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateNotes = async (itemId: string) => {
    try {
      await updateItemNotes(itemId, noteText)
      setEditingNotes(null)
      setNoteText('')
      toast({
        title: 'Notes updated',
        description: 'Item notes have been saved'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notes',
        variant: 'destructive'
      })
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'low':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  const isEmpty = items.length === 0
  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link 
            href="/products" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-3 sm:mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h1>
              {!isEmpty && (
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  {stats.totalItems} {stats.totalItems === 1 ? 'item' : 'items'} • 
                  Total value: KSh {(stats.totalValue / 100).toFixed(2)}
                </p>
              )}
            </div>
            
            {!isEmpty && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2">
                <Button
                  variant="outline"
                  onClick={handleShareWishlist}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                  size="sm"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  onClick={handleMoveAllToCart}
                  className="text-green-600 hover:text-green-700 text-sm"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add All to Cart</span>
                  <span className="sm:hidden">Add All</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearWishlist}
                  className="text-red-600 hover:text-red-700 text-sm"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Clear All</span>
                  <span className="sm:hidden">Clear</span>
                </Button>
              </div>
            )}
          </div>
        </div>        {isEmpty ? (
          <div className="text-center py-12 sm:py-16">
            <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 text-gray-400 mb-4 sm:mb-6">
              <Heart className="h-full w-full" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base px-4">
              Save items you love to buy them later. Just click the heart icon on any product.
            </p>
            <Button asChild size="lg">
              <Link href="/products">
                Explore Products
              </Link>
            </Button>
          </div>
        ) : (          <div>
            {/* Filters and Stats */}
            <div className="mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-lg shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{stats.totalItems}</div>
                    <div className="text-gray-500 text-xs sm:text-sm">Total Items</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{stats.inStockCount}</div>
                    <div className="text-gray-500 text-xs sm:text-sm">In Stock</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{stats.outOfStockCount}</div>
                    <div className="text-gray-500 text-xs sm:text-sm">Out of Stock</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">KSh {(stats.averagePrice / 100).toFixed(0)}</div>
                    <div className="text-gray-500 text-xs sm:text-sm">Avg. Price</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2">
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-full sm:w-[140px] text-sm">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      <SelectItem value="high_priority">High Priority</SelectItem>
                      <SelectItem value="on_sale">On Sale</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[140px] text-sm">
                      <SortAsc className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="added_date">Date Added</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price_low">Price: Low to High</SelectItem>
                      <SelectItem value="price_high">Price: High to Low</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">              {filteredAndSortedItems.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <Image
                        src={correctedImages[item.id] || item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => {
                          // Fallback to placeholder if image fails to load
                          setCorrectedImages(prev => ({ ...prev, [item.id]: "/placeholder.svg" }))
                        }}
                      />
                      
                      {/* Priority Badge */}
                      {item.priority && item.priority !== 'medium' && (
                        <Badge className={`absolute top-1 sm:top-2 left-1 sm:left-2 text-xs ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </Badge>
                      )}

                      {/* Discount Badge */}
                      {item.discount && item.discount > 0 && (
                        <Badge variant="destructive" className="absolute top-1 sm:top-2 right-1 sm:right-2 text-xs">
                          -{item.discount}%
                        </Badge>
                      )}

                      {/* Stock Status */}
                      <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2">
                        {item.inStock ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                            <span className="hidden sm:inline">In Stock</span>
                            <span className="sm:hidden">In</span>
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                            <Clock className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                            <span className="hidden sm:inline">Out of Stock</span>
                            <span className="sm:hidden">Out</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-2 sm:space-y-3">
                      {/* Product Info */}
                      <div>
                        <h3 className="font-medium text-gray-900 line-clamp-2 text-sm sm:text-base leading-tight">
                          <Link href={`/products/${item.productId}`} className="hover:underline">
                            {item.name}
                          </Link>
                        </h3>
                        <div className="mt-1 text-xs sm:text-sm text-gray-500">
                          Color: {item.color}
                          {item.size && ` • Size: ${item.size}`}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-2">
                        <span className="text-base sm:text-lg font-semibold text-gray-900">
                          KSh {(item.price / 100).toFixed(2)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-xs sm:text-sm text-gray-500 line-through">
                            KSh {(item.originalPrice / 100).toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Priority Selector */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Priority:</span>
                        <Select 
                          value={item.priority || 'medium'} 
                          onValueChange={(value) => handleUpdatePriority(item.id, value as any)}
                        >
                          <SelectTrigger className="h-6 text-xs w-16 sm:w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Med</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Notes */}
                      {item.notes && (
                        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded line-clamp-2">
                          {item.notes}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="space-y-2">
                        <Button
                          className="w-full text-sm"
                          size="sm"
                          onClick={() => handleMoveToCart(item.id)}
                          disabled={!item.inStock}
                        >
                          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Add to Cart
                        </Button>
                        
                        <div className="flex space-x-1 sm:space-x-2">
                          <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
                            <Link href={`/products/${item.productId}`}>
                              <Eye className="h-3 w-3 mr-1" />
                              <span className="hidden sm:inline">View</span>
                              <span className="sm:hidden">View</span>
                            </Link>
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex-1 text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">Note</span>
                                <span className="sm:hidden">Note</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="mx-4 sm:mx-0">
                              <DialogHeader>
                                <DialogTitle className="text-base sm:text-lg">Add Note</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Textarea
                                  placeholder="Add a note about this item..."
                                  value={noteText}
                                  onChange={(e) => setNoteText(e.target.value)}
                                  defaultValue={item.notes || ''}
                                  className="text-sm"
                                />
                                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingNotes(null)
                                      setNoteText('')
                                    }}
                                    className="text-sm"
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={() => handleUpdateNotes(item.id)}
                                    size="sm"
                                    className="text-sm"
                                  >
                                    Save Note
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700 px-2"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Added Date */}
                      <div className="text-xs text-gray-400 text-center pt-2 border-t">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>            {/* No items found after filtering */}
            {filteredAndSortedItems.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 text-sm sm:text-base px-4">Try adjusting your filters to see more items.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
