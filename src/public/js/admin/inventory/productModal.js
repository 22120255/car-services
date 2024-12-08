import { getFilterConfigProduct } from '../../config.js';

document.addEventListener('DOMContentLoaded', function () {
  const { years, brands, statuses, transmissions, styles, fuelTypes } = getFilterConfigProduct();
  // TODO: here
  const $years = $('#product-year');
  const $brand = $('#product-brand');
  const $status = $('#product-status');
  const $transmission = $('#product-transmission');
  const $style = $('#product-style');
  const $fuelType = $('#product-fuelType');

  // Render options
  const renderSelectOptions = (element, options, defaultText) => {
    if (defaultText !== 'Items per page') {
      element.empty().append(`<option value="">${defaultText}</option>`);
    }
    options.forEach((option) => {
      if (defaultText === 'Select price') {
        element.append(`<option value="${option.priceMin}-${option.priceMax}">$${option.priceMin}-$${option.priceMax}</option>`);
      } else element.append(`<option value="${option.value}">${option.name} ${defaultText === 'Items per page' ? '/trang' : ''}</option>`);
    });
  };

  renderSelectOptions($brand, brands, 'Select brand');
  renderSelectOptions($status, statuses, 'Select status');
  renderSelectOptions($transmission, transmissions, 'Select transmission');
  renderSelectOptions($style, styles, 'Select style');
  renderSelectOptions($fuelType, fuelTypes, 'Select fuel type');
  renderSelectOptions($years, years, 'Select year');
});
