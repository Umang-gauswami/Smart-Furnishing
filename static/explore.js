document.addEventListener('DOMContentLoaded', function() {
    // Thumbnail gallery functionality
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image img');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update main image
            const newSrc = this.querySelector('img').src;
            mainImage.src = newSrc;
        });
    });
    
    // "Recreate This Design" button
    const recreateBtn = document.querySelector('.design-cta .btn-primary');
    recreateBtn.addEventListener('click', function() {
        // In a real app, this would redirect to the design tool with pre-selected items
        window.location.href = "smart.html#design";
    });
    
    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.furniture-item .btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const itemName = this.closest('.furniture-item').querySelector('h3').textContent;
            alert(`${itemName} has been added to your cart!`);
        });
    });
});