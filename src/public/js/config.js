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
    { value: 4, label: '4 / page' },
    { value: 8, label: '8 / page' },
    { value: 12, label: '12 / page' },
    { value: 16, label: '16 / page' },
    { value: 20, label: '20 / page' },
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
// Admin/accounts 
const getFilterConfigAdminAccounts = () => ({
  status: [
    { value: '', label: 'All' },
    { value: 'active', label: "Active" },
    { value: 'inactive', label: "Inactive" },
    { value: 'suspended', label: "Suspended" },
  ],
  role: [
    { value: '', label: 'All' },
    { value: 'sadmin', label: "Super Admin" },
    { value: 'admin', label: "Admin" },
    { value: 'suspended', label: "Suspended" },
  ],
  sortBy: [
    { value: '', label: 'Sort by' },
    { value: 'fullName', label: 'Fullname' },
    { value: 'email', label: 'Email' },
    { value: 'createdAt', label: 'Created at' },
    { value: 'lastLogin', label: 'Last login' },
  ],
  direction: [
    { value: 'asc', label: "Ascending" },
    { value: 'desc', label: "Descending" },
  ],
  offset: [
    { value: "10", label: "10 / page" },
    { value: "15", label: "15 / page" },
    { value: "20", label: "20 / page" },
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
    { value: '', label: 'All' },
    { value: '0 - 50000', label: '0 - 50000' },
    { value: '50000 - 100000', label: '50000 - 100000' },
    { value: '100000 - 200000', label: '100000 - 200000' },
    { value: '200000 - 5000000', label: ' > 200000' },
  ],
  perPages: [
    { value: 4, label: '4 / page' },
    { value: 8, label: '8 / page' },
    { value: 12, label: '12 / page' },
    { value: 16, label: '16 / page' },
    { value: 20, label: '20 / page' },
  ],
  createdTime: [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ],
});

export { getFilterConfigProduct, getFilterConfigOrder, getFilterConfigAdminDashboard, getFilterConfigAdminAccounts };
