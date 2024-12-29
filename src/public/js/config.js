const getFilterConfigProduct = () => ({
  years: [
    { value: "", label: "All" },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
    { value: '2018', label: '2018' },
  ],
  brands: [
    { value: "", label: "All" },
    { label: 'Audi', value: 'Audi' },
    { label: 'BMW', value: 'BMW' },
    { label: 'Ford', value: 'Ford' },
    { label: 'Kia', value: 'Kia' },
    { label: 'Honda', value: 'Honda' },
    { label: 'Hyundai', value: 'Hyundai' },
    { label: 'Mazda', value: 'Mazda' },
    { label: 'Mercedes-Benz', value: 'Mercedes-benz' },
    { label: 'Mitsubishi', value: 'Mitsubishi' },
    { label: 'Toyota', value: 'Toyota' },
    { label: 'Vinfast', value: 'Vinfast' },
  ],
  statuses: [
    { value: "", label: "All" },
    { value: 'new', label: 'New' },
    { value: 'used', label: 'Used' },
    { value: 'sold', label: 'Sold' },
  ],
  transmissions: [
    { value: "", label: "All" },
    { value: 'manual', label: 'Manual' },
    { value: 'automatic', label: 'Automatic' },
  ],
  styles: [
    { value: "", label: "All" },
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'truck', label: 'Truck' },
    { value: 'roadster', label: 'Roadster' },
  ],
  prices: [
    { value: '', label: 'All' },
    { value: '0 - 50000', label: '0 - 50000' },
    { value: '50000 - 100000', label: '50000 - 100000' },
    { value: '100000 - 200000', label: '100000 - 200000' },
    { value: '200000 - 5000000', label: ' > 200000' },
  ],
  perPages: [
    { value: 4, label: '4 / trang' },
    { value: 8, label: '8 / trang' },
    { value: 12, label: '12 / trang' },
    { value: 16, label: '16 / trang' },
    { value: 20, label: '20 / trang' },
  ],
  fuelTypes: [
    { value: "", label: "All" },
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid', label: 'Hybrid' },
  ],
});

// Admin/dashboard
const getFilterConfigAdminDashboard = () => ({
  time: [
    {
      value: "1",
      label: "1M"
    },
    {
      value: "3",
      label: "3M"
    },
    {
      value: "6",
      label: "6M"
    },
    {
      value: "12",
      label: "12M"
    },
  ]
})

const getFilterConfigOrder = () => ({
  statuses: [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'canceled', label: 'Canceled' },
  ],
  prices: [
    { priceMin: 0, priceMax: 50000, label: '0 - 50000' },
    { priceMin: 50000, priceMax: 100000, label: '50000 - 100000' },
    { priceMin: 100000, priceMax: 200000, label: '100000 - 200000' },
    { priceMin: 200000, priceMax: 5000000, label: '200000+' },
  ],
  perPages: [
    { value: 4, label: '4' },
    { value: 8, label: '8' },
    { value: 12, label: '12' },
    { value: 16, label: '16' },
    { value: 20, label: '20' },
  ],
  createdTime: [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ],
});

export { getFilterConfigProduct, getFilterConfigOrder, getFilterConfigAdminDashboard };
