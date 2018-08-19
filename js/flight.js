const flightApi = "https://ptx.transportdata.tw/MOTC/v2/Air/FIDS/Flight?$format=JSON";
let flights = [];
let a = fetch(flightApi)
    .then(blob => {
        return blob.json();
    })
    .then(data => {
        flights = data;
    });

function findMatches(wordToMatch, flights) {
    return flights.filter((flight) => {
        const regex = new RegExp(wordToMatch, 'gi');
        return (`${flight.AirlineID}${flight.FlightNumber}`).match(regex) || flight.ArrivalAirportID.match(regex);
    });
};

function displayMatches() {
    const matchArr = findMatches(this.value, flights);
    const html = matchArr.map(flight => {
        const regex = new RegExp(this.value, 'gi');
        const arrivalAirportId = flight.ArrivalAirportID.replace(regex, `<span class="hl">${this.value}</span>`);
        const flightNumber = (`${flight.AirlineID}${flight.FlightNumber}`).replace(regex, `<span class="hl">${this.value}</span>`);
        const regexT = new RegExp("T", 'gi');
        const scheduleDepartureTime = flight.ScheduleDepartureTime === undefined ? "no-data" : flight.ScheduleDepartureTime.replace(regexT, ' ');
        console.log(scheduleDepartureTime);
        return `
            <li>
                <span class="flight-number">${flightNumber}</span>
                <span class="schedule-depar-time">${scheduleDepartureTime}</span>
                <span class="airline">${arrivalAirportId}</span>
            </li>
        `
    }).join('');
    suggestions.innerHTML = html;
};

const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');

searchInput.addEventListener('input', displayMatches);
searchInput.addEventListener('keyup', displayMatches);