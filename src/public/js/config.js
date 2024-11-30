const getFilterConfigProduct = () => ({
    years: [
        { value: '2024', name: '2024' },
        { value: '2023', name: '2023' },
        { value: '2022', name: '2022' },
        { value: '2021', name: '2021' },
        { value: '2020', name: '2020' },
        { value: '2019', name: '2019' },
        { value: '2018', name: '2018' },
    ],
    brands: [
        { name: 'Audi', value: 'audi' },
        { name: 'BMW', value: 'BMW' },
        { name: 'Ford', value: 'ford' },
        { name: 'Kia', value: 'kia' },
        { name: 'Honda', value: 'honda' },
        { name: 'Hyundai', value: 'hyundai' },
        { name: 'Mazda', value: 'mazda' },
        { name: 'Mercedes-Benz', value: 'mercedes-benz' },
        { name: 'Mitsubishi', value: 'mitsubishi' },
        { name: 'Toyota', value: 'toyota' },
        { name: 'Vinfast', value: 'vinfast' },
    ],
    statuses: [
        { value: 'new', name: 'New' },
        { value: 'used', name: 'Used' },
        { value: 'sold', name: 'Sold' },
    ],
    transmissions: [
        { value: 'manual', name: 'Manual' },
        { value: 'automatic', name: 'Automatic' },
    ],
    styles: [
        { value: 'sedan', name: 'Sedan' },
        { value: 'suv', name: 'SUV' },
        { value: 'truck', name: 'Truck' },
        { value: 'roadster', name: 'Roadster' },
    ],
    prices: [
        { priceMin: 0, priceMax: 50000, label: '0 - 50000' },
        { priceMin: 50000, priceMax: 100000, label: '50000 - 100000' },
        { priceMin: 100000, priceMax: 200000, label: '100000 - 200000' },
        { priceMin: 200000, priceMax: 5000000, label: '200000+' },
    ],
    perPages: [
        { value: 4, name: '4' },
        { value: 8, name: '8' },
        { value: 12, name: '12' },
        { value: 16, name: '16' },
        { value: 20, name: '20' },
    ]
})


export { getFilterConfigProduct }