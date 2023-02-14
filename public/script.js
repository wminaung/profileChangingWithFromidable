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
    const res = await fetch(`${window.location.origin}/api/upload`, {
      method: "POST",
      body: form,
    });
    const data = await res.json();

    if (data.message === "success") {
      getProfile();
    } else {
      console.log(data);
    }
  }
});

const getProfile = async () => {
  const res = await fetch(`${window.location.origin}/api/getProfile`);
  const { src } = await res.json().catch((err) => {
    console.log(err);
  });
  console.log(src);
  profile.src = src;
};
getProfile();
