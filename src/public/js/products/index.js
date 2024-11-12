function checkPriceRange(event) {
    event.preventDefault(); // Ngăn chặn hành động gửi form mặc định

    var priceMin = document.getElementsByName("price_min")[0].value;
    var priceMax = document.getElementsByName("price_max")[0].value;

    if (parseFloat(priceMin) > parseFloat(priceMax)) {
        document.getElementById("price-error").innerHTML = "Hãy nhập khoảng phù hợp";
    } else {
        document.getElementById("price-error").innerHTML = "";
        document.getElementById("filterForm").submit();
    }
}
