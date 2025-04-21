const textElement = document.getElementById("title");

let baseText = "ЛЯГУШКА ЖАБКИНСОН";
let nextText = "О, ПРИВЕТ!";
let typingSpeed = 100;
let glitchDuration = 1.5;
let glitchChars = "!@#$%^&*()_+-=[]{}|;:',.<>/?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";


function anim_tying() {
    gsap.to({}, {
        duration: 0.1,
        onComplete: () => {
            let i = 0;
            const interval = setInterval(() => {
                if (i < baseText.length) {
                    textElement.innerHTML += baseText[i];
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, typingSpeed);
        }
    });
}

function anim_deleting() {
    let text = textElement.textContent;
    let i = text.length;

    const interval = setInterval(() => {
      if (i > 0) {
        textElement.textContent = text.substring(0, i - 1);
        i--;
      } else {
        clearInterval(interval);
      }
    }, typingSpeed);
  }

function anim_glitch() {
    const startTime = performance.now();
    const originalLength = textElement.innerHTML.length;
    const paddedFinal = nextText.padEnd(originalLength, ' ');

    function animate(currentTime) {
        const elapsed = (currentTime - startTime) / 1000; // in seconds
        const progress = Math.min(elapsed / glitchDuration, 1);

        const glitchText = paddedFinal.split('').map((char, i) => {
            if (Math.random() > progress) {
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                return char;
            }
        }).join('');

        textElement.innerHTML = glitchText;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            textElement.innerHTML = nextText;
        }
    }

    requestAnimationFrame(animate);
}


function field_baseText(value) {
    baseText = value;
}
function field_nextText(value) {
    nextText = value;
}
function property_typingSpeed(value) {
    typingSpeed = value;
}
function property_glitchDuration(value) {
    glitchDuration = value;
}
function property_glitchChars(value) {
    glitchChars = value;
}
function property_fontSize(value) {
    textElement.style.fontSize = value.toString() + "pt";
}


setModuleID("glitch_typing");

attach_animation_function("typing", anim_tying);
attach_animation_function("glitch", anim_glitch);
attach_animation_function("deleting", anim_deleting);

attach_field_function("baseText", field_baseText);
attach_field_function("nextText", field_nextText);

attach_property_function("typingSpeed", property_typingSpeed);
attach_property_function("glitchDuration", property_glitchDuration);
attach_property_function("glitchChars", property_glitchChars);
attach_property_function("fontSize", property_fontSize);
