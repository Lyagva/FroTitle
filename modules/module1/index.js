function anim_redColor() {
  gsap.to("#title", { duration: 1, color: "#f00" });
}

function anim_blueColor() {
  gsap.to("#title", { duration: 1, color: "#00f" });
}

function field_titleText(value) {
  const title = document.getElementById("titleText");
  title.innerHTML = value;
}

function property_fontSize(value){
  const title = document.getElementById("titleText");
  title.style.fontSize = value.toString() + "pt";
  console.log(value);
}

setModuleID("module1");
attach_animation_function("redColor", anim_redColor);
attach_animation_function("blueColor", anim_blueColor);
attach_field_function("titleText", field_titleText)
attach_property_function("fontSize", property_fontSize)