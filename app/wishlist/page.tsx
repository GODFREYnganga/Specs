"use client"

import Link from "next/link"
import { ArrowLeft, Heart, ShoppingCart, Trash2, Eye, Filter, Grid, List, Share2, Star } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useWishlist } from "@/hooks/use-modern-wishlist"
import { useCart } from "@/hooks/use-modern-cart"
import { useToast } from "@/hooks/use-toast"

export default function WishlistPage() {
	const { items, removeItem, loading } = useWishlist()
	const { addItem } = useCart()
	const { toast } = useToast()
	const [isUpdating, setIsUpdating] = useState(false)
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
	const [sortBy, setSortBy] = useState("date-added")
	const [filterBy, setFilterBy] = useState("all")
	const handleRemoveFromWishlist = async (itemId: string) => {
		setIsUpdating(true)
		try {
			await removeItem(itemId)
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to remove item. Please try again.",
				variant: "destructive",
			})
		} finally {
			setIsUpdating(false)		}
	}
	
	const handleAddToCart = async (item: any) => {
		setIsUpdating(true)
		try {
			await addItem({
				productId: item.productId || item.id,
				name: item.name,
				price: item.price,
				color: item.color || 'Default',
				quantity: 1,
				image: item.image || "/placeholder.svg",
				category: item.category || 'eyewear',
				inStock: true
			})
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to add item to cart. Please try again.",
				variant: "destructive",
			})
		} finally {
			setIsUpdating(false)		}
	}
	
	const handleMoveToCart = async (item: any) => {
		setIsUpdating(true)
		try {
			await addItem({
				productId: item.productId || item.id,
				name: item.name,
				price: item.price,
				color: item.color || 'Default',
				quantity: 1,
				image: item.image || "/placeholder.svg",
				category: item.category || 'eyewear',
				inStock: true
			})
			await removeItem(item.id)
			toast({
				title: "Moved to cart",
				description: `${item.name} has been moved to your cart.`,
			})
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to move item. Please try again.",
				variant: "destructive",
			})
		} finally {
			setIsUpdating(false)
		}
	}
	const handleAddAllToCart = async () => {
		setIsUpdating(true)
		const itemsToMove = [...filteredWishlist]
		let successCount = 0
		let movedItems: any[] = []

		for (const item of itemsToMove) {
			try {
				await addItem({
					productId: item.productId || item.id,
					name: item.name,
					price: item.price,
					color: item.color || 'Default',
					quantity: 1,
					image: item.image || "/placeholder.svg",
					category: item.category || 'eyewear',
					inStock: true
				})
				successCount++
				movedItems.push(item)
			} catch (error) {
				// Continue
			}
		}
		
		for (const item of movedItems) {
			try {
				await removeItem(item.id)
			} catch (error) {
				// If removal fails, the item is already in the cart, which is acceptable
			}
		}

		if (successCount > 0) {
			toast({
				title: "Moved to cart",
				description: `${successCount} item(s) have been moved to your cart.`,
			})
		}

		if (successCount < itemsToMove.length) {
			toast({
				title: "Some items failed",
				description: `${itemsToMove.length - successCount} item(s) could not be moved.`,
				variant: "destructive",
			})
		}

		setIsUpdating(false)
	}

	const shareWishlist = () => {
		const wishlistUrl = `${window.location.origin}/wishlist`
		if (navigator.share) {
			navigator.share({
				title: 'My Wishlist - Spectacles Kenya',
				text: 'Check out my wishlist of amazing eyewear!',
				url: wishlistUrl,
			})
		} else {
			navigator.clipboard.writeText(wishlistUrl)
			toast({
				title: "Link copied!",
				description: "Wishlist link has been copied to clipboard.",
			})
		}
	}
	// Filter and sort wishlist
	let filteredWishlist = [...items]
	
	if (filterBy !== "all") {
		filteredWishlist = filteredWishlist.filter(item => 
			item.category?.toLowerCase().includes(filterBy) || 
			item.name.toLowerCase().includes(filterBy)
		)
	}
	
	filteredWishlist.sort((a, b) => {
		switch (sortBy) {
			case "name":
				return a.name.localeCompare(b.name)
			case "price-low":
				return a.price - b.price
			case "price-high":
				return b.price - a.price
			default:
				return 0 // date-added (maintain original order)
		}
	})

	if (loading) {
		return (
			<div className="container px-4 md:px-6 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
				</div>
			</div>
		)
	}

	return (
		<div className="container px-4 md:px-6 py-8">
			{/* Breadcrumb */}
			<Link href="/products" className="flex items-center gap-2 text-sm mb-6 hover:underline">
				<ArrowLeft className="h-4 w-4" />
				Continue Shopping
			</Link>			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold">My Wishlist</h1>				<div className="flex items-center gap-4">
					{items.length > 0 && (
						<>
							<Badge variant="secondary" className="text-sm">
								{items.length} {items.length === 1 ? 'item' : 'items'}
							</Badge>
							<Button variant="outline" size="sm" onClick={shareWishlist}>
								<Share2 className="h-4 w-4 mr-2" />
								Share
							</Button>
						</>
					)}
				</div>
			</div>

			{items.length > 0 && (
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
					<div className="flex items-center gap-4">
						<ToggleGroup 
							type="single" 
							value={viewMode} 
							onValueChange={(value) => value && setViewMode(value as "grid" | "list")}
						>
							<ToggleGroupItem value="grid" aria-label="Grid view">
								<Grid className="h-4 w-4" />
							</ToggleGroupItem>
							<ToggleGroupItem value="list" aria-label="List view">
								<List className="h-4 w-4" />
							</ToggleGroupItem>
						</ToggleGroup>

						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-40">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="date-added">Date Added</SelectItem>
								<SelectItem value="name">Name A-Z</SelectItem>
								<SelectItem value="price-low">Price: Low to High</SelectItem>
								<SelectItem value="price-high">Price: High to Low</SelectItem>
							</SelectContent>
						</Select>

						<Select value={filterBy} onValueChange={setFilterBy}>
							<SelectTrigger className="w-32">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Items</SelectItem>
								<SelectItem value="sunglasses">Sunglasses</SelectItem>
								<SelectItem value="reading">Reading</SelectItem>
								<SelectItem value="computer">Computer</SelectItem>
							</SelectContent>
						</Select>
					</div>
					
					<p className="text-sm text-muted-foreground">
						Save items you love for later or move them to your cart
					</p>
				</div>
			)}			{filteredWishlist.length > 0 ? (
				<div className="space-y-6">
					{/* Wishlist Actions */}
					<div className="flex justify-between items-center">
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={handleAddAllToCart}
								disabled={isUpdating}
							>
								<ShoppingCart className="h-4 w-4 mr-2" />
								Move All to Cart
							</Button>
						</div>
					</div>

					{/* Wishlist Grid/List */}
					<div className={
						viewMode === "grid" 
							? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
							: "space-y-4"
					}>
						{filteredWishlist.map((item) => (
							viewMode === "grid" ? (
								<Card key={`${item.id}-${item.color || 'default'}`} className="group hover:shadow-lg transition-shadow">
									<CardHeader className="p-0">
										<div className="relative aspect-square overflow-hidden rounded-t-lg">
											<img
												src={item.image || "/placeholder.svg"}
												alt={item.name}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
											/>
											<div className="absolute top-2 right-2 space-y-2">
												<Button
													variant="secondary"
													size="sm"
													className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
													asChild
												>
													<Link href={`/products/${item.productId || item.id}`}>
														<Eye className="h-4 w-4" />
													</Link>
												</Button>												<Button
													variant="secondary"
													size="sm"
													className="h-8 w-8 p-0 text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
													onClick={() => handleRemoveFromWishlist(item.id)}
													disabled={isUpdating}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
											{item.color && (
												<div className="absolute bottom-2 left-2">
													<Badge variant="secondary" className="text-xs">
														{item.color}
													</Badge>
												</div>
											)}
										</div>
									</CardHeader>
									<CardContent className="p-4">										<div className="space-y-2">
											<Link 
												href={`/products/${item.productId || item.id}`}
												className="font-medium hover:underline line-clamp-2"
											>
												{item.name}
											</Link>
											<div className="flex items-center justify-between">
												<span className="text-lg font-bold">
													KSh {(item.price / 100).toFixed(2)}
												</span>
											</div>
											{item.notes && (
												<p className="text-sm text-muted-foreground line-clamp-2">
													{item.notes}
												</p>
											)}
										</div>
									</CardContent>
									<CardFooter className="p-4 pt-0 space-y-2">
										<Button
											className="w-full"
											onClick={() => handleMoveToCart(item)}
											disabled={isUpdating}
										>
											<ShoppingCart className="h-4 w-4 mr-2" />
											Move to Cart
										</Button>
										<div className="flex gap-2 w-full">
											<Button
												variant="outline"
												className="flex-1"
												onClick={() => handleAddToCart(item)}
												disabled={isUpdating}
											>
												Add to Cart
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="px-3"
												asChild
											>
												<Link href={`/products/${item.productId || item.id}`}>
													<Eye className="h-4 w-4" />
												</Link>
											</Button>
										</div>
									</CardFooter>
								</Card>
							) : (
								<Card key={`${item.id}-${item.color || 'default'}`}>
									<CardContent className="p-4">
										<div className="flex gap-4">
											<div className="w-24 h-24 relative overflow-hidden rounded-lg border">
												<img
													src={item.image || "/placeholder.svg"}
													alt={item.name}
													className="w-full h-full object-cover"
												/>
											</div>
											<div className="flex-1 space-y-2">
												<div className="flex justify-between items-start">
													<div>
														<Link 
															href={`/products/${item.productId || item.id}`}
															className="font-medium hover:underline"
														>
															{item.name}
														</Link>
														{item.color && (
															<Badge variant="outline" className="ml-2 text-xs">
																{item.color}
															</Badge>
														)}
													</div>
													<span className="text-lg font-bold">
														KSh {(item.price / 100).toFixed(2)}
													</span>
												</div>												{item.notes && (
													<p className="text-sm text-muted-foreground line-clamp-1">
														{item.notes}
													</p>
												)}
												<div className="flex gap-2 pt-2">
													<Button
														size="sm"
														onClick={() => handleMoveToCart(item)}
														disabled={isUpdating}
													>
														<ShoppingCart className="h-4 w-4 mr-2" />
														Move to Cart
													</Button>
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleAddToCart(item)}
														disabled={isUpdating}
													>
														Add to Cart
													</Button>
													<Button
														variant="outline"
														size="sm"
														asChild
													>
														<Link href={`/products/${item.productId || item.id}`}>
															<Eye className="h-4 w-4" />
														</Link>
													</Button>													<Button
														variant="outline"
														size="sm"
														onClick={() => handleRemoveFromWishlist(item.id)}
														disabled={isUpdating}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							)
						))}
					</div>

					{/* Related Products or Recommendations */}
					<div className="mt-12">
						<Card>
							<CardHeader>
								<CardTitle>You might also like</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-center py-8">
									<p className="text-muted-foreground mb-4">
										Discover more products similar to your wishlist items
									</p>
									<Button asChild variant="outline">
										<Link href="/products">
											Browse All Products
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			) : (
				<Card className="text-center py-12">
					<CardContent>
						<Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
						<h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
						<p className="text-muted-foreground mb-6">
							Save your favorite items by clicking the heart icon on any product.
						</p>
						<Button asChild size="lg">
							<Link href="/products">
								Start Shopping
							</Link>
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	)
}