export const WASTE_KNOWLEDGE = {
    'bottle': {
        image: '/assets/items/bottle.png',
        transformedImage: '/assets/transformed/apparel.png',
        fun_fact: "Plastic bottles can take up to 450 years to decompose in a landfill. Only about 9% of all plastic ever made has been recycled.",
        transformation: "Most are shredded into 'flakes', washed, and spun into high-performance polyester fibers for sustainable apparel or new containers.",
        impact: "Recycling one ton of PET bottles saves 3.8 barrels of oil and prevents 1.5 tons of carbon emissions.",
        tips: [
            "Empty all liquids and rinse briefly to prevent contamination.",
            "Crush the bottle to save space in the recycling bin.",
            "Keep the cap on; most modern facilities can process them together."
        ],
        numericalImpact: { co2: 150, water: 2500, energy: 30 }
    },
    'cup': {
        image: '/assets/items/cup.png',
        transformedImage: '/assets/transformed/tiles.png',
        fun_fact: "Ceramic cups are made from natural clay but can take thousands of years to decompose in a landfill. Reusing a single cup can save hundreds of paper alternatives.",
        transformation: "Broken ceramic is crushed and fired into high-durability floor tiles or used as aggregate in sustainable building materials.",
        impact: "Recycling ceramic prevents the mining of new clay and reduces kiln energy consumption by 15%.",
        tips: [
            "If just chipped, consider repairing with 'Kintsugi' or repurposing as a planter.",
            "Check if your local facility accepts ceramic 'hardcore' for construction fill.",
            "Ceramic is NOT accepted in regular glass recycling bins."
        ],
        numericalImpact: { co2: 80, water: 500, energy: 15 }
    },
    'book': {
        image: '/assets/items/newspaper.png',
        transformedImage: '/assets/transformed/paper.png',
        fun_fact: "Recycling one ton of paper (books/notebooks) saves 17 trees, 7,000 gallons of water, and 463 gallons of oil.",
        transformation: "The ink is removed through 'de-inking', and the fibers are pulped to create recycled office paper or cardboard packaging.",
        impact: "Paper recycling reduces sulfur dioxide emissions (a cause of acid rain) by nearly 30% compared to virgin paper production.",
        tips: [
            "Remove any plastic wraps or heavy glue from the spine if possible.",
            "Hardcover books should have the cover removed as it's often non-recyclable.",
            "Donate books in good condition to local libraries or charities instead."
        ],
        numericalImpact: { co2: 1200, water: 5000, energy: 400 }
    },
    'paper': {
        image: '/assets/items/cardboard.png',
        transformedImage: '/assets/transformed/paper.png',
        fun_fact: "Paper can be recycled 5 to 7 times before the fibers become too short to be reused.",
        transformation: "Separated into grades, mixed with water to form pulp, and pressed into new paper sheets or egg cartons.",
        impact: "Producing recycled paper uses 40% less energy than making it from raw wood pulp.",
        tips: [
            "Do not recycle paper that is wet or stained with food/grease.",
            "Remove any plastic windows from envelopes before recycling.",
            "Shredded paper should be placed in a paper bag to prevent littering."
        ],
        numericalImpact: { co2: 300, water: 1000, energy: 100 }
    },
    'can': {
        image: '/assets/items/can.png',
        transformedImage: '/assets/transformed/metal.png',
        fun_fact: "Aluminum is 'infinitely' recyclable. It can go from the recycling bin to a store shelf as a new can in as little as 60 days.",
        transformation: "Melted down in large furnaces to remove impurities and cast into huge ingots, then rolled into thin sheets for new cans.",
        impact: "Recycling aluminum saves 95% of the energy needed to create it from raw bauxite ore.",
        tips: [
            "Rinse out any remaining residue to keep the recycling stream clean.",
            "Do not crush cans if your local facility uses automated sorting.",
            "Check if the tab can be donated to local charity programs."
        ],
        numericalImpact: { co2: 200, water: 0, energy: 200 }
    },
    'metal': {
        image: '/assets/items/can.png',
        transformedImage: '/assets/transformed/metal.png',
        fun_fact: "Metal is infinitely recyclable. Recycling a single aluminum can saves enough energy to run a TV for three hours!",
        transformation: "Melted down and purified, then rolled into flat sheets for new manufacturing.",
        impact: "Reduces the need for destructive mining and saves up to 95% of the energy used for virgin production.",
        tips: ["Rinse thoroughly", "Do not crush if using automated sorting", "Check for local scrap metal programs."],
        numericalImpact: { co2: 250, water: 0, energy: 250 }
    },
    'tin': {
        image: '/assets/items/tin.png',
        transformedImage: '/assets/transformed/steel_beam.png',
        fun_fact: "Steel is the most recycled material in the world. Every ton of recycled steel saves 2,500 pounds of iron ore.",
        transformation: "Purified using electrolysis and rolled into sheets for use in cars, appliances, and building structures.",
        impact: "Using recycled steel instead of virgin ore reduces air pollution by 86% and water waste by 76%.",
        tips: [
            "Rinse the can thoroughly and remove the label if possible.",
            "Place the lid inside the can and crimp the top to prevent injury.",
            "Check for 'Recyclable Steel' logos to confirm local acceptance."
        ],
        numericalImpact: { co2: 300, water: 0, energy: 300 }
    },
    'glass': {
        image: '/assets/items/glass.png',
        transformedImage: '/assets/transformed/cullet.png',
        fun_fact: "Glass never wears out—it can be recycled forever. A glass bottle buried today would take 4,000 years to decompose.",
        transformation: "Crushed into 'cullet', mixed with sand and soda ash, and melted into new decorative glass, bottles, or fiberglass.",
        impact: "Adding recycled glass to the mix reduces the furnace temperature, saving energy and extending the life of the manufacturing plant.",
        tips: [
            "Sort by color (clear, green, brown) if required by your local program.",
            "Remove metal caps and rings, as they are processed separately.",
            "Never include Pyrex, mirrors, or window glass in your recycling bin."
        ],
        numericalImpact: { co2: 100, water: 100, energy: 50 }
    },
    'jar': {
        image: '/assets/items/jar.png',
        transformedImage: '/assets/transformed/cullet.png',
        fun_fact: "Glass jars are often more efficiently recycled than bottles due to their thick, durable nature.",
        transformation: "Crushed, cleaned, and melted. Some are also sterilized and reused directly in local refill programs.",
        impact: "Recycling 1,000 tons of glass creates 8 more jobs than simply sending it to a landfill.",
        tips: [
            "Rinse off all food residue, especially sticky sauces or oils.",
            "Remove labels if they are easily peelable, though most facilities can handle them.",
            "Reuse jars at home for bulk food storage or DIY projects."
        ],
        numericalImpact: { co2: 150, water: 150, energy: 80 }
    },
    'banana': {
        image: '/assets/items/banana.png',
        transformedImage: '/assets/transformed/compost.png',
        fun_fact: "Banana peels are 100% biodegradable and exceptionally rich in potassium and phosphorus—perfect for plant growth.",
        transformation: "Broken down by microbes in a compost pile to create 'Black Gold' soil or converted into methane gas for green energy.",
        impact: "Diverting organics from landfills prevents methane gas production, a greenhouse gas 25x more potent than CO2.",
        tips: [
            "Remove any plastic stickers or produce ties before composting.",
            "Cut into smaller pieces to speed up the decomposition process.",
            "Avoid adding to a 'dry' bin to prevent attracting pests."
        ]
    },
    'apple': {
        image: '/assets/items/apple.png',
        transformedImage: '/assets/transformed/compost.png',
        fun_fact: "Food waste represents nearly 24% of municipal solid waste. An apple core can take just 2 weeks to compost.",
        transformation: "Naturally decomposed into nutrient-rich humus that improves soil structure and water retention.",
        impact: "Every kilogram of food waste composted saves the equivalent of 1.5 kg of CO2 emissions.",
        tips: [
            "Keep in a sealed organic waste bin to manage odors.",
            "Apple seeds contain tiny amounts of cyanide—composting safely neutralizes this.",
            "Perfect for vermicomposting (worm bins) as they break down quickly."
        ]
    },
    'coffee': {
        image: '/assets/items/coffee.png',
        transformedImage: '/assets/transformed/soil.png',
        fun_fact: "Spent coffee grounds are highly nitrogenous. They can also be used as a natural abrasive for cleaning!",
        transformation: "Mixed with brown materials (leaves/paper) to balance nitrogen levels in compost, creates premium fertilizer.",
        impact: "Recycled grounds are used as a sustainable alternative to synthetic chemical fertilizers.",
        tips: [
            "Paper filters are also compostable and can be tossed in together.",
            "Spread thin if adding directly to soil to avoid mold growth.",
            "Mix with dried leaves to prevent the grounds from clumping."
        ],
        numericalImpact: { co2: 50, water: 200, energy: 0 }
    },
    'egg': {
        image: '/assets/items/egg.png',
        transformedImage: '/assets/transformed/soil.png',
        fun_fact: "Eggshells are almost entirely calcium carbonate. They take about 6 months to break down fully in soil.",
        transformation: "Crushed into fine powder and used as a mineral supplement for soil or added to chicken feed.",
        impact: "Keeps organic minerals in the local ecosystem rather than burying them in a landfill.",
        tips: [
            "Crush them before composting to help them break down faster.",
            "Rinse briefly if you're worried about attracting pests or odors.",
            "Sprinkle crushed shells around plants to deter slugs and snails."
        ],
        numericalImpact: { co2: 20, water: 50, energy: 0 }
    },
    'phone': {
        image: '/assets/items/phone.png',
        transformedImage: '/assets/transformed/minerals.png',
        fun_fact: "One ton of old cell phones contains more gold than many gold mines. They also contain silver, palladium, and copper.",
        transformation: "Dismantled to recover rare earth metals. Circuit boards are refined to save precious minerals.",
        impact: "Proper E-waste recycling prevents lead, mercury, and cadmium from leaching into our groundwater.",
        tips: [
            "Perform a factory reset to protect your personal data.",
            "Remove the SIM card and any external memory cards.",
            "Take to a dedicated E-waste collection point or retailer program."
        ],
        numericalImpact: { co2: 5000, water: 10000, energy: 2000 }
    },
    'laptop': {
        image: '/assets/items/laptop.png',
        transformedImage: '/assets/transformed/minerals.png',
        fun_fact: "Up to 98% of a laptop is recyclable, including the glass screen, plastic casing, and metal internal components.",
        transformation: "Working parts are refurbished (re-use). Non-working parts are shredded and sorted by material for industrial re-use.",
        impact: "Prevents hazardous lithium-ion batteries from causing fires in traditional waste trucks and facilities.",
        tips: [
            "Securely wipe your hard drive using data destruction software.",
            "Recycle the power cables and peripherals at the same time.",
            "Consult manufacturer take-back programs for potential credit."
        ],
        numericalImpact: { co2: 15000, water: 20000, energy: 5000 }
    },
    'battery': {
        image: '/assets/items/battery.png',
        transformedImage: '/assets/transformed/minerals.png',
        fun_fact: "Batteries contain corrosive acids and toxic heavy metals. A single AA battery can contaminate 400 liters of water.",
        transformation: "Metals like nickel, cadmium, and steel are extracted through specialized thermal or chemical processes.",
        impact: "Recycling ensures that limited minerals (like Cobalt) can be used for the next generation of electric vehicles.",
        tips: [
            "Tape the terminals of lithium or 9V batteries to prevent short circuits.",
            "Never place batteries in your regular trash or recycling bin.",
            "Store in a cool, dry plastic container until you can drop them off safely."
        ],
        numericalImpact: { co2: 2000, water: 500, energy: 500 }
    },
    'pizza': {
        image: '/assets/items/pizza.png',
        transformedImage: '/assets/transformed/energy.png',
        fun_fact: "Grease and food oil contaminate paper fibers, making them impossible to recycle into new paper.",
        transformation: "If purely organic, it's composted. If heavily soiled, it's processed in modern waste-to-energy plants for electricity.",
        impact: "Burning soiled waste efficiently provides steam and power to thousands of homes while reducing landfill volume.",
        tips: [
            "Tear off the clean top half of the box for recycling.",
            "Place the greasy bottom half in the compost or regular trash.",
            "Ensure no plastic 'pizza savers' are left inside the box."
        ],
        numericalImpact: { co2: 100, water: 0, energy: 100 }
    },
    'styrofoam': {
        image: '/assets/items/styrofoam.png',
        transformedImage: '/assets/transformed/park_bench.png',
        fun_fact: "Styrofoam is 95% air but stays in the environment for over 500 years. It is notoriously difficult and expensive to recycle.",
        transformation: "Densified into blocks and used for picture frames, crown molding, or park benches.",
        impact: "Keeping foam out of the ocean protects marine life from ingesting micro-plastics.",
        tips: [
            "Look for a #6 recycling symbol, though most curbside programs reject it.",
            "Check for dedicated drop-off centers that specifically accept EPS foam.",
            "Reuse as packing material for shipping fragile items."
        ],
        numericalImpact: { co2: 10, water: 0, energy: 5 }
    },
    'plastic bag': {
        image: '/assets/items/plastic_bag.png',
        transformedImage: '/assets/transformed/lumber.png',
        fun_fact: "The average plastic bag is used for 12 minutes but stays in the environment for up to 1,000 years.",
        transformation: "Shredded, washed, and turned into 'plastic lumber' used for decks, fences, and playground equipment.",
        impact: "Preventing bag litter saves thousands of marine animals who mistake them for food every year.",
        tips: [
            "Never put these in your curbside bin; they tangle sorting machines.",
            "Return them to grocery store collection bins for proper processing.",
            "Ensure they are completely empty and dry before disposal."
        ],
        numericalImpact: { co2: 30, water: 0, energy: 10 }
    },
    'plastic': {
        image: '/assets/items/plastic_bag.png',
        transformedImage: '/assets/transformed/lumber.png',
        fun_fact: "Not all plastics are equal. Look for the resin code (1-7) to determine how it should be recycled.",
        transformation: "Shredded, washed, and melted into pellets for new products or durable plastic lumber.",
        impact: "Prevents microplastics from entering the food chain and preserves marine life.",
        tips: ["Check for the recycling symbol", "Ensure it's clean and dry", "Avoid mixing different types of plastics."],
        numericalImpact: { co2: 150, water: 100, energy: 20 }
    },
    'polythene': {
        image: '/assets/items/plastic_bag.png',
        transformedImage: '/assets/transformed/lumber.png',
        fun_fact: "Polythene (PE) is the most common plastic. It's used for everything from shopping bags to bulletproof vests.",
        transformation: "Can be melted down and extruded into new film or used as a binder in composite materials.",
        impact: "Recycling polythene reduces crude oil consumption and lowers landfill density.",
        tips: ["Return soft plastics to store drop-offs", "Make sure it's free of food residue", "Do not recycle with rigid plastics."],
        numericalImpact: { co2: 50, water: 50, energy: 10 }
    },
    'vase': {
        image: '/assets/items/vase.png',
        transformedImage: '/assets/transformed/cullet.png',
        fun_fact: "Glass vases are one of the most durable glass products. They are often reused for decades before recycling.",
        transformation: "Melted at high temperatures (2600°F) to create new glass containers, insulation, or filtration media.",
        impact: "Using recycled glass reduces air pollution by 20% and water pollution by 50% compared to new glass.",
        tips: [
            "Verify it's not lead crystal, which cannot be recycled with regular glass.",
            "If it's just dusty, a quick wash makes it highly valuable for reuse.",
            "Consider donating to a florist or thrift store instead of recycling."
        ],
        numericalImpact: { co2: 500, water: 500, energy: 100 }
    }
};

export const DEFAULT_KNOWLEDGE = {
    'Recycle': {
        fun_fact: "This item is primarily dry waste. If cleaned properly, it has high value in the circular economy.",
        transformation: "It will be sorted by infrared sensors at a Material Recovery Facility (MRF) and sold as raw manufacturing feedstock.",
        impact: "Every item you recycle moves us one step closer to a zero-waste future and preserves natural habitats.",
        tips: [
            "Ensure the item is empty, clean, and dry.",
            "Do not bag your recyclables; leave them loose in the bin.",
            "Check the local rules for specific material acceptance."
        ]
    },
    'Organic': {
        fun_fact: "Organic matter is the 'battery' of the earth, storing nutrients that must be returned to the soil.",
        transformation: "It undergores aerobic decomposition to become fertilizer or anaerobic digestion to generate bio-gas.",
        impact: "Organic recycling reduces the need for chemical fertilizers and helps soil retain 20% more moisture.",
        tips: [
            "Exclude any meat, dairy, or oils unless local rules allow them.",
            "Use compostable bags or line your bin with newspaper.",
            "Aim for a mix of 'greens' (food) and 'browns' (leaves/paper)."
        ]
    },
    'Hazardous': {
        fun_fact: "Hazardous waste accounts for only 1% of total waste but causes 90% of toxic contamination issues.",
        transformation: "It is chemically neutralized or safely encapsulated in specialized facilities to prevent environmental leakage.",
        impact: "By scanning this, you've prevented toxins from potentially entering the human food chain through soil or water.",
        tips: [
            "Keep items in their original packaging to help identification.",
            "Store safely away from children and pets until disposal.",
            "Never pour hazardous liquids down the drain or onto the ground."
        ]
    },
    'Landfill': {
        fun_fact: "Landfill space is a finite resource. Modern landfills are engineered with complex liners and gas capture systems.",
        transformation: "It will be compacted and permanently stored. In some cities, it is converted into electricity through incineration.",
        impact: "Reducing landfill waste saves cities millions in management costs and prevents land degradation.",
        tips: [
            "Minimize use of single-use items to reduce landfill load.",
            "Bag your trash securely to prevent litter and odors.",
            "Consider if the item can be repaired or donated first."
        ]
    }
};
