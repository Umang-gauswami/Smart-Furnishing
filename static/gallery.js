document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterTabs = document.querySelectorAll('.filter-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filter items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category.includes(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Load more functionality
    const loadMoreBtn = document.querySelector('.load-more button');
    let visibleItems = 8; // Initial visible items
    
    loadMoreBtn.addEventListener('click', function() {
        // In a real app, this would load more items from an API
        // For demo, we'll just show all items
        galleryItems.forEach(item => {
            item.style.display = 'block';
        });
        
        loadMoreBtn.style.display = 'none';
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        
        galleryItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            const category = item.dataset.category.toLowerCase();
            
            if (title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                category.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});

function redirectToGoogle() {
    const query = document.getElementById('searchInput').value.trim();
    if (query !== "") {
      // Add "furniture" keyword to the search
      const searchQuery = `${query} furniture`;
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      window.open(searchUrl, "_blank");
    }
  }

  // Also search on Enter key
  document.getElementById("searchInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      redirectToGoogle();
    }
  });