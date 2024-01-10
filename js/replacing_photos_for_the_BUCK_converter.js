
function change_photos() {

  //In my opinin we can use this code, Mr.Zygmanowski want to sfow thison the page
  var imageArray = [
    "C:/Users/KAMPAN/Desktop/inzynierka/DC-DC_converter/pictures_for_website/64_1.png",
    "C:/Users/KAMPAN/Desktop/inzynierka/DC-DC_converter/pictures_for_website/64_2.png",
    "C:/Users/KAMPAN/Desktop/inzynierka/DC-DC_converter/pictures_for_website/64_3.png",
    "C:/Users/KAMPAN/Desktop/inzynierka/DC-DC_converter/pictures_for_website/64_4.png"
  ];
  var currentIndex = 0;

  // This function creating photos on the page
  function createImage() {
    var image = document.createElement("img");
    image.id = "galleryImage";
    image.src = imageArray[currentIndex];
    image.width = 500;
    image.height = 250;

    var imageContainer = document.createElement("div");
    imageContainer.id = "imageContainer";
    imageContainer.appendChild(image);

    document.body.appendChild(imageContainer);
  }

  // This part is responsible for button
  function createButton() {
    var button = document.createElement("button");
    button.textContent = "Change Image";
    button.onclick = changeImage;

    document.body.appendChild(button);
  }

  // This part changing a photo on the page
  function changeImage() {
    currentIndex++;
    if (currentIndex >= imageArray.length) {
      currentIndex = 0;
    }
    var galleryImage = document.getElementById("galleryImage");
    galleryImage.src = imageArray[currentIndex];
  }

  createImage();
  createButton();
}