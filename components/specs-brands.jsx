'use client';
import React, { useState } from 'react';

export const EyewearComponent = () => {
    const [eyeglassesStart, setEyeglassesStart] = useState(0);
    const [sunglassesStart, setSunglassesStart] = useState(0);
    const [readingStart, setreadingStart] = useState(0);
    const [blueglassesStart, setblueglassesStart] = useState(0);
    const [computerglassesStart, setcomputerglassesStart] = useState(0);
    const [magnetoeyeglassesStart, setmagnetoeyeglassesStart] = useState(0);
    const [contactStart, setcontactStart] = useState(0);
    const [colorcontactlenseStart, setcolorcontactlenseStart] = useState(0);


    // Eyeglasses Images (Local)
    const eyeglassesImages = [
        '/images/banner/fashionglasses/eyeglasses.jpg',
        '/images/banner/fashionglasses/eyeglasses1.avif',
        '/images/banner/fashionglasses/eyeglasses2.jpg',
        '/images/banner/fashionglasses/eyeglasses3.jpg',
        '/images/banner/fashionglasses/eyeglasses4.avif',
        '/images/banner/fashionglasses/eyeglasses5.webp'
    ];

    // Sunglasses Images (Local)
    const sunglassesImages = [
        '/images/banner/sunglasses/sun.jpg',
        '/images/banner/sunglasses/sun1.jpg',
        '/images/banner/sunglasses/sun3.jpg',
        '/images/banner/sunglasses/sun4.jpg',
        '/images/banner/sunglasses/sun5.jpg',
        '/images/banner/sunglasses/sun6.jpg'
    ];
    // reading Images (Local)
    const readingImages = [
        '/images/banner/fashionista/reading1.webp',
        '/images/banner/fashionista/reading2.webp',
        '/images/banner/fashionista/reading3.webp',
        '/images/banner/fashionista/reading4.jpg',
        '/images/banner/fashionista/reading5.jpg',
        '/images/banner/fashionista/reading6.jpeg'
    ];
// blu Images (Local)
    const blueglassesImages = [
        '/images/banner/bluglasses/blu.jpg',
        '/images/banner/bluglasses/blu1.jpg',
        '/images/banner/bluglasses/blu2.jpg',
        '/images/banner/bluglasses/blu3.jpg',
        '/images/banner/bluglasses/blu4.jpg',
        '/images/banner/bluglasses/blu5.jpg'
    ];
// blumagneto Images (Local)
    const computerglassesImages = [
        '/images/banner/magnetoblu/magneto.jpg',
        '/images/banner/magnetoblu/magnetoblu.jpg',
        '/images/banner/magnetoblu/magnetoblu1.jpg',
        '/images/banner/magnetoblu/magnetoblu2.jpg',
        '/images/banner/magnetoblu/magnetoblu3.jpg',
        '/images/banner/magnetoblu/magnetoblu5.jpg'
    ];
    // magneto Images (Local)
    const magnetoeyeglassesImages = [
        '/images/banner/magneto/magneto.jpg',
        '/images/banner/magneto/magneto1.jpg',
        '/images/banner/magneto/magneto2.jpg',
        '/images/banner/magneto/magneto3.jpg',
        '/images/banner/magneto/magneto4.jpg',
        '/images/banner/magneto/magneto5.jpg'
    ];
    // magneto Images (Local)
    const contactImages = [
        '/images/banner/contact/contact12.webp',
        '/images/banner/contact/contact22.webp',
        '/images/banner/contact/contact32.webp',
        '/images/banner/contact/contact42.webp',
        '/images/banner/contact/contact52.webp',
        '/images/banner/contact/contact62.webp'
    ];
     // magneto Images (Local)
    const colorcontactlenseImages = [
        '/images/banner/contact/contact1.jpg',
        '/images/banner/contact/contact2.jpg',
        '/images/banner/contact/contact3.jpg',
        '/images/banner/contact/contact4.jpg',
        '/images/banner/contact/contact5.jpg',
        '/images/banner/contact/contact6.jpg'
    ];
    const scrollNext = (startIndex, setIndex, arrayLength) => {
        const next = startIndex + 3 >= arrayLength ? 0 : startIndex + 3;
        setIndex(next);
    };

    const renderGallerySection = (title, images, startIndex, setIndex) => {
        const visible = images.slice(startIndex, Math.min(startIndex + 3, images.length));
        const isAtEnd = startIndex + 3 >= images.length;

        return (
            <div style={{ marginBottom: '50px' }}>
                {/* Section Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                }}>
                    <h4 style={{ margin: 0 }}>{title}</h4>
                    <a href="#" style={{ textDecoration: 'none', color: 'teal', fontWeight: '500' }}>View Range</a>
                </div>
                <div style={{ height: '2px', backgroundColor: '#ccc', marginBottom: '20px' }}></div>

                {/* Image Gallery */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        overflow: 'hidden',
                        justifyContent: 'center',  // centers images horizontally
                        margin: '0 auto',          // centers container itself
                        maxWidth: '1600px',        // optional: restrict width
                        padding: '0 40px',       // adds margin left & right
                        transition: 'all 0.3s ease-in-out'
                    }}>
                        {visible.map((img, i) => (

                            <a
                                key={i}
                                href="/cart"
                                style={{
                                    display: 'block',
                                    width: '40%',
                                    minWidth: '150px',
                                    cursor: 'pointer',
                                    height: '200px',
                                    textDecoration: 'none'
                                }}
                            >
                                <img key={i} src={img} alt={`${title}-${i}`} style={{
                                    width: '100%',
                                    height: '100%',
                                    minWidth: '150px',
                                    height: '150px',
                                    objectFit: 'contain'
                                }} onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                />
                            </a>
                        ))}
                    </div>

                    {/* Scroll Button */}
                    <button
                        onClick={() => scrollNext(startIndex, setIndex, images.length)}
                        style={{
                            position: 'absolute',
                            top: '40%',
                            right: isAtEnd ? 'auto' : '0',
                            left: isAtEnd ? '0' : 'auto',
                            transform: 'translateY(-50%)',
                            fontSize: '24px',
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            width: '40px',
                            height: '40px',
                            zIndex: 1
                        }}
                    >
                        {isAtEnd ? '<' : '>'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            {/* Header with lines */}
        <div className="text-center pt-16 pb-8">
        <div className="flex items-center justify-center mb-4">

          <div className="flex-grow h-px bg-gray-300"></div>
          <h2 className="text-4xl font-bold text-black px-4">Our Brand</h2>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
      </div>

            {/* Banner */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                backgroundColor: '#005c6e',
                color: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '40px',
                minHeight: '300px',
            }}>
                <img
                    src="/images/banner/fashionistaoffer.png"
                    alt="banner"
                    style={{
                        width: '40%',
                        minWidth: '250px',
                        maxWidth: '400px',
                        objectFit: 'cover',
                        minHeight: '300px',
                        maxHeight: '350px',
                        flex: 1
                    }}
                />
                <div style={{ flex: 1, padding: '30px', minWidth: '250px', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '80px', marginBottom: '10px' }}>FASHIONISTA SERIES</h3>
                    <p style={{ fontSize: '30px',  letterSpacing: '0.15em', lineHeight: '1.4' }}>
                        Effortless Style for Every Side of You<br /> Discover Fashionista Series.
                    </p>
                </div>
                <img
                    src="/images/banner/fashionista.png"
                    alt="banner"
                    style={{
                        width: '40%',
                        minWidth: '250px',
                        maxWidth: '400px',
                        objectFit: 'cover',
                        minHeight: '300px',
                        maxHeight: '350px',
                        flex: 1
                    }}
                />
            </div>

            {/* Eyeglasses Section */}
            {renderGallerySection('EYEGLASSES', eyeglassesImages, eyeglassesStart, setEyeglassesStart)}

            {/* reading section */}
            {renderGallerySection('READINDGLASSES', readingImages, readingStart, setreadingStart)}
            {/* blu Section */}
            {renderGallerySection('BLUGLASSES', blueglassesImages, blueglassesStart, setblueglassesStart)}
            {/* Another Banner Section */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                backgroundColor: '#000000ff',
                color: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
                margin: '40px 0',
                minHeight: '300px',
            }}>
                <img
                    src="/images/banner/magnetobanner.jpg"
                    alt="banner"
                    style={{
                        width: '40%',
                        minWidth: '250px',
                        maxWidth: '400px',
                        objectFit: 'cover',
                        minHeight: '300px',
                        maxHeight: '350px',
                        flex: 1
                    }}
                />
                <div style={{ flex: 1, padding: '30px', minWidth: '250px', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '80px', marginBottom: '10px' }}>MAGNETO SERIES</h3>
                    <p style={{ fontSize: '30px',  letterSpacing: '0.15em', lineHeight: '1.4' }}>
                        Engineered for Life, Designed for You<br /> Experience Magneto Eyewear.
                    </p>
                </div>
                <img
                    src="/images/banner/magnetobanner2.jpeg"
                    alt="banner"
                    style={{
                        width: '40%',
                        minWidth: '250px',
                        maxWidth: '400px',
                        objectFit: 'cover',
                        minHeight: '300px',
                        maxHeight: '350px',
                        flex: 1
                    }}
                />
                
            </div>
            {/* Sunglasses Section */}
            {renderGallerySection('EYECLASSES', magnetoeyeglassesImages, magnetoeyeglassesStart, setmagnetoeyeglassesStart)}

            {/* blu Section */}
            {renderGallerySection('BLUGLASSES', computerglassesImages, computerglassesStart, setcomputerglassesStart)}

            
            {/* Another Banner Section */}
            {/* Another Banner Section */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                backgroundColor: '#005c6e',
                color: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '40px',
                minHeight: '300px',
            }}>
                <div style={{ flex: 1, padding: '30px', minWidth: '250px', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '80px', marginBottom: '10px' }}>SUN GLASSES</h3>
                    <p style={{ fontSize: '30px',  letterSpacing: '0.15em', lineHeight: '1.4' }}>
                        STYLE THAT SHADES — <br /> SEE THE WORLD DIFFERENTLY.
                    </p>
                </div>
                <img
                    src="/images/banner/sunglasesbanner.jpeg"
                    alt="john jacobs banner"
                    style={{
                        width: '40%',
                        minWidth: '250px',
                        objectFit: 'cover',
                        height: '100%',
                        maxHeight: '300px',
                        flex: 1
                    }}
                />
            </div>
            {/* Sunglasses Section */}
            {renderGallerySection('SUNGLASSES', sunglassesImages, sunglassesStart, setSunglassesStart)}
            {/* Another Banner Section */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                backgroundColor: '#222831',
                color: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
                margin: '40px 0',
                minHeight: '300px',
            }}>
                <div style={{ flex: 1, padding: '30px', minWidth: '250px', }}>
                    <h3 style={{ fontSize: '80px', marginBottom: '10px' }}>CONTACT LENS</h3>
                    <p style={{ fontSize: '30px',  letterSpacing: '0.15em', lineHeight: '1.4' }}>
                        CLARITY YOU CAN TRUST, <br /> COMFORT YOU CAN FEEL.
                    </p>
                </div>
                <img
                    src="/images/banner/CONTACTLENS.jpeg"
                    alt="john jacobs banner"
                    style={{
                         width: '40%',
                        minWidth: '250px',
                        objectFit: 'cover',
                        minHeight: '300px',
                        maxHeight: '350px',
                        flex: 1
                    }}
                />
            </div>
            {/* Eyeglasses Section */}
            {renderGallerySection('CONTACT LENSES', contactImages, contactStart, setcontactStart)}

            {/* Sunglasses Section */}
            {renderGallerySection('COLOR CONTACT LENSES', colorcontactlenseImages, colorcontactlenseStart, setcolorcontactlenseStart)}
            {/* Another Banner Section */}
        </div>
    );
};
