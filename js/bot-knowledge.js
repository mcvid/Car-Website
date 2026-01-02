// bot-knowledge.js
// The "Brain" of Mcvid Bot - Contains Intents, Keywords, and Replies.

window.botKnowledge = {
  // 1. INTENTS (Goals the user might have)
  intents: [
    {
      id: "greeting",
      category: "general",
      keywords: {
        hello: 5,
        hi: 5,
        hey: 5,
        morning: 3,
        afternoon: 3,
        evening: 3,
        yo: 2,
        greeting: 2,
      },
      response: () =>
        "Hello! 👋 I'm your Mcvid AI Assistant. How can I help you find your dream car today?",
      threshold: 3,
    },
    {
      id: "help_general",
      category: "general",
      keywords: {
        help: 5,
        question: 4,
        ask: 4,
        assist: 4,
        support: 3,
        info: 3,
      },
      response: () =>
        "I can help you **Buy** a car, **Sell** your current one, or answer questions about **Maintenance** and **Financing**. What do you need?",
      threshold: 3,
    },
    {
      id: "buy_family_car",
      category: "buying",
      keywords: {
        family: 5,
        kids: 4,
        children: 4,
        space: 3,
        seats: 3,
        big: 2,
        van: 3,
        suv: 2,
        safety: 2,
        school: 2,
      },
      response: (entities) =>
        "For families, we highly recommend spacious SUVs or Vans. The **Toyota Noah**, **Alphard**, or **Harrier** are excellent choices with plenty of room and safety features.",
      effect: {
        type: "filter",
        params: { type: "suv" }, // Generalizing to SUV for family now, can be specific later
      },
    },
    {
      id: "efficiency_fuel",
      category: "buying",
      keywords: {
        fuel: 5,
        consumption: 4,
        economy: 4,
        efficient: 4,
        gas: 3,
        mileage: 3,
        hybrid: 5,
        save: 2,
        liter: 2,
      },
      response: (entities) =>
        "If fuel economy is your priority, **Hybrid** models are the best specific choice. A Toyota Fielder Hybrid or Vitz can save you up to 40% on fuel compared to standard engines.",
      effect: {
        type: "filter",
        params: { fuel: "hybrid" },
      },
      // Example of clarification usage
      needsClarification: false, // Set to true if we wanted to enforce asking "Petrol or Hybrid?" specifically, but here we assume hybrid recommendation.
    },
    {
      id: "buy_general", // New Generic Buy Intent for Clarification Demo
      category: "buying",
      keywords: {
        buy: 5,
        car: 4,
        looking: 4,
        purchase: 4,
        want: 3,
        need: 3,
        get: 3,
      },
      response: (entities) =>
        "We have a great selection! To help you better, specifically what kind of car are you looking for?",
      needsClarification: true,
      clarify:
        "Are you looking for a **Sedan**, **SUV**, or something fuel-efficient like a **Hybrid**?",
      threshold: 3,
    },
    {
      id: "performance_fast",
      category: "buying",
      keywords: {
        fast: 4,
        speed: 4,
        power: 4,
        engine: 3,
        turbo: 4,
        sport: 5,
        performance: 4,
        horsepower: 3,
      },
      response: (entities) =>
        "Looking for power? 🔥 You might enjoy our Turbocharged models or high-performance sedans like the **Subaru Forester XT** or **Mercedes C-Class**.",
      effect: {
        type: "filter",
        params: { type: "sedan" },
      },
    },
    {
      id: "luxury_comfort",
      category: "buying",
      keywords: {
        luxury: 5,
        comfort: 4,
        premium: 4,
        leather: 3,
        classy: 3,
        mercedes: 4,
        bmw: 4,
        lexus: 4,
        executive: 3,
      },
      response: (entities) =>
        "For a premium experience, our Luxury collection features top-tier brands like **Mercedes-Benz**, **BMW**, and **Land Cruiser**. Perfect for comfort and status.",
      effect: {
        type: "filter",
        params: { tag: "luxury" },
      },
    },
    {
      id: "budget_cheap",
      category: "buying",
      keywords: {
        cheap: 5,
        affordable: 5,
        low: 3,
        price: 3,
        budget: 4,
        cost: 3,
        deal: 2,
        money: 2,
        less: 2,
      },
      response: (entities) =>
        "We have great cars for every budget! 💰 Our most affordable reliable runners include the **Toyota Vitz**, **Passo**, and **Sienta**.",
      effect: {
        type: "sort",
        params: { sort: "price_asc" },
      },
    },
    {
      id: "offroad_tough",
      category: "buying",
      keywords: {
        offroad: 5,
        rough: 4,
        mud: 3,
        village: 3,
        strong: 3,
        "4x4": 5,
        awd: 4,
        terrain: 3,
        land: 2,
        cruiser: 2,
      },
      response: (entities) =>
        "Heading off-road? 🚜 You need a tough 4x4. The **Land Cruiser Prado** or **Hilux** are built to handle the toughest Ugandan terrain.",
      effect: {
        type: "filter",
        params: { type: "suv" },
      },
    },
    {
      id: "sell_car",
      category: "selling",
      keywords: {
        sell: 5,
        selling: 5,
        trade: 4,
        exchange: 3,
        market: 2,
        offer: 2,
      },
      response: (entities) =>
        "We can help you sell your car quickly! Please send us photos and details directly on WhatsApp for a valuation.",
      effect: {
        type: "link",
        params: {
          url: "https://wa.me/256751371252?text=I%20want%20to%20sell%20my%20car",
        },
      },
    },
    {
      id: "maintenance_oil",
      category: "maintenance",
      keywords: {
        oil: 5,
        service: 4,
        maintenance: 4,
        change: 3,
        engine: 2,
        filter: 2,
        lube: 2,
      },
      response: (entities) =>
        "Regular oil changes are vital! 🛠️ We recommend servicing your car every **5,000 km** for petrol and **3,000 km** for diesel engines to keep them running smoothly.",
      threshold: 3,
    },
    {
      id: "maintenance_overheat",
      category: "maintenance",
      keywords: {
        overheat: 5,
        hot: 4,
        temperature: 4,
        radiator: 4,
        coolant: 4,
        steam: 3,
        fan: 2,
      },
      response: (entities) =>
        "⚠️ **Do not drive if overheating!** Check your coolant level (when cool) and ensure your radiator fans are spinning. It's best to call a mechanic immediately.",
      threshold: 3,
    },
    {
      id: "financing_loan",
      category: "financing",
      keywords: {
        loan: 5,
        finance: 5,
        paying: 3,
        installment: 4,
        credit: 3,
        bank: 2,
        pay: 2,
        deposit: 3,
      },
      response: (entities) =>
        "Yes! We offer financing logic. typical terms are a **30-50% down payment** with the balance spread over 12-24 months. Interest rates vary by provider.",
      threshold: 3,
    },
    {
      id: "location_contact",
      category: "general",
      keywords: {
        location: 5,
        where: 4,
        address: 5,
        find: 3,
        situated: 3,
        office: 3,
        map: 3,
        contact: 3,
        number: 3,
        call: 3,
      },
      response: (entities) =>
        "📍 We are located in **Kampala, Uganda**. You can find us along Jinja Road near the main showroom. Call us at **075 137 1252** for directions!",
      threshold: 3,
    },
  ],

  // 2. ENTITY LISTS (Things found in text)
  entities: {
    brands: [
      "toyota",
      "nissan",
      "subaru",
      "mercedes",
      "bmw",
      "audi",
      "honda",
      "mitsubishi",
      "land rover",
      "mazda",
      "ford",
    ],
    types: [
      "suv",
      "sedan",
      "hatchback",
      "wagon",
      "van",
      "pickup",
      "convertible",
      "coupe",
    ],
    fuels: ["petrol", "diesel", "hybrid", "electric"],
  },

  // 3. FALLBACK (When no distinct match)
  fallback: {
    response:
      "I'm not entirely sure about that specific request. 🤔\n\nHowever, I can verify straight from our inventory or connect you with a human expert.",
    options: [
      {
        text: "Browse Inventory",
        effect: { type: "navigation", params: { url: "catalog.html" } },
      },
      {
        text: "Chat on WhatsApp",
        effect: { type: "link", params: { url: "https://wa.me/256751371252" } },
      },
    ],
  },
};
