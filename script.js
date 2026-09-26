const speedDisplay = document.getElementById("speed");

const unitDisplay = document.getElementById("unit");

const startButton = document.getElementById("startButton");

const status = document.getElementById("status");

const mphButton = document.getElementById("mphButton");
const kphButton = document.getElementById("kphButton");

let unit = "mph";
let latestSpeedMps = null;
let watchId = null;

startButton.addEventListener("click", startTracking);

function startTracking() {
    if (!navigator.geolocation) {
        status.textContent = "Geolocation is not supported.";
        return;
    }

    startButton.disabled = true;
    startButton.textContent = "Requesting…";
    status.textContent = "Requesting location permission…";

    navigator.geolocation.getCurrentPosition(
        handleInitialPosition,
        handleLocationError,
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}

function handleInitialPosition(position) {
    console.log("Initial position:", position);

    status.textContent = "Location available. Starting GPS…";

    watchId = navigator.geolocation.watchPosition(
        handlePosition,
        handleLocationError,
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 1000
        }
    );

    startButton.textContent = "Running";

    handlePosition(position);
}

function handlePosition(position) {
    console.log("GPS update:", position);

    const speed = position.coords.speed;

    if (speed === null) {
        status.textContent = "GPS connected — waiting for speed…";

        return;
    }

    latestSpeedMps = Math.max(0, speed);

    status.textContent = "GPS connected";

    updateDisplay();
}

function updateDisplay() {
    if (latestSpeedMps === null) {
        speedDisplay.textContent = "00";
        return;
    }

    let speed;

    if (unit === "mph") { speed = latestSpeedMps * 2.236936; }
    else { speed = latestSpeedMps * 3.6; }

    speedDisplay.textContent = Math.round(speed);
}

function handleLocationError(error) {
    console.error("Geolocation error:", error);

    startButton.disabled = false;
    startButton.textContent = "Try Again";

    switch (error.code) {
        case error.PERMISSION_DENIED:
            status.textContent = `Permission denied (${error.code}): ${error.message}`;
            break;

        case error.POSITION_UNAVAILABLE:
            status.textContent = `Position unavailable (${error.code}): ${error.message}`;
            break;

        case error.TIMEOUT:
            status.textContent = `Location timed out (${error.code}): ${error.message}`;
            break;

        default:
            status.textContent = `Location error (${error.code}): ${error.message}`;
    }
}

function setUnit(newUnit) {
    unit = newUnit;

    if (unit === "mph") {
        mphButton.classList.add("active");
        kphButton.classList.remove("active");

        unitDisplay.textContent = "MPH";

    } else {
        mphButton.classList.remove("active");
        kphButton.classList.add("active");

        unitDisplay.textContent = "KPH";
    }

    updateDisplay();
}

mphButton.addEventListener("click", () => { setUnit("mph"); });
kphButton.addEventListener("click", () => { setUnit("kph"); });