"use client"

import { useState } from "react"
import { X, ArrowLeft, ArrowRight, Glasses, Sun, Eye, Layers, Frame, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function LensSelectionPopup({
    isOpen,
    onClose,
    framePrice
}: {
    isOpen: boolean
    onClose: () => void
    framePrice: number
}) {
    const [currentView, setCurrentView] = useState<
        "main" | "package" | "eye-power" | "package-detail" |
        "single-vision-package" | "lens-thickness" | "bifocal-package" | "progressive-package" | "progressive-corridor"
    >("main");
    const [selectedLens, setSelectedLens] = useState("")
    const [selectedPackage, setSelectedPackage] = useState<any>(null)
    const [selectedThickness, setSelectedThickness] = useState<any>(null)

    const lensThicknessOptions = [
        {
            id: "normal",
            title: "Normal with 1.56 index",
            price: 0,
            image: "/lens-normal.png"
        },
        {
            id: "thin",
            title: "Thin with 1.61 Index",
            price: 1500,
            image: "/lens-thin.png"
        },
        {
            id: "ultra-thin",
            title: "Ultra Thin with 1.67 Index",
            price: 2500,
            image: "/lens-ultra-thin.png"
        },
        {
            id: "super-thin",
            title: "Super Thin with 1.74 Index",
            price: 4000,
            image: "/lens-super-thin.png"
        }
    ]

    const lensPackages = [
        {
            id: "anti-glare",
            title: "Zero Power Anti Glare",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent"
            ],
            price: 3200,
            image: "/lens-anti-glare.png"
        },
        {
            id: "blue-cut",
            title: "Zero Power Anti Glare Blue Rays Protection",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Protects from Digital Rays"
            ],
            price: 3700,
            image: "/lens-blue-cut.png"
        },
        {
            id: "yellow-tinted",
            title: "Yellow Tinted",
            features: [
                "UV-400 Protection",
                "Crack & Scratch Resistant",
                "Applicable Only for Single Vision Power",
                "Lightweight Lenses"
            ],
            price: 4000,
            image: "/lens-yellow-tinted.png"
        }
    ]

    const singleVisionPackages = [
        {
            id: "sv-anti-glare",
            title: "Anti-Glare",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent"
            ],
            price: 4000,
            image: "/lens-night-transition.png"
        },
        {
            id: "sv-blue-cut",
            title: "Anti-Glare Blue rays Protection",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Protects from Digital Rays"
            ],
            price: 4700,
            image: "/lens-night-transition.png"
        },
        {
            id: "sv-transition",
            title: "Anti-Glare Transition",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "UV-420 Protection",
                "Light adjusting /photocromic/darken when exposed to outside sunlight and remain clear inside"
            ],
            price: 5200,
            image: "/lens-night-transition.png"
        },
        {
            id: "sv-blue-transition",
            title: "Anti-Glare Blue Rays Protection Transition",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "UV-420 Protection",
                "Light adjusting /photocromic/darken when exposed to outside sunlight and remain clear inside"
            ],
            price: 6000,
            image: "/lens-night-transition.png"
        },
        {
            id: "sv-poly-blue",
            title: "Poly Anti-Glare Blue Rays Protection (Recommended For Rimless Frame)",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Protects from Digital Rays"
            ],
            price: 8000,
            image: "/lens-night-transition.png"
        },
        {
            id: "sv-poly-blue-transition",
            title: "Poly Anti-Glare Blue Rays Protection Transition (Recommended For Rimless Frame)",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Protects from Digital Rays",
                "UV-420 Protection",
                "Light adjusting /photocromic/darken when exposed to outside sunlight and remain clear inside"
            ],
            price: 9500,
            image: "/lens-night-transition.png"
        },
        {
            id: "sv-night-vision",
            title: "Night Vision Shield Anti Glare Blue Rays Protection",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Protects from Digital Rays",
                "For Night Driving",
                "Reduce glares/reflections oncoming lights and improve contrast"
            ],
            price: 9500,
            image: "/lens-night-transition.png"
        },
        {
            id: "sv-night-vision-transition",
            title: "Night Vision Shield Anti-Glare Blue Rays Protection Transition",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Protects from Digital Rays",
                "For Night Driving",
                "Reduce glares/reflections oncoming lights and improve contrast",
                "UV-420 Protection",
                "Light adjusting /photocromic/darken when exposed to outside sunlight and remain clear inside"
            ],
            price: 10500,
            image: "/lens-night-transition.png"
        }
    ]

    const lensOptions = [
        {
            id: "zero-power",
            title: "Zero Power",
            description: "Block 98% of harmful rays (Anti glare and Blue-cut options)",
            icon: <Sun className="h-6 w-6 text-blue-500" />,
            price: 1500
        },
        {
            id: "single-vision",
            title: "Single Vision",
            description: "For Distance or Near Vision (Thin, Anti Glare, Blue Cut)",
            icon: <Eye className="h-6 w-6 text-green-500" />,
            price: 2500
        },
        {
            id: "bifocal",
            title: "Bifocal",
            description: "Bifocal (For Two powers in same Lenses)",
            icon: <Layers className="h-6 w-6 text-purple-500" />,
            price: 3500
        },
        {
            id: "progressive",
            title: "Progressive",
            description: "Progressive (For Distance, Intermediate & Near Vision)",
            icon: <Glasses className="h-6 w-6 text-orange-500" />,
            price: 4500
        },
        {
            id: "frame-only",
            title: "Frame Only",
            description: "Buy Only Frame",
            icon: <Frame className="h-6 w-6 text-gray-500" />,
            price: 0
        }
    ]

    const bifocalPackages = [
        {
            id: "bifocal-anti-glare",
            title: "Bifocal Anti-Glare",
            features: [
                "Crack & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Circular Reading Area in Lower Part",
                "For Distance & Near Vision"
            ],
            price: 2501,
            image: "/lens-bifocal-anti-glare.png"
        },
        {
            id: "bifocal-blue-cut",
            title: "Bifocal Anti-Glare Blue Rays Protection",
            features: [
                "Crack & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Circular Reading Area in Lower Part",
                "For Distance & Near Vision",
                "Protects from Digital Rays"
            ],
            price: 7500,
            image: "/lens-bifocal-blue-cut.png"
        },
        {
            id: "bifocal-transition",
            title: "Bifocal Anti-Glare Transition",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Circular Reading Area in Lower Part",
                "For Distance & Near Vision",
                "UV-420 Protection",
                "Light adjusting /photocromic/darken when exposed to outside sunlight and remain clear inside"
            ],
            price: 7900,
            image: "/lens-bifocal-transition.png"
        },
        {
            id: "bifocal-anti-glare-blue-transition",
            title: "Bifocal Anti Glare Blue Rays Protection Transition",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Circular Reading Area in Lower Part",
                "For Distance & Near Vision",
                "UV-420 Protection",
                "Reduce glares/reflections oncoming lights and improve contrast",
                "Light adjusting /photocromic/darken when exposed to outside sunlight and remain clear inside"
            ],
            price: 9400,
            image: "/lens-bifocal-blue-transition.png"
        },
        {
            id: "bifocal-night-vision",
            title: "Bifocal Night Vision Shield Anti-Glare Blue Rays Protection",
            features: [
                "Crack & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Circular Reading Area in Lower Part",
                "For Distance & Near Vision",
                "Protects from Digital Rays",
                "For Night Driving",
                "Reduce glares/reflections oncoming lights and improve contrast"
            ],
            price: 10000,
            image: "/lens-bifocal-night-vision.png"
        },
        {
            id: "bifocal-night-vision-transition",
            title: "Bifocal Night Vision Shield Anti-Glare Blue Rays Protection Transition",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Circular Reading Area in Lower Part",
                "For Distance & Near Vision",
                "UV-420 Protection",
                "Reduce glares/reflections oncoming lights and improve contrast",
                "Light adjusting /photocromic/darken when exposed to outside sunlight and remain clear inside"
            ],
            price: 11500,
            image: "/lens-bifocal-night-transition.png"
        },
        {
            id: "bifocal-poly-anti-glare",
            title: "Bifocal Poly Anti Glare (Recommended For Rimless Frame)",
            features: [
                "Crack & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Circular Reading Area in Lower Part",
                "For Distance & Near Vision"
            ],
            price: 11500,
            image: "/lens-bifocal-poly.png"
        },
        {
            id: "bifocal-poly-blue",
            title: "Bifocal Poly Anti Glare Blue Rays Protection (Recommended For Rimless Frame)",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Circular Reading Area in Lower Part",
                "For Distance & Near Vision",
                "UV-420 Protection",
                "Light adjusting /photocromic/darken when exposed to outside sunlight and remain clear inside"
            ],
            price: 12500,
            image: "/lens-bifocal-poly-blue.png"
        },
        {
            id: "bifocal-poly-transition",
            title: "Bifocal Poly Anti Glare Transition (Recommended For Rimless Frame)",
            features: [
                "Crack & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Circular Reading Area in Lower Part",
                "For Distance & Near Vision",
                "Light adjusting /photocromic/darken when exposed to outside sunlight and remain clear inside"
            ],
            price: 16000,
            image: "/lens-bifocal-poly-transition.png"
        },
        {
            id: "bifocal-poly-blue-transition",
            title: "Bifocal Poly Anti Glare Blue Rays Protection Transition (Recommended For Rimless Frame)",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Protects from Digital Rays",
                "Circular Reading Area in Lower Part",
                "For Distance & Near Vision",
                "UV-420 Protection",
                "Light adjusting /photocromic/darken when exposed to outside sunlight and remain clear inside"
            ],
            price: 17500,
            image: "/lens-bifocal-poly-blue-transition.png"
        }
    ]

    const progressivePackages = [
        {
            id: "progressive-anti-glare",
            title: "Progressive Anti Glare",
            features: [
                "Crack & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Smooth Lens with No Visible Line",
                "For Distance, Intermediate & Near Vision"
            ],
            price: 8500,
            image: "/lens-progressive-anti-glare.png"
        },
        {
            id: "progressive-blue-cut",
            title: "Progressive Anti Glare Blue Rays Protection",
            features: [
                "Crack & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Smooth Lens with No Visible Line",
                "For Distance, Intermediate & Near Vision",
                "Protects from Digital Rays"
            ],
            price: 9200,
            image: "/lens-progressive-blue-cut.png"
        },
        {
            id: "progressive-transition",
            title: "Progressive Anti Glare Transition",
            features: [
                "Crack & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Smooth Lens with No Visible Line",
                "For Distance, Intermediate & Near Vision",
                "UV-420 Protection",
                "Light adjusting /photocromic/darken when exposed to outside sunlight and remain clear inside"
            ],
            price: 9500,
            image: "/lens-progressive-transition.png"
        },
        {
            id: "progressive-blue-transition",
            title: "Progressive Anti Glare Blue Rays Protection Transition",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Smooth Lens with No Visible Line",
                "For Distance, Intermediate & Near Vision",
                "Protects from Digital Rays",
                "UV-420 Protection",
                "Light adjusting /photocromic/darken when exposed to outside sunlight and remain clear inside"
            ],
            price: 13000,
            image: "/lens-progressive-blue-transition.png"
        },
        {
            id: "progressive-night-vision",
            title: "Progressive Night Vision Shield Anti Glare Blue Rays Protection",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Smooth Lens with No Visible Line",
                "For Distance, Intermediate & Near Vision",
                "Protects from Digital Rays",
                "For Night Driving",
                "Reduce glares/reflections oncoming lights and improve contrast"
            ],
            price: 14000,
            image: "/lens-progressive-night-vision.png"
        },
        {
            id: "progressive-night-vision-transition",
            title: "Progressive Night Vision Shield Anti Glare Blue Rays Protection Transition",
            features: [
                "Crack, Smudge & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Smooth Lens with No Visible Line",
                "For Distance, Intermediate & Near Vision",
                "Protects from Digital Rays",
                "UV-420 Protection",
                "Light adjusting /photocromic/darken when exposed to outside sunlight and remain clear inside",
                "For Night Driving",
                "Reduce glares/reflections oncoming lights and improve contrast"
            ],
            price: 15000,
            image: "/lens-progressive-night-transition.png"
        },
        {
            id: "progressive-poly-anti-glare",
            title: "Progressive Poly Anti Glare (Recommended For Rimless Frame)",
            features: [
                "Crack & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Smooth Lens with No Visible Line",
                "For Distance, Intermediate & Near Vision"
            ],
            price: 13500,
            image: "/lens-progressive-poly-anti-glare.png"
        },
        {
            id: "progressive-poly-blue",
            title: "Progressive Poly Anti Glare Blue Rays Protection (Recommended For Rimless Frame)",
            features: [
                "Crack & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Smooth Lens with No Visible Line",
                "For Distance, Intermediate & Near Vision",
                "Protects from Digital Ray"
            ],
            price: 14500,
            image: "/lens-progressive-poly-blue.png"
        },
        {
            id: "progressive-poly-transition",
            title: "Progressive Poly Anti Glare Transition (Recommended For Rimless Frame)",
            features: [
                "Crack & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Smooth Lens with No Visible Line",
                "For Distance, Intermediate & Near Vision",
                "UV-420 Protection",
                "Light adjusting /photocromic/darken when exposed to outside sunlight and remain clear inside"
            ],
            price: 18000,
            image: "/lens-progressive-poly-transition.png"
        },
        {
            id: "progressive-poly-blue-transition",
            title: "Progressive Poly Anti Glare Blue Rays Protection Transition (Recommended For Rimless Frame)",
            features: [
                "Crack & Scratch Resistant",
                "Anti-Glare Lens",
                "Water & Dust Repellent",
                "Smooth Lens with No Visible Line",
                "For Distance, Intermediate & Near Vision",
                "Protects from Digital Rays",
                "UV-420 Protection",
                "Light adjusting /photocromic/darken when exposed to outside sunlight and remain clear inside"
            ],
            price: 19500,
            image: "/lens-progressive-poly-blue-transition.png"
        }
    ]

    const progressiveCorridorOptions = [
        {
            id: "standard",
            title: "Standard Design",
            description: "Standard Corridor",
            price: 0,
            image: "/corridor-standard.png"
        },
        {
            id: "superior",
            title: "Superior Design",
            description: "Superior Corridor",
            price: 1500,
            image: "/corridor-superior.png"
        },
        {
            id: "ultimate",
            title: "Ultimate Design",
            description: "Ultimate Corridor",
            price: 3000,
            image: "/corridor-ultimate.png"
        },
        {
            id: "specialized",
            title: "Specialized Design",
            description: "Specialized Corridor",
            price: 4500,
            image: "/corridor-specialized.png"
        },
        {
            id: "customised",
            title: "Customised Design",
            description: "Customised Corridor",
            price: 6000,
            image: "/corridor-customised.png"
        },
        {
            id: "individualised",
            title: "Individualised Design",
            description: "Individualised Corridor",
            price: 7500,
            image: "/corridor-individualised.png"
        }
    ]

    const handleLensSelect = (lensId: string) => {
        setSelectedLens(lensId)
        if (lensId === "zero-power") {
            setCurrentView("package")
        } else if (lensId === "single-vision") {
            setCurrentView("single-vision-package")
        } else if (lensId === "bifocal") {
            setCurrentView("bifocal-package")
        } else if (lensId === "progressive") {
            setCurrentView("progressive-corridor")
        } else if (lensId === "frame-only") {
            // Handle frame only selection
        }
    }

    const handlePackageSelect = (pkg: any) => {
        setSelectedPackage(pkg)
        setCurrentView("package-detail")
    }

    const handleSingleVisionPackageSelect = (pkg: any) => {
        setSelectedPackage(pkg)
        setCurrentView("lens-thickness")
    }

    const handleThicknessSelect = (thickness: any) => {
        setSelectedThickness(thickness)
        setCurrentView("package-detail")
    }

    const handleBifocalPackageSelect = (pkg: any) => {
        setSelectedPackage(pkg)
        setCurrentView("lens-thickness")
    }

    const handleCorridorSelect = (corridor: any) => {
        setSelectedPackage(corridor)
        setCurrentView("progressive-package")
    }

    if (!isOpen) return null

    return (
        <div className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? 'block' : 'hidden'}`}>
            <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
            <div className={`absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-xl transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        {currentView === "package" ? (
                            <button
                                onClick={() => setCurrentView("main")}
                                className="flex items-center text-primary"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                <h2 className="text-xl font-bold">Choose Lens Package</h2>
                            </button>
                        ) : currentView === "lens-thickness" ? (
                            <button
                                onClick={() =>
                                    setCurrentView(
                                        selectedLens === "zero-power"
                                            ? "package"
                                            : selectedLens === "single-vision"
                                            ? "single-vision-package"
                                            : "main"
                                    )
                                }
                                className="flex items-center text-primary"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                <h2 className="text-xl font-bold">Choose Lenses Thickness (Optional)</h2>
                            </button>
                        ) : currentView === "package-detail" ? (
                            <button
                                onClick={() => setCurrentView("package")}
                                className="flex items-center text-primary"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                <h2 className="text-xl font-bold">Eye Power</h2>
                            </button>
                        ) : currentView === "single-vision-package" ? (
                            <button
                                onClick={() => setCurrentView("main")}
                                className="flex items-center text-primary"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                <h2 className="text-xl font-bold">Choose Lens Package</h2>
                            </button>
                        ) : currentView === "progressive-corridor" ? (
                            <button
                                onClick={() => setCurrentView("main")}
                                className="flex items-center text-primary"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                <h2 className="text-xl font-bold">Choose Progressive Design</h2>
                            </button>
                        ) : currentView === "progressive-package" ? (
                            <button
                                onClick={() => setCurrentView("progressive-corridor")}
                                className="flex items-center text-primary"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                <h2 className="text-xl font-bold">Choose Progressive Package</h2>
                            </button>
                        ) : (
                            <h2 className="text-xl font-bold">Select Lens Type</h2>
                        )}
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                    
                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto">
                        {currentView === "main" && (
                            <div className="p-4">
                                <div className="space-y-3">
                                    {lensOptions.map((lens) => (
                                        <button
                                            key={lens.id}
                                            onClick={() => handleLensSelect(lens.id)}
                                            className={cn(
                                                "w-full p-4 text-left transition-all duration-200",
                                                "bg-white border rounded-lg shadow-sm",
                                                "hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 hover:scale-[1.01]",
                                                "flex items-center justify-between gap-4"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-gray-50 rounded-full">
                                                    {lens.icon}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-lg">{lens.title}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">{lens.description}</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                        </button>
                                    ))}
                                </div>

                                <div className="p-6 text-center text-sm text-muted-foreground border-t mt-4">
                                    Not sure what to select?<br />
                                    <a href="tel:+2540000000000" className="text-primary">+2540000000000</a>
                                </div>
                            </div>
                        )}

                        {currentView === "progressive-package" && (
                            <div className="p-4">
                                {selectedPackage && progressiveCorridorOptions.some(c => c.id === selectedPackage.id) && (
                                    <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                            <Image 
                                                src={selectedPackage.image}
                                                alt={selectedPackage.title}
                                                width={64}
                                                height={64}
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-medium">{selectedPackage.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{selectedPackage.description}</p>
                                                </div>
                                                <span className="font-bold">KSh {selectedPackage.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {progressivePackages.map((pkg) => (
                                        <div
                                            key={pkg.id}
                                            onClick={() => handlePackageSelect(pkg)}
                                            className={cn(
                                                "border rounded-lg overflow-hidden cursor-pointer",
                                                "transition-all duration-200 hover:shadow-md hover:scale-[1.01]",
                                                selectedPackage?.id === pkg.id ? "ring-2 ring-primary" : ""
                                            )}
                                        >
                                            <div className="flex p-4">
                                                <div className="mr-4">
                                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <Image
                                                            src={pkg.image}
                                                            alt={pkg.title}
                                                            width={80}
                                                            height={80}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-lg">{pkg.title}</h3>
                                                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                        {pkg.features.map((feature: string, i: number) => (
                                                            <li key={i} className="flex items-start">
                                                                <Check className="h-4 w-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div
                                                className={cn(
                                                    "p-3 text-right font-bold",
                                                    "bg-gradient-to-r from-orange-50 via-orange-100 to-orange-200"
                                                )}
                                            >
                                                Frame+Lens: Get it For KSh {pkg.price.toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 p-4 border-t">
                                    <div className="flex justify-between mb-4">
                                        <span>SubTotal (Frame)</span>
                                        <span className="font-medium">KSh {framePrice}</span>
                                    </div>
                                    {selectedPackage && (
                                        <div className="flex justify-between mb-4">
                                            <span>Progressive Design</span>
                                            <span className="font-medium">KSh {selectedPackage.price}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {currentView === "progressive-corridor" && (
                            <div className="p-4">
                                <div className="flex items-center mb-4">
                                    <button
                                        onClick={() => setCurrentView("main")}
                                        className="flex items-center text-primary mr-2"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </button>
                                    <h2 className="text-xl font-bold">Choose Progressive Design (Optional)</h2>
                                </div>

                                <div className="space-y-3">
                                    {progressiveCorridorOptions.map((corridor) => (
                                        <button
                                            key={corridor.id}
                                            onClick={() => handleCorridorSelect(corridor)}
                                            className={cn(
                                                "w-full p-4 text-left transition-all duration-200",
                                                "bg-white border rounded-lg shadow-sm",
                                                "hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 hover:scale-[1.01]",
                                                selectedPackage?.id === corridor.id ? "ring-2 ring-primary" : "",
                                                "flex items-center gap-4"
                                            )}
                                        >
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                                <Image 
                                                    src={corridor.image}
                                                    alt={corridor.title}
                                                    width={64}
                                                    height={64}
                                                    className="object-contain"
                                                />
                                            </div>
                                            
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-medium text-lg">{corridor.title}</h3>
                                                        <p className="text-sm text-muted-foreground">{corridor.description}</p>
                                                    </div>
                                                    <div className={cn(
                                                        "px-4 py-2 rounded-md font-bold",
                                                        "bg-gradient-to-r from-orange-100 via-orange-200 to-orange-300"
                                                    )}>
                                                        KSh {corridor.price}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentView === "package" && (
                            <div className="p-4">
                                <div className="space-y-4">
                                    {lensPackages.map((pkg) => (
                                        <div
                                            key={pkg.id}
                                            onClick={() => handlePackageSelect(pkg)}
                                            className={cn(
                                                "border rounded-lg overflow-hidden cursor-pointer",
                                                "transition-all duration-200 hover:shadow-md hover:scale-[1.01]",
                                                selectedPackage?.id === pkg.id ? "ring-2 ring-primary" : ""
                                            )}
                                        >
                                            <div className="flex p-4">
                                                <div className="mr-4">
                                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <Image
                                                            src={pkg.image}
                                                            alt={pkg.title}
                                                            width={80}
                                                            height={80}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-lg">{pkg.title}</h3>
                                                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                        {pkg.features.map((feature: string, i: number) => (
                                                            <li key={i} className="flex items-start">
                                                                <Check className="h-4 w-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div
                                                className={cn(
                                                    "p-3 text-right font-bold",
                                                    "bg-gradient-to-r from-orange-50 via-orange-100 to-orange-200"
                                                )}
                                            >
                                                Frame+Lens: Get it For KSh {pkg.price.toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 p-4 border-t">
                                    <div className="flex justify-between mb-4">
                                        <span>SubTotal (Frame)</span>
                                        <span className="font-medium">KSh {framePrice}</span>
                                    </div>

                                    <button
                                        onClick={() => setCurrentView("eye-power")}
                                        className={cn(
                                            "w-full p-4 text-left transition-all duration-200",
                                            "bg-white border rounded-lg shadow-sm",
                                            "hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 hover:scale-[1.01]",
                                            "flex items-center justify-between gap-4",
                                            "mt-4"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-gray-50 rounded-full">
                                                <Eye className="h-6 w-6 text-blue-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-lg">What about my eye power?</h3>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentView === "lens-thickness" && (
                            <div className="p-4">
                                <div className="space-y-4">
                                    {lensThicknessOptions.map((thickness) => (
                                        <div
                                            key={thickness.id}
                                            onClick={() => handleThicknessSelect(thickness)}
                                            className={cn(
                                                "border rounded-lg overflow-hidden cursor-pointer",
                                                "transition-all duration-200 hover:shadow-md hover:scale-[1.01]",
                                                selectedThickness?.id === thickness.id ? "ring-2 ring-primary" : ""
                                            )}
                                        >
                                            <div className="flex p-4">
                                                <div className="mr-4">
                                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <Image
                                                            src={thickness.image}
                                                            alt={thickness.title}
                                                            width={80}
                                                            height={80}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-lg">{thickness.title}</h3>
                                                    <p className="mt-2 text-sm text-muted-foreground">
                                                        {thickness.price > 0 
                                                            ? `Additional KSh ${thickness.price}`
                                                            : "No additional cost"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentView === "single-vision-package" && (
                            <div className="p-4">
                                <div className="space-y-4">
                                    {singleVisionPackages.map((pkg) => (
                                        <div
                                            key={pkg.id}
                                            onClick={() => handleSingleVisionPackageSelect(pkg)}
                                            className={cn(
                                                "border rounded-lg overflow-hidden cursor-pointer",
                                                "transition-all duration-200 hover:shadow-md hover:scale-[1.01]",
                                                selectedPackage?.id === pkg.id ? "ring-2 ring-primary" : ""
                                            )}
                                        >
                                            <div className="flex p-4">
                                                <div className="mr-4">
                                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <Image
                                                            src={pkg.image}
                                                            alt={pkg.title}
                                                            width={80}
                                                            height={80}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-lg">{pkg.title}</h3>
                                                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                        {pkg.features.map((feature: string, i: number) => (
                                                            <li key={i} className="flex items-start">
                                                                <Check className="h-4 w-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div
                                                className={cn(
                                                    "p-3 text-right font-bold",
                                                    "bg-gradient-to-r from-orange-50 via-orange-100 to-orange-200"
                                                )}
                                            >
                                                Frame+Lens: Get it For KSh {pkg.price.toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentView === "bifocal-package" && (
                            <div className="p-4">
                                <div className="space-y-4">
                                    {bifocalPackages.map((pkg) => (
                                        <div
                                            key={pkg.id}
                                            onClick={() => handleBifocalPackageSelect(pkg)}
                                            className={cn(
                                                "border rounded-lg overflow-hidden cursor-pointer",
                                                "transition-all duration-200 hover:shadow-md hover:scale-[1.01]",
                                                selectedPackage?.id === pkg.id ? "ring-2 ring-primary" : ""
                                            )}
                                        >
                                            <div className="flex p-4">
                                                <div className="mr-4">
                                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <Image
                                                            src={pkg.image}
                                                            alt={pkg.title}
                                                            width={80}
                                                            height={80}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-lg">{pkg.title}</h3>
                                                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                        {pkg.features.map((feature: string, i: number) => (
                                                            <li key={i} className="flex items-start">
                                                                <Check className="h-4 w-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div
                                                className={cn(
                                                    "p-3 text-right font-bold",
                                                    "bg-gradient-to-r from-orange-50 via-orange-100 to-orange-200"
                                                )}
                                            >
                                                Frame+Lens: Get it For KSh {pkg.price.toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentView === "package-detail" && (
                            <div className="p-4">
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <h3 className="font-bold text-lg mb-2">Your Selection</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Frame</span>
                                            <span className="font-medium">KSh {framePrice}</span>
                                        </div>
                                        {selectedLens !== "frame-only" && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Lens Type</span>
                                                    <span className="font-medium">
                                                        {lensOptions.find(l => l.id === selectedLens)?.title}
                                                    </span>
                                                </div>
                                                {selectedPackage && (
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Package</span>
                                                        <span className="font-medium">
                                                            {selectedPackage.title} (KSh {selectedPackage.price})
                                                        </span>
                                                    </div>
                                                )}
                                                {selectedThickness && (
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Thickness</span>
                                                        <span className="font-medium">
                                                            {selectedThickness.title} 
                                                            {selectedThickness.price > 0 && 
                                                                ` (KSh ${selectedThickness.price})`
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>
                                            KSh {(
                                                framePrice + 
                                                (selectedPackage?.price || 0) + 
                                                (selectedThickness?.price || 0)
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button className="w-full" size="lg">
                                        Add to Cart
                                    </Button>
                                    <Button variant="outline" className="w-full" size="lg" onClick={onClose}>
                                        Continue Shopping
                                    </Button>
                                </div>
                            </div>
                        )}

                        {currentView === "eye-power" && (
                            <div className="p-4">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold mb-2">Eye Power Information</h2>
                                    <p className="text-muted-foreground">
                                        Don't worry about your eye power right now. You can provide it later during checkout 
                                        or when you visit our store for fitting.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Button 
                                        className="w-full" 
                                        size="lg"
                                        onClick={() => setCurrentView("package-detail")}
                                    >
                                        Continue Without Power
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="w-full" 
                                        size="lg" 
                                        onClick={() => setCurrentView("package")}
                                    >
                                        Go Back
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}