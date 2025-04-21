let N = 3; // Total number of countdown numbers
let TIME = 1.5; // Time each number takes to fully animate (in seconds)
let FINAL_TIME = 2; // Time for GO! to stay on screen before disappearing (in seconds)
let FINAL_TEXT = "GO!";

function startCountdown() {
    const container = document.getElementById("countdown");
    container.innerHTML = ""; // Clear previous content if needed

    // Generate number divs dynamically
    const numbers = [];
    for (let i = N; i >= 1; i--) {
        const num = document.createElement("div");
        num.classList.add("number");
        num.textContent = i;
        container.appendChild(num);
        numbers.push(num);
    }

    const goText = document.createElement("div");
    goText.classList.add("go-text");
    goText.textContent = FINAL_TEXT;
    container.appendChild(goText);

    const timeline = gsap.timeline({ repeat: 0, paused: true }); // Pause initially

    numbers.forEach((num, i) => {
        const trail = document.createElement("div");
        trail.classList.add("flame-trail");
        trail.textContent = num.textContent;
        container.insertBefore(trail, num); // place trail behind number

        const animDuration = TIME * 0.5; // half time for entrance, half for exit
        const offset = i * TIME;

        timeline.fromTo(num,
            { x: "100vw", skewX: 45, opacity: 0 },
            {
                x: "0vw",
                skewX: 0,
                opacity: 1,
                duration: animDuration,
                ease: "power4.out"
            }, offset
        ).to(num,
            {
                x: "-100vw",
                skewX: -45,
                opacity: 0,
                duration: animDuration,
                ease: "power4.in"
            }, offset + animDuration
        );

        timeline.fromTo(trail,
            { x: "100vw", skewX: 45, opacity: 0 },
            {
                x: "0vw",
                skewX: 0,
                opacity: 0.6,
                duration: animDuration,
                ease: "power4.out"
            }, offset + 0.1
        ).to(trail,
            {
                x: "-100vw",
                skewX: -45,
                opacity: 0,
                duration: animDuration,
                ease: "power4.in"
            }, offset + animDuration + 0.1
        );
    });

    const finalOffset = N * TIME;
    timeline.fromTo(goText,
        { scale: 0.5, opacity: 0 },
        {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)"
        }, finalOffset
    ).to(goText,
        {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut'
        }, finalOffset + FINAL_TIME
    );

    timeline.play();
}

function property_n(value) {
    N = value;
}

function property_time(value) {
    TIME = value;
}

function property_finalTime(value) {
    FINAL_TIME = value;
}

function field_finalText(value) {
    FINAL_TEXT = value.toString().toUpperCase();
}

setModuleID("flying_countdown")
attach_animation_function("start", startCountdown)
attach_property_function("n", property_n)
attach_property_function("time", property_time)
attach_property_function("finalTime", property_finalTime)
attach_field_function("finalText", field_finalText)