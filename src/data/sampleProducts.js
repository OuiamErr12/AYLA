export const categories = [
    { id: 'all', label: 'All' },
    { id: 'makeup', label: 'Makeup' },
    { id: 'skincare', label: 'Skincare' },
    { id: 'fragrance', label: 'Fragrance' },
];

export const sampleProducts = [
    // --- MAQUILLAGE (Makeup) ---
    // LÈVRES
    {
        id: '1',
        name: 'Matte Lipstick "Ruby Woo"',
        brand: 'MAC',
        price: 22.50,
        image: 'https://tse4.mm.bing.net/th/id/OIP.fV6PrelRi8N0Be5kTVPe7AHaKs?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'makeup',
        rating: 4.8,
        description: 'The iconic vivid blue-red matte lipstick. Long-wearing and totally reliable.',
        subCategory: 'Lips'
    },
    {
        id: '2',
        name: 'Soft Matte Lip Cream "Abu Dhabi"',
        brand: 'NYX',
        price: 8.99,
        image: 'https://i5.walmartimages.com/asr/ef10b24f-c3a4-4c49-8833-af8e480e7a84.0737b5bff779d4febf9c7cbfa42be4b5.jpeg',
        category: 'makeup',
        rating: 4.5,
        description: 'Velvety smooth soft matte lip cream that delivers a burst of creamy color and sets to a stunning matte finish.',
        subCategory: 'Lips'
    },
    {
        id: '3',
        name: 'Stunna Lip Paint "Uncensored"',
        brand: 'Fenty Beauty',
        price: 26.00,
        image: 'https://media.sephora.eu/content/dam/digital/pim/published/F/FENTY_BEAUTY/398411/42906-media_swatch.jpg?scaleWidth=undefined&scaleHeight=undefined&scaleMode=undefined',
        category: 'makeup',
        rating: 4.9,
        description: 'A weightless, longwear liquid lipstick with a soft matte finish in a head-turning red shade.',
        subCategory: 'Lips'
    },
    {
        id: '4',
        name: 'Lip Cheat "Pillow Talk"',
        brand: 'Charlotte Tilbury',
        price: 24.00,
        image: 'https://tse2.mm.bing.net/th/id/OIP.fGNnVJ7qDA8Ax3_U0xK4CgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'makeup',
        rating: 4.7,
        description: 'The world-famous nude-pink lip liner that reshapes and resizes your lips.',
        subCategory: 'Lips'
    },
    {
        id: '5',
        name: 'Lip Sleeping Mask',
        brand: 'Laneige',
        price: 23.00,
        image: 'https://tse2.mm.bing.net/th/id/OIP.BpVPP4RE__CiE7WRuCyTyAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'makeup',
        rating: 4.9,
        description: 'A leave-on lip mask that delivers intense moisture and antioxidants while you sleep.',
        subCategory: 'Lips'
    },

    // YEUX
    {
        id: '6',
        name: 'Better Than Sex Mascara',
        brand: 'Too Faced',
        price: 26.00,
        image: 'https://tse3.mm.bing.net/th/id/OIP.6eFjywaCkfrRTWS6NnNLygHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'makeup',
        rating: 4.6,
        description: 'A mascara that stretches, volumizes, and curls lashes for an intense black finish.',
        subCategory: 'Eyes'
    },
    {
        id: '7',
        name: 'Naked3 Palette',
        brand: 'Urban Decay',
        price: 55.00,
        image: 'https://tse1.mm.bing.net/th/id/OIP.6Gao0OmV3BkGHeetSluuuAHaHh?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'makeup',
        rating: 4.8,
        description: '12 rose-hued neutrals in ultra-smooth mattes, gorgeous pearls, and glimmering metallics.',
        subCategory: 'Eyes'
    },
    {
        id: '8',
        name: 'Tattoo Liner "Trooper Black"',
        brand: 'KVD Vegan Beauty',
        price: 22.00,
        image: 'https://m.media-amazon.com/images/I/41f0nBfPo8L._SL1236_.jpg',
        category: 'makeup',
        rating: 4.7,
        description: 'An award-winning, waterproof liquid eyeliner with an ultra-precise brush tip.',
        subCategory: 'Eyes'
    },

    // VISAGE
    {
        id: '9',
        name: 'Double Wear Stay-in-Place',
        brand: 'Estée Lauder',
        price: 42.00,
        image: 'https://tse3.mm.bing.net/th/id/OIP.OvqncpVU2uUK3CwxmM1sYwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'makeup',
        rating: 4.9,
        description: '24-hour staying power. Flawless. Natural. Matte. Unifies uneven skintone within seconds.',
        subCategory: 'Face'
    },
    {
        id: '10',
        name: 'Radiant Creamy Concealer',
        brand: 'NARS',
        price: 31.00,
        image: 'https://th.bing.com/th/id/R.8c32b3f1151b169c60e2d637eb7ce8b7?rik=2lInYWMZwmdEoQ&pid=ImgRaw&r=0',
        category: 'makeup',
        rating: 4.8,
        description: 'The #1 concealer in the U.S. Corrects, contours, highlights, and perfects.',
        subCategory: 'Face'
    },
    {
        id: '11',
        name: 'Translucent Loose Setting Powder',
        brand: 'Laura Mercier',
        price: 39.00,
        image: 'https://tse1.mm.bing.net/th/id/OIP.3zmhXcztv5KUKTJz-fFR1gHaLW?w=1560&h=2392&rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'makeup',
        rating: 4.9,
        description: 'A lightweight, easy-to-apply, loose powder that blends effortlessly to set makeup for up to 16 hours.',
        subCategory: 'Face'
    },
    {
        id: '12',
        name: 'Blush "Orgasm"',
        brand: 'NARS',
        price: 32.00,
        image: 'https://tse4.mm.bing.net/th/id/OIP.lhAQJ1mcakQaLt-B9VcQCgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'makeup',
        rating: 4.8,
        description: 'The ultimate authority in blush, NARS offers the industry\'s most iconic shades for cheeks.',
        subCategory: 'Face'
    },
    {
        id: '13',
        name: 'Killawatt Highlighter',
        brand: 'Fenty Beauty',
        price: 38.00,
        image: 'https://tse4.mm.bing.net/th/id/OIP.IYD3mPRj33T4ARtkoOAVogHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'makeup',
        rating: 4.7,
        description: 'A weightless, long-wear cream-powder hybrid highlighter for face and eyes.',
        subCategory: 'Face'
    },

    // SOURCILS
    {
        id: '14',
        name: 'Dipbrow Pomade',
        brand: 'Anastasia Beverly Hills',
        price: 22.00,
        image: 'https://th.bing.com/th/id/R.fc414e48c2043320dfdf57dde81545d4?rik=rbRDmX%2bdVkeIOw&pid=ImgRaw&r=0',
        category: 'makeup',
        rating: 4.8,
        description: 'A waterproof brow color that sculpts and defines brows.',
        subCategory: 'Brows'
    },
    {
        id: '15',
        name: 'Boy Brow',
        brand: 'Glossier',
        price: 18.00,
        image: 'https://tse4.mm.bing.net/th/id/OIP.iW7zP23BMKXITGIbQafhEwHaJS?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'makeup',
        rating: 4.6,
        description: 'A brushable, creamy wax that visibly thickens, shapes, and grooms brows into place.',
        subCategory: 'Brows'
    },

    // PRIMER & FIXATIF
    {
        id: '16',
        name: 'Hydro Grip Primer',
        brand: 'Milk Makeup',
        price: 35.00,
        image: 'https://tse2.mm.bing.net/th/id/OIP.VGffLrVhJ018qQWbz7h8xwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'makeup',
        rating: 4.7,
        description: 'An award-winning hydrating makeup primer with blue agave extract and hemp-derived cannabis seed extract.',
        subCategory: 'Face'
    },
    {
        id: '17',
        name: 'All Nighter Setting Spray',
        brand: 'Urban Decay',
        price: 34.00,
        image: 'https://tse2.mm.bing.net/th/id/OIP.C4pUOOjaY-6rYvjun4UpbwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'makeup',
        rating: 4.9,
        description: 'Keeps makeup looking gorgeously just-applied for up to 16 hours.',
        subCategory: 'Face'
    },

    // --- SOIN DE LA PEAU (Skincare) ---
    // NETTOYANTS
    {
        id: '18',
        name: 'Sensibio H2O Micellar Water',
        brand: 'Bioderma',
        price: 14.90,
        image: 'https://tse3.mm.bing.net/th/id/OIP.17BxMrx-X5h8MHZD0XzxeAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'skincare',
        rating: 4.8,
        description: 'A cleansing and make-up removing water that respects the fragility of sensitive skin.',
        subCategory: 'Cleansers'
    },
    {
        id: '19',
        name: 'Hydrating Cleanser',
        brand: 'CeraVe',
        price: 15.00,
        image: 'https://tse1.mm.bing.net/th/id/OIP.GU9zndaSyKuMuh0JN-goLgHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'skincare',
        rating: 4.9,
        description: 'Cleanses and hydrates without disrupting the protective skin barrier. With 3 essential ceramides.',
        subCategory: 'Cleansers'
    },

    // SÉRUMS
    {
        id: '20',
        name: 'Hyaluronic Acid 2% + B5',
        brand: 'The Ordinary',
        price: 7.50,
        image: 'https://static.thcdn.com/images/large/original/productimg/1600/1600/11363395-2265023392442461.jpg',
        category: 'skincare',
        rating: 4.7,
        description: 'A hydrating formula with ultra-pure, vegan hyaluronic acid.',
        subCategory: 'Serums'
    },
    {
        id: '21',
        name: 'C E Ferulic',
        brand: 'SkinCeuticals',
        price: 175.00,
        image: 'https://www.refinery29.com/images/10865861.jpg',
        category: 'skincare',
        rating: 5.0,
        description: 'A daytime vitamin C serum that delivers advanced environmental protection and improves the appearance of fine lines.',
        subCategory: 'Serums'
    },

    // CRÈMES
    {
        id: '22',
        name: 'Moisturizing Cream',
        brand: 'CeraVe',
        price: 19.00,
        image: 'https://tse1.mm.bing.net/th/id/OIP.YsfOE9VeL1fYX7Yoh6QdYwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'skincare',
        rating: 4.8,
        description: 'Rich, non-greasy, fast-absorbing formula. Ideal for dry to very dry skin.',
        subCategory: 'Cream'
    },
    {
        id: '23',
        name: 'Lala Retro Whipped Cream',
        brand: 'Drunk Elephant',
        price: 68.00,
        image: 'https://www.spacenk.com/on/demandware.static/-/Sites-spacenkmastercatalog/default/dw99abc871/products/DRUNK_ELEP/UK200024529_DRUNK_ELEP.jpg',
        category: 'skincare',
        rating: 4.7,
        description: 'A retro-style moisturizer that rehabilitates, brightens, and firms skin\'s appearance.',
        subCategory: 'Cream'
    },

    // PROTECTION SOLAIRE
    {
        id: '24',
        name: 'Anthelios UVMune 400',
        brand: 'La Roche-Posay',
        price: 22.00,
        image: 'https://tse3.mm.bing.net/th/id/OIP.AKnpUR89j6gDN-KsROLPhQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'skincare',
        rating: 4.9,
        description: 'Our ultimate protection with ultra-long UVA filter. Invisible finish.',
        subCategory: 'Sunscreen'
    },
    {
        id: '25',
        name: 'Unseen Sunscreen SPF 40',
        brand: 'Supergoop!',
        price: 38.00,
        image: 'https://th.bing.com/th/id/R.0513e27738547a71dc345da80df4e703?rik=wfMI%2fmNpr1aIXQ&pid=ImgRaw&r=0',
        category: 'skincare',
        rating: 4.8,
        description: 'The original, totally invisible, weightless, scentless sunscreen with SPF 40.',
        subCategory: 'Sunscreen'
    },

    // MASQUES
    {
        id: '26',
        name: 'Water Sleeping Mask',
        brand: 'Laneige',
        price: 28.00,
        image: 'https://tse3.mm.bing.net/th/id/OIP.QKA-G_Z9Xboe-ui1Z2EsdgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'skincare',
        rating: 4.7,
        description: 'An overnight hydrating mask that delivers high doses of moisture to stressed, parched skin.',
        subCategory: 'Masks'
    },

    // SOINS CORPS
    {
        id: '27',
        name: 'Huile Prodigieuse',
        brand: 'Nuxe',
        price: 32.00,
        image: 'https://tse4.mm.bing.net/th/id/OIP.aETZCogUgHz6BFOGkS5zLQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'skincare',
        rating: 4.9,
        description: 'The legendary dry oil with 7 precious botanical oils to nourish, repair, and beautify face, body, and hair.',
        subCategory: 'Body'
    },

    // --- PARFUMS (Fragrances) ---
    // FÉMININS
    {
        id: '28',
        name: 'Coco Mademoiselle',
        brand: 'Chanel',
        price: 115.00,
        image: 'https://tse4.mm.bing.net/th/id/OIP.CCv86BzTgFUP8NvL6rEtowHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'fragrance',
        rating: 5.0,
        description: 'A feminine, oriental, fresh fragrance. Sparks of vibrant and fresh orange immediately awaken the senses.',
        subCategory: 'Women'
    },
    {
        id: '29',
        name: 'J\'adore',
        brand: 'Dior',
        price: 108.00,
        image: 'https://tse3.mm.bing.net/th/id/OIP.2yVfKdyPXTBap-anutN5gAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'fragrance',
        rating: 4.8,
        description: 'An iconic floral bouquet. A custom-made flower, finely crafted down to the last detail.',
        subCategory: 'Women'
    },
    {
        id: '30',
        name: 'Black Opium',
        brand: 'Yves Saint Laurent',
        price: 105.00,
        image: 'https://tse4.mm.bing.net/th/id/OIP.Ji07adQ1DyrTnbxbnk_yAAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'fragrance',
        rating: 4.9,
        description: 'A captivating floral gourmand scent, twisted with an overdose of black coffee and vanilla.',
        subCategory: 'Women'
    },

    // MASCULINS
    {
        id: '31',
        name: 'Sauvage',
        brand: 'Dior',
        price: 85.00,
        image: 'https://fimgs.net/mdimg/secundar/o.51827.jpg',
        category: 'fragrance',
        rating: 4.8,
        description: 'A radically fresh composition, dictated by a name that has the ring of a manifesto.',
        subCategory: 'Men'
    },
    {
        id: '32',
        name: 'Bleu de Chanel',
        brand: 'Chanel',
        price: 92.00,
        image: 'https://tse1.mm.bing.net/th/id/OIP.2y7MenfgOwr0oFIRc60DqAHaHa?w=600&h=600&rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'fragrance',
        rating: 4.9,
        description: 'A woody, aromatic fragrance for the man who defies convention.',
        subCategory: 'Men'
    },
    {
        id: '33',
        name: 'Aventus',
        brand: 'Creed',
        price: 285.00,
        image: 'https://tse4.mm.bing.net/th/id/OIP.ytmzEb0q_P6eYIlFzuUIMQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'fragrance',
        rating: 5.0,
        description: 'The exceptional Aventus was inspired by the dramatic life of a historic emperor, celebrating strength, power, and success.',
        subCategory: 'Men'
    },

    // UNISEXE
    {
        id: '34',
        name: 'Santal 33',
        brand: 'Le Labo',
        price: 195.00,
        image: 'https://tse1.mm.bing.net/th/id/OIP.efPzp-16MRqgzsCnJC1MpwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'fragrance',
        rating: 4.7,
        description: 'A sensorially defining icon of the New York Times, Santal 33 is a perfume that introduces the use of cardamom, iris, violet, and ambrox.',
        subCategory: 'Unisex'
    },
    {
        id: '35',
        name: 'Gypsy Water',
        brand: 'Byredo',
        price: 165.00,
        image: 'https://tse3.mm.bing.net/th/id/OIP.O1dI6PEcumTBcmxrxybkFAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'fragrance',
        rating: 4.6,
        description: 'An ode to the beauty of Romani culture, its unique customs, intimate beliefs, and distinguished way of living.',
        subCategory: 'Unisex'
    },
    {
        id: '36',
        name: 'Wood Sage & Sea Salt',
        brand: 'Jo Malone London',
        price: 68.00,
        image: 'https://tse4.mm.bing.net/th/id/OIP.5RTaRWx7EB2t_fhCqeAgyAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'fragrance',
        rating: 4.8,
        description: 'Escape the everyday along the windswept shore. Waves breaking white, the air fresh with sea salt and spray.',
        subCategory: 'Unisex'
    }
];

export const getProductsByCategory = (categoryId) => {
    if (categoryId === 'all') return sampleProducts;
    return sampleProducts.filter(product => product.category === categoryId);
};
