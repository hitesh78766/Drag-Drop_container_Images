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

    dropAreas.forEach((btn, index) => {
        btn.addEventListener("dblclick", () => {
            const userInput = prompt("Please enter the numbrer to set the width of the container")
            const columnSize = parseInt(userInput);
            // console.log("the column size is : " , columnSize)

            if (!isNaN(columnSize) && columnSize >= 1 && columnSize <= 12) {
                let newSize = `col-${columnSize}`
                dropAreas[index].classList = `${newSize} p-0 bg-primary droppable position-relative`
            } else {
                alert("you did not enter the number to set the width of the container")
            }

        })
    })

    // const editBtns = document.querySelectorAll(".edit-btn");

    // editBtns.forEach((btn,index) =>{
    //     btn.addEventListener("click" , () =>{
    //         const userInput = prompt("Please enter the numbrer to set the width of the container")
    //         const columnSize = parseInt(userInput)
    //         console.log("the column size is : ",columnSize)

    //         if(!isNaN(columnSize) && columnSize >= 1 && columnSize <= 12){
    //             let newSize = `col-${columnSize}`;
    //             dropAreas[index].classList = `${newSize} p-0 bg-primary droppable position-relative`
    //         }else{
    //             alert("You did not enter the number to set the width of the container")
    //         }
    //     })
    // })

});



document.addEventListener("DOMContentLoaded", () => {

    const editIcon = document.querySelectorAll(".edit-icon")
    const uploadImage = document.getElementById("uploadImage");
    console.log("the upload image is :", uploadImage);
    const previewImage = document.getElementById("previewImage")
    const saveImage = document.getElementById("saveImage")
    let modal = document.getElementById("exampleModal");
    // variable for dropzone
    const dropZone = document.getElementById("dropZone")
    // this variable is for set the new image in container 
    let selectedImageContainer = null

    editIcon.forEach((button) => {
        button.addEventListener("click", () => {
            selectedImageContainer = button.parentElement.querySelector("img");
            console.log("the select Image container is :", selectedImageContainer)
            previewImage.style.display = "none"; // not display preview image till then the new image is select
            uploadImage.value = "";  // clear the previous file
        })
    })

    // add event on upload Image 
    uploadImage.addEventListener("change", (e) => {
        let file = e.target.files[0]
        console.log("the file is :", file)

        if (file && file.type.startsWith("image/")) {
            let reader = new FileReader(); // Convert the image into a displayable format

            reader.onload = (e) => {
                console.log("the event is :", e)
                previewImage.src = e.target.result; // set the img src. in preview image
                console.log("the preview imaeg data is :", previewImage)
                previewImage.style.display = "block"; // show preview image 
            };
            reader.readAsDataURL(file); // Convert the image file into a URL
        } else {
            alert("Please upload a valid image file");
        }

    })

    // this is the code of the drag and drop image 
    dropZone.addEventListener("dragover" , (e) =>{
        console.log("the dragOver is :" , e)
        e.preventDefault()
        dropZone.classList.add("drag-over")
    })

    dropZone.addEventListener("dragleave" , () =>{
        dropZone.classList.remove("drag-over")
    })

    dropZone.addEventListener("drop" , (e) =>{
        console.log("the drop image is :" , e)
        e.preventDefault()
        dropZone.classList.remove("drag-over")

        let file = e.dataTransfer.files[0]
        console.log("the drop file is : " , file)

        if(file && file.type.startsWith("image/")){
            let reader = new FileReader() // convert the image into a displayable format

            reader.onload = (e) =>{
                console.log("the event of drag and drop is :" . e)
                previewImage.src = e.target.result
                console.log("the preview image of dreg and drop is :" , previewImage)
                previewImage.style.display = "block" // show the preview image 
            };
            reader.readAsDataURL(file)
        }else{
            alert("please upload a valid image file ")
        }
    })


    // show the upload image on the click of save button
    saveImage.addEventListener("click", () => {
        let previewSrc = previewImage.src // get the source of preview image 

        // If an image was selected and a preview exists
        if (selectedImageContainer && previewSrc) {
            selectedImageContainer.src = previewSrc // replace the select image 
            closeModal(modal); // Close modal
        }
    })


    function closeModal(modal) {
        let modalInstance = bootstrap.Modal.getInstance(modal); // Get the Bootstrap modal instance
        if (modalInstance) {
            modalInstance.hide(); // Hide the modal
        }
    }

})



