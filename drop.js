document.addEventListener("DOMContentLoaded", () => {

    const dropAreas = document.querySelectorAll(".droppable");
    let draggedImage = null; // store dragged image reference

    loadImagesFromLocalStorage();

    // this function is used for make the images dragable
    const imageDragable = document.querySelectorAll(".images")

    imageDragable.forEach(image => {
        image.setAttribute("draggable", "true"); // Make images draggable by adding the drag true

        // When the drag starts
        image.addEventListener("dragstart", (e) => {
            // console.log("the targer is :" , e.target)
            draggedImage = e.target;
            // console.log("the dragged image is :" , draggedImage)
            e.dataTransfer.effectAllowed = "move"; // Set the drag part to move

        });

        image.addEventListener("dragend", () => {
            draggedImage = null; // reset image reference (no image is being dragged anymore).
        });
    });


    // Apply drag-and-drop behavior to each droppable area (columns)
    dropAreas.forEach(area => {
        // console.log("the area is : " , area)

        // When an image is dragged over a droppable area
        area.addEventListener("dragover", (e) => {
            e.preventDefault();
            area.classList.add("drag-over");
            // console.log("Dragging over is :", area);
        });

        // Swaps the dragged image with the existing image
        area.addEventListener("drop", (e) => {
            e.preventDefault();
            area.classList.remove("drag-over");

            if (draggedImage) {
                let targetImage = area.querySelector("img");

                // Swap images between the dragged one and the target
                if (targetImage) {
                    let tempSrc = targetImage.src; // Store the target image src
                    // console.log("the temp Src image is :" , tempSrc)

                    targetImage.src = draggedImage.src; // Replace target image with dragged image
                    // console.log("the target Image is" , targetImage)

                    draggedImage.src = tempSrc; // Replace dragged image with target image
                    // console.log("the dragged Image is" , draggedImage)

                    // Save updated image positions in local storage
                    saveImagesToLocalStorage();
                }
            }
        });
    });

    // Function to save the images' order to local storage
    function saveImagesToLocalStorage() {
        const imagesData = [];
        dropAreas.forEach(area => {
            // console.log("the area is ", area)
            const img = area.querySelector("img");
            if (img) {
                imagesData.push(img.src);
            }
        });
        localStorage.setItem("imagesOrder", JSON.stringify(imagesData));
    }

    // Function to load images from local storage on page reload
    function loadImagesFromLocalStorage() {
        const savedImages = JSON.parse(localStorage.getItem("imagesOrder"));

        if (savedImages) {
            dropAreas.forEach((area, index) => {
                const img = area.querySelector("img"); // Get the image in the drop area
                if (img) {
                    img.src = savedImages[index]; // Set the image src from stored data
                }
            });
        }
    }

    // this is for the hide and show the container 
    const updateButton = document.querySelector(".update-btn");
    const checkboxes = document.querySelectorAll(".offcanvas-body input[type='checkbox']");

    updateButton.addEventListener("click", () => {
        checkboxes.forEach((checkbox, index) => {
            // console.log(" The checkbox is : " , checkbox  )
            if (dropAreas[index]) {
                dropAreas[index].style.display = checkbox.checked ? "none" : "flex"  // Hide and Show the container
            }
        });
    });

    // open the prompt box to set the width of the container 
    const editBtns = document.querySelectorAll(".edit-btn");

    editBtns.forEach((btn,index) =>{
        btn.addEventListener("click" , () =>{
            const userInput = prompt("Please enter the numbrer to set the width of the container")
            const columnSize = parseInt(userInput)
            console.log("the column size is : ",columnSize)

            if(!isNaN(columnSize) && columnSize >= 1 && columnSize <= 12){
                let newSize = `col-${columnSize}`;
                dropAreas[index].classList = `${newSize} p-0 bg-primary droppable position-relative`
            }else{
                alert("You did not enter the number to set the width of the container")
            }
        })
    })
    
});












