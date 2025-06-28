document.addEventListener('DOMContentLoaded', function() {
    // Step Navigation
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const stepPanels = document.querySelectorAll('.step-panel');
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    let currentStep = 1;

    // Initialize steps
    function updateSteps() {
        stepIndicators.forEach(indicator => {
            const step = parseInt(indicator.dataset.step);
            if (step === currentStep) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        stepPanels.forEach(panel => {
            if (panel.id === `step${currentStep}`) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Update button states
        prevBtn.disabled = currentStep === 1;
        nextBtn.textContent = currentStep === 3 ? 'Generate Design' : 'Next';
    }

    // Next step
    nextBtn.addEventListener('click', function() {
        if (currentStep < 3) {
            currentStep++;
            updateSteps();
        } else {
            generateDesignD();
        }
    });

    // Previous step
    prevBtn.addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            updateSteps();
        }
    });

    // Step indicator click
    stepIndicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const step = parseInt(this.dataset.step);
            if (step < currentStep) {
                currentStep = step;
                updateSteps();
            }
        });
    });

    // File Upload
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const uploadPreview = document.getElementById('uploadPreview');

    uploadArea.addEventListener('click', function() {
        imageInput.click();
    });

    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--primary-brown)';
        this.style.backgroundColor = 'rgba(139, 90, 43, 0.1)';
    });

    uploadArea.addEventListener('dragleave', function() {
        this.style.borderColor = 'var(--accent-brown)';
        this.style.backgroundColor = 'var(--white)';
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--accent-brown)';
        this.style.backgroundColor = 'var(--white)';
        
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    imageInput.addEventListener('change', function() {
        if (this.files.length) {
            handleFile(this.files[0]);
        }
    });

    function handleFile(file) {
        if (file.type.match('image.*')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                uploadPreview.src = e.target.result;
                uploadPreview.style.display = 'block';
                uploadArea.style.display = 'none';
                nextBtn.disabled = false;
            };
            
            reader.readAsDataURL(file);
        } else {
            alert('Please upload an image file.');
        }
    }

    // Style Selection
    const styleOptions = document.querySelectorAll('.style-option');
    const styleDescription = document.getElementById('styleDescription');
    
    const styleDescriptions = {
        rustic: 'Rustic style features natural materials, earthy colors, and a cozy, lived-in feel. Think reclaimed wood, stone, and vintage elements that create warmth and character.',
        modern: 'Modern design emphasizes clean lines, minimal ornamentation, and a monochromatic palette. Furniture is sleek and functional with smooth surfaces and geometric shapes.',
        industrial: 'Industrial style takes inspiration from warehouses and urban lofts. Exposed brick, metal fixtures, and utilitarian objects combine with neutral colors for an edgy look.',
        scandinavian: 'Scandinavian design focuses on simplicity, functionality, and connection to nature. Light colors, natural wood, and clean lines create airy, uncluttered spaces.'
    };

    let selectedStyle = null;

    styleOptions.forEach(option => {
        option.addEventListener('click', function() {
            styleOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedStyle = this.dataset.style;
            
            styleDescription.innerHTML = `
                <h4>${this.querySelector('p').textContent} Style</h4>
                <p>${styleDescriptions[selectedStyle]}</p>
            `;
            
            // Enable next button if we're on step 2
            if (currentStep === 2) {
                nextBtn.disabled = false;
            }
        });
    });

    // Furniture Selection
    const categoryTabs = document.querySelectorAll('.category-tab');
    const furnitureItemsContainers = document.querySelectorAll('.furniture-items');
    const selectedItemsContainer = document.getElementById('selectedItemsContainer');
    const generateDesignBtn = document.getElementById('generateDesign');
    
    let selectedFurniture = [];
    
    // Category tabs
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.dataset.category;
            
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            furnitureItemsContainers.forEach(container => {
                if (container.id === `${category}-items`) {
                    container.classList.add('active');
                } else {
                    container.classList.remove('active');
                }
            });
        });
    });
    
    // Select furniture items
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('select-item-btn')) {
            const itemElement = e.target.closest('.furniture-item');
            const itemId = itemElement.dataset.item;
            const itemCategory = itemElement.dataset.category;
            const itemName = itemElement.querySelector('p').textContent;
            
            // Toggle selection
            if (e.target.classList.contains('selected')) {
                // Remove from selection
                e.target.classList.remove('selected');
                e.target.textContent = 'Select';
                selectedFurniture = selectedFurniture.filter(item => item.id !== itemId);
            } else {
                // Add to selection
                e.target.classList.add('selected');
                e.target.textContent = 'Selected';
                selectedFurniture.push({
                    id: itemId,
                    name: itemName,
                    category: itemCategory,
                    img: itemElement.querySelector('img').src
                });
            }
            
            updateSelectedItemsDisplay();
            
            // Enable generate button if at least one item is selected
            generateDesignBtn.disabled = selectedFurniture.length === 0;
        }
        
        // Remove selected item
        if (e.target.classList.contains('remove-item')) {
            const itemId = e.target.closest('.selected-item').dataset.itemId;
            
            // Remove from selectedFurniture array
            selectedFurniture = selectedFurniture.filter(item => item.id !== itemId);
            
            // Update the select button in the items list
            const itemButton = document.querySelector(`.furniture-item[data-item="${itemId}"] .select-item-btn`);
            if (itemButton) {
                itemButton.classList.remove('selected');
                itemButton.textContent = 'Select';
            }
            
            updateSelectedItemsDisplay();
            generateDesignBtn.disabled = selectedFurniture.length === 0;
        }
    });
    
    function updateSelectedItemsDisplay() {
        if (selectedFurniture.length === 0) {
            selectedItemsContainer.innerHTML = '<p class="empty-message">No furniture selected yet</p>';
            return;
        }
        
        selectedItemsContainer.innerHTML = '';
        selectedFurniture.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'selected-item';
            itemElement.dataset.itemId = item.id;
            itemElement.innerHTML = `
                ${item.name}
                <span class="remove-item">&times;</span>
            `;
            selectedItemsContainer.appendChild(itemElement);
        });
    }
    
    // Prompt Generation
    function generateSmartPrompt() {
    if (!selectedFurniture.length || !selectedStyle) {
        alert("Please select at least one furniture item and a design style.");
        return null;
    }

    // Extract furniture names
    const furnitureList = selectedFurniture
        .map(item => item.name.toLowerCase())
        .join(", ")
        .replace(/,([^,]*)$/, " and$1");

    // Convert style to lowercase safely
    const styleName = selectedStyle.toLowerCase();

    // Compose prompt
    const prompt = `Add ${furnitureList} in the room with ${styleName} style`;
    console.log("Generated Prompt:", prompt);
    return prompt;
}

// Generate Design
async function generateDesignD() {
    if (selectedFurniture.length === 0) {
        alert('Please select at least one furniture item.');
        return;
    }

    // 🔥 Generate the dynamic prompt
    const prompt = generateSmartPrompt();
    if (!prompt) return; // If prompt generation failed, exit

    console.log("Prompt to be sent:", prompt);
   
    // Show loading state
    nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    nextBtn.disabled = true;

    // const prompt = "add sofa and table in the room";

    await showResultModal(prompt);

    // Reset button
    nextBtn.innerHTML = 'Generate Design';
    nextBtn.disabled = false;
}

async function showResultModal(prompt) {
    const fileInput = document.getElementById('imageInput');

    const modal = document.createElement('div');
    modal.className = 'modal-overlay result-modal';

    document.body.appendChild(modal); // ⬅️ Append it before accessing child elements

    try {
        const reader = new FileReader();
        const imageData = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(fileInput.files[0]);
        });


        const response = await fetch("/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                image: imageData,
                prompt: prompt.trim()
            })
        });

        const result = await response.json();

        if (!response.ok || !result.image) {
            throw new Error(result.error || "No image returned");
        }

        // Set modal HTML now that we have the image
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="result-title">
                    <h3>Your Generated Design</h3>
                </div>

                <div class="result-image">
                    <img src="${result.image}" alt="Generated Design" id="resultImage" class="result-image">
                </div>

                <div class="result-actions">
                    <button class="btn btn-outline" id="saveDesign">
                        <i class="fas fa-bookmark"></i> Download Design
                    </button>
                    <button class="btn btn-primary regenerate-btn" id="regenerateDesign">
                        <i class="fas fa-sync-alt"></i> Regenerate
                    </button>
                    <button class="btn btn-primary" id="startOver">
                        <i class="fas fa-redo"></i> Start Over
                    </button>
                </div>
            </div>
        `;

    } catch (err) {
        console.error("Error:", err);
        modal.innerHTML = `<p style="color: red;">${err.message}</p>`;
    }

    modal.style.display = 'flex';

    // Close modal
    modal.querySelector('.close-modal')?.addEventListener('click', () => modal.remove());

       // Save design (Download to Device)
    modal.querySelector('#saveDesign')?.addEventListener('click', () => {
        const resultImg = modal.querySelector('#resultImage');
    
        if (!resultImg || !resultImg.src) {
            alert("No image found to save.");
            return;
        }
    
        const link = document.createElement('a');
        link.href = resultImg.src;
        link.download = `smart-room-design-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
        alert("Design image has been downloaded!");
    });


    // Start over
    modal.querySelector('#startOver')?.addEventListener('click', () => {
        modal.remove();
        resetDesignTool();
    });

    // Regenerate design
    modal.querySelector('#regenerateDesign')?.addEventListener('click', async () => {
        const regenerateBtn = modal.querySelector('#regenerateDesign');
        regenerateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Regenerating...';
        regenerateBtn.disabled = true;

        try {
            const reader = new FileReader();
            const imageData = await new Promise((resolve) => {
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(fileInput.files[0]);
            });

            const response = await fetch("/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: imageData,
                    prompt: prompt.trim()
                })
            });

            const result = await response.json();

            if (!response.ok || !result.image) {
                throw new Error(result.error || "No image returned");
            }

            // Replace the image
            const resultImage = modal.querySelector('#resultImage');
            resultImage.src = result.image;
            resultImage.style.display = "block";

        } catch (err) {
            console.error("Regenerate Error:", err);
            alert("Failed to regenerate. Try again.");
        } finally {
            regenerateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Regenerate';
            regenerateBtn.disabled = false;
        }
    });
    // Start over
    modal.querySelector('#startOver').addEventListener('click', () => {
        modal.remove();
        resetDesignTool();
    });
        
        // Close when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    function resetDesignTool() {
        // Reset to step 1
        currentStep = 1;
        updateSteps();
        
        // Reset file upload
        uploadPreview.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
        
        // Reset style selection
        styleOptions.forEach(opt => opt.classList.remove('selected'));
        styleDescription.innerHTML = '<p>Select a style to see detailed description</p>';
        selectedStyle = null;
        
        // Reset furniture selection
        selectedFurniture = [];
        document.querySelectorAll('.select-item-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.textContent = 'Select';
        });
        updateSelectedItemsDisplay();
        generateDesignBtn.disabled = true;
        
        // Reset category tabs
        categoryTabs[0].click();
    }
    
    // Initialize
    updateSteps();
    categoryTabs[0].click();
    nextBtn.disabled = true;
});
