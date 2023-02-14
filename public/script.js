// const formTag = document.querySelector("form");
// formTag.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const res = await fetch("http://localhost:3001/upload", {
//     method: "POST",
//     body: new FormData(formTag),
//   });

//   const data = await res.json();

//   if (data.message === "success") {
//     getAllImage();
//   }
// });

// const mainTag = document.querySelector("main");
// const getAllImage = async () => {
//   mainTag.innerHTML = "";
//   const res = await fetch("http://localhost:3001/getAllImages");

//   const imagesData = await res.json();
//   console.log(imagesData);
//   imagesData.forEach((data) => {
//     const { Location, key, id } = data;

//     const imageDiv = document.createElement("div");
//     imageDiv.classList.add("imageDiv");

//     const imageTag = document.createElement("img");
//     imageTag.classList.add("myImage");
//     imageTag.src = Location;
//     imageTag.alt = key;

//     imageDiv.append(imageTag);

//     mainTag.append(imageDiv);
//   });
// };
// getAllImage();

const editIconTag = document.getElementById("editIcon");
const changePhoto = document.getElementById("changePhoto");
const profile = document.getElementById("profile");
editIconTag.addEventListener("click", () => {
  changePhoto.click();
});
changePhoto.addEventListener("change", async (e) => {
  const form = new FormData();
  form.append("img", e.target.files[0]);
  if (e.target.value) {
    console.log(changePhoto.files);
    const res = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: form,
    });
    const data = await res.json();

    if (data.message === "success") {
      getProfile();
    }
  }
});

const getProfile = async () => {
  const res = await fetch("http://localhost:3001/getProfile");
  const { src } = await res.json();
  profile.src = src;
};
getProfile();
