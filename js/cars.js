// ==============================
// MCVID CARS DATABASE
// ==============================

const cars = [
  // ==============================
  // 1. Toyota Land Cruiser Prado
  // ==============================
  {
    id: "prado2020",
    name: "Toyota Land Cruiser Prado 2020",
    featured: true,
    type: "SUV",
    price_usd: 52000,
    price_ugx: 195000000,
    year: 2020,
    engine: "2.7L Petrol",
    horsepower: "164 HP",
    fuel: "Petrol",
    fuel_consumption: "10.8 km/l",
    transmission: "Automatic",
    seats: 7,
    mileage: "45,000 km",
    condition: "Used",
    color: "Pearl White",
    owner: "Mcvid",
    location: "Kampala, Uganda",
    features: [
      "Leather interior",
      "Sunroof",
      "Reverse camera",
      "Bluetooth",
      "4WD",
    ],
    images: [
      "../images/Cars/prado2020/one.png",
      "../images/Cars/prado2020/two.png",
      "../images/Cars/prado2020/three.jpg",
    ],
  },

  // ==============================
  // 2. Toyota Harrier 2018
  // ==============================
  {
    id: "harrier2018",
    name: "Toyota Harrier 2018",
    featured: true,
    type: "SUV",
    price_usd: 26000,
    price_ugx: 95000000,
    year: 2018,
    engine: "2.0L Petrol",
    horsepower: "151 HP",
    fuel: "Petrol",
    fuel_consumption: "14.5 km/l",
    transmission: "Automatic",
    seats: 5,
    mileage: "67,000 km",
    condition: "Used",
    color: "Black",
    owner: "Mcvid",
    location: "Kampala, Uganda",
    features: ["Push start", "Sport mode", "Lane assist", "Reversing sensors"],
    images: [
      "../images/Cars/harrier2018/one.jpg",
      "../images/Cars/harrier2018/two.webp",
      "../images/Cars/harrier2018/three.jpg",
    ],
  },

  // ==============================
  // 3. Toyota Vitz 2012
  // ==============================
  {
    id: "vitz2012",
    name: "Toyota Vitz 2012",
    type: "Hatchback",
    price_usd: 5800,
    price_ugx: 21500000,
    year: 2012,
    engine: "1.3L",
    horsepower: "94 HP",
    fuel: "Petrol",
    fuel_consumption: "18.0 km/l",
    transmission: "Automatic",
    seats: 5,
    mileage: "98,000 km",
    condition: "Used",
    color: "Silver",
    owner: "Mcvid",
    location: "Wakiso, Uganda",
    features: ["Keyless entry", "Eco mode", "Compact design"],
    images: [
      "../images/Cars/vitz2012/one.jpg",
      "../images/Cars/vitz2012/two.jpg",
      "../images/Cars/vitz2012/three.jpg",
    ],
  },

  // ==============================
  // 4. Mercedes C200 2016
  // ==============================
  {
    id: "c2002016",
    name: "Mercedes-Benz C200 2016",
    type: "Sedan",
    price_usd: 28000,
    price_ugx: 103000000,
    year: 2016,
    engine: "2.0L Turbo",
    horsepower: "184 HP",
    fuel: "Petrol",
    fuel_consumption: "12.4 km/l",
    transmission: "Automatic",
    seats: 5,
    mileage: "54,000 km",
    condition: "Used",
    color: "Black",
    owner: "Mcvid",
    location: "Kampala, Uganda",
    features: ["Ambient lighting", "Cream interior", "Navigation system"],
    images: [
      "../images/Cars/c2002016/one.jpg",
      "../images/Cars/c2002016/two.png",
      "../images/Cars/c2002016/three.avif",
    ],
  },

  // ==============================
  // 5. Subaru Forester 2015
  // ==============================
  {
    id: "forester2015",
    name: "Subaru Forester 2015",
    type: "SUV",
    price_usd: 15000,
    price_ugx: 55000000,
    year: 2015,
    engine: "2.0L Boxer",
    horsepower: "150 HP",
    fuel: "Petrol",
    fuel_consumption: "13.0 km/l",
    transmission: "Automatic",
    seats: 5,
    mileage: "110,000 km",
    condition: "Used",
    color: "Dark Blue",
    owner: "Mcvid",
    location: "Entebbe, Uganda",
    features: ["AWD", "Sunroof", "Cruise control"],
    images: [
      "../images/Cars/forester2015/one.jpg",
      "../images/Cars/forester2015/two.avif",
      "../images/Cars/forester2015/three.jpg",
    ],
  },

  // ==============================
  // 6. Toyota Mark X 2012
  // ==============================
  {
    id: "fielder",
    name: "Toyota Fielder",
    type: "Sedan",
    price_usd: 12000,
    price_ugx: 44000000,
    year: 2012,
    engine: "2.5L V6",
    horsepower: "203 HP",
    fuel: "Petrol",
    fuel_consumption: "11.0 km/l",
    transmission: "Automatic",
    seats: 5,
    mileage: "90,000 km",
    condition: "Used",
    color: "White",
    owner: "Mcvid",
    location: "Kampala",
    features: ["Sport mode", "Powerful acceleration", "Keyless entry"],
    images: [
      "../images/Cars/fielder/one.jpg",
      "../images/Cars/fielder/two.webp",
      "../images/Cars/fielder/three.jpg",
    ],
  },

  // ==============================
  // 7. Range Rover Evoque 2017
  // ==============================
  {
    id: "gwagon2017",
    name: "Mercedes-Benz G-Wagon 2017",
    featured: true,
    type: "SUV",
    price_usd: 38000,
    price_ugx: 140000000,
    year: 2017,
    engine: "2.0L Turbo",
    horsepower: "240 HP",
    fuel: "Petrol",
    fuel_consumption: "11.5 km/l",
    transmission: "Automatic",
    seats: 5,
    mileage: "60,000 km",
    condition: "Used",
    color: "Red",
    owner: "Mcvid",
    location: "Kampala",
    features: ["Panoramic roof", "Premium sound system", "Reverse camera"],
    images: [
      "../images/Cars/gwagon2017/one.webp",
      "../images/Cars/gwagon2017/two.avif",
      "../images/Cars/gwagon2017/three.avif",
    ],
  },

  // ==============================
  // 8. Toyota Noah 2014
  // ==============================
  {
    id: "noah2014",
    name: "Toyota Noah 2014",
    featured: true,
    type: "Van",
    price_usd: 14000,
    price_ugx: 51000000,
    year: 2014,
    engine: "2.0L",
    horsepower: "152 HP",
    fuel: "Petrol",
    fuel_consumption: "13.5 km/l",
    transmission: "Automatic",
    seats: 8,
    mileage: "120,000 km",
    condition: "Used",
    color: "Silver",
    owner: "Mcvid",
    location: "Kampala",
    features: ["Spacious interior", "Dual sliding doors", "Air conditioning"],
    images: [
      "../images/Cars/noah2014/one.jpg",
      "../images/Cars/noah2014/two.jpg",
      "../images/Cars/noah2014/three.avif",
    ],
  },

  // ==============================
  // 9. BMW X5 2015
  // ==============================
  {
    id: "x5_2015",
    name: "BMW X5 2015",
    type: "SUV",
    price_usd: 43000,
    price_ugx: 158000000,
    year: 2015,
    engine: "3.0L TwinPower Turbo",
    horsepower: "300 HP",
    fuel: "Petrol",
    fuel_consumption: "10.3 km/l",
    transmission: "Automatic",
    seats: 5,
    mileage: "70,000 km",
    condition: "Used",
    color: "White",
    owner: "Mcvid",
    location: "Kampala",
    features: ["Leather seats", "Navigation", "Parking sensors"],
    images: [
      "../images/Cars/x5_2015/one.jpg",
      "../images/Cars/x5_2015/two.avif",
      "../images/Cars/x5_2015/three.webp",
    ],
  },

  // ==============================
  // 10. Toyota Hilux 2019
  // ==============================
  {
    id: "hilux2019",
    name: "Toyota Hilux 2019",
    featured: true,
    type: "Pickup",
    price_usd: 33000,
    price_ugx: 121000000,
    year: 2019,
    engine: "2.8L Diesel",
    horsepower: "174 HP",
    fuel: "Diesel",
    fuel_consumption: "10.6 km/l",
    transmission: "Manual",
    seats: 5,
    mileage: "40,000 km",
    condition: "Used",
    color: "Grey",
    owner: "Mcvid",
    location: "Fort Portal",
    features: ["Strong suspension", "4WD", "Cargo bed liner"],
    images: [
      "../images/Cars/hilux2019/one.jpg",
      "../images/Cars/hilux2019/two.jpg",
      "../images/Cars/hilux2019/three.avif",
    ],
  },

  // ==============================
  // 11. Toyota Sienta
  // ==============================
  {
    id: "seinta",
    name: "Toyota Sienta",
    featured: true,
    type: "MPV",
    price_usd: 12500,
    price_ugx: 48000000,
    year: 2016,
    engine: "1.5L",
    horsepower: "107 HP",
    fuel: "Petrol",
    fuel_consumption: "18.0 km/l",
    transmission: "Automatic",
    seats: 7,
    mileage: "85,000 km",
    condition: "Used",
    color: "Beige",
    owner: "Mcvid",
    location: "Kampala",
    features: ["Sliding doors", "Fuel efficient", "Spacious"],
    images: [
      "../images/Cars/Seinta/one.jpg",
      "../images/Cars/Seinta/two.webp",
      "../images/Cars/Seinta/three.jpg"
    ]
  },

  // ==============================
  // 12. Toyota PickUp (Generic)
  // ==============================
  {
    id: "pickup",
    name: "Toyota PickUp",
    featured: true,
    type: "Pickup",
    price_usd: 12500,
    price_ugx: 48000000,
    year: 2010,
    engine: "2.5L Diesel",
    horsepower: "100 HP",
    fuel: "Diesel",
    fuel_consumption: "12.0 km/l",
    transmission: "Manual",
    seats: 2,
    mileage: "150,000 km",
    condition: "Used",
    color: "White",
    owner: "Mcvid",
    location: "Gulu",
    features: ["Heavy duty", "Large bed", "Reliable"],
    images: [
      "../images/Cars/Pick Up/one.avif",
      "../images/Cars/Pick Up/two.jpg",
      "../images/Cars/Pick Up/three.jpg"
    ]
  },

  // ==============================
  // 13. Toyota Fortuner
  // ==============================
  {
    id: "fortuner",
    name: "Toyota Fortuner",
    featured: true,
    type: "SUV",
    price_usd: 47000,
    price_ugx: 180000000,
    year: 2018,
    engine: "2.8L Diesel",
    horsepower: "174 HP",
    fuel: "Diesel",
    fuel_consumption: "11.0 km/l",
    transmission: "Automatic",
    seats: 7,
    mileage: "55,000 km",
    condition: "Used",
    color: "Black",
    owner: "Mcvid",
    location: "Kampala",
    features: ["Luxury interior", "4WD", "Touchscreen"],
    images: [
      "../images/Cars/Fortuner/one.jpg",
      "../images/Cars/Fortuner/two.jpeg",
      "../images/Cars/Fortuner/three.jpg"
    ]
  },

  // ==============================
  // 14. Mercedes-Benz GLE
  // ==============================
  {
    id: "gle",
    name: "Mercedes-Benz GLE",
    type: "SUV",
    price_usd: 55000,
    price_ugx: 205000000,
    year: 2019,
    engine: "3.0L V6",
    horsepower: "362 HP",
    fuel: "Petrol",
    fuel_consumption: "9.5 km/l",
    transmission: "Automatic",
    seats: 5,
    mileage: "45,000 km",
    condition: "Used",
    color: "Grey",
    owner: "Mcvid",
    location: "Kampala",
    features: ["Premium Audio", "Leather seats", "Panoramic roof"],
    images: [
      "../images/Cars/GLE/one.webp",
      "../images/Cars/GLE/two.png",
      "../images/Cars/GLE/three.jpg"
    ]
  },
];

// ==============================
// TEMPLATE FOR UNLIMITED CARS
// Copy & add more cars easily!
// ==============================

/*
{
  id: "",
  name: "",
  type: "",
  price_usd: 0,
  price_ugx: 0,
  year: "",
  engine: "",
  horsepower: "",
  fuel: "",
  fuel_consumption: "",
  transmission: "",
  seats: "",
  mileage: "",
  condition: "",
  color: "",
  owner: "Mcvid",
  location: "",
  features: [],
  images: [
    "../images/Cars/<id>/one.png",
    "../images/Cars/<id>/two.png",
    "../images/Cars/<id>/three.png"
  ]
}
*/
