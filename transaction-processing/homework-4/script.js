/*
    Name: Alexander Pedersen
    File: script.js
    Date Created: 3/16/2026
    Description: JavaScript file for Homework 4. 
        Includes required elements of:
            -Fetch API
		    -iFrame
		    -Content Protection
            -Cookie usage
		    -Local storage
*/

// Variables

let errorState = 0;
const DEFAULT_COOKIE_LENGTH = 2;

// Module on load finish
document.addEventListener("DOMContentLoaded",function() {
    displayDate();
    console.log(document.cookie);
    welcomeUser();
    loadStates();
});

// Module for displaying date 
function displayDate() {
    const today = new Date();
    const formattedDate = today.toLocaleDateString() + " " + today.toLocaleTimeString();
    document.getElementById("today-date").innerText = formattedDate;
}
const updateDate = setInterval(() => {
    displayDate();
}, 1000);

// welcome user funciton
function welcomeUser() {
    const firstName = getCookie("fname");
    if( firstName != null ){
        const userCheck = confirm("Confirm to use the data for " + firstName + ".");
        if( userCheck == false ){
            clearAllCookies();
            localStorage.clear();
            return;
        }
        if(firstName){
            document.getElementById("greeting").innerText = "Welcome Back " + getCookie("fname");
        }
    }
    const remembered = getCookie("remember")
    if( remembered == "yes" ){
        document.getElementById("remember-me").checked = true;
    }
    populateLocalData();
}

// Module for grabbing local storage when window closes
window.addEventListener('beforeunload', (event) => {
    if(!document.getElementById("remember-me").checked) { 
        return;
    }
    let formData = document.getElementById("main-form");
    for( let element of formData ){
        switch(element.type) {
            case "button":
            case "submit":
            case "reset":
            case "checkbox":
            case "radio":
                continue;
            default :
                localStorage.setItem(element.id, element.value);
        }
    }
    return '';
});
// Module for populating local storage back on startup
function populateLocalData() {
    console.log("Populate data runs");
    for( let i = 0; i < localStorage.length; i++ ){
        let key = localStorage.key(i);
        let storedValue = localStorage.getItem(key);

        let element = document.getElementById(key);
        if(element){
            element.value = storedValue;
        }
        console.log(key + " " + storedValue);
    }
}

// Module for fetching the states FETCH requirement here
function loadStates() {
    fetch('states_list.xml')
        .then(function(response) {
            return response.text();
        })
        .then(function(xmlString) {
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(xmlString, "text/xml");

            let stateData = xmlDoc.getElementsByTagName("data")[0].innerHTML;

            document.getElementById("state").innerHTML += stateData;
        })
        .catch(function(error) {
            console.log(error);
        });
}

// Module for displaying current slider value
function updateSlider() {
    const slider = document.getElementById("pain");
    const tooltip = document.getElementById("pain-tooltip");

    let percent = (slider.value - slider.min) / (slider.max - slider.min) * 100;

    tooltip.innerHTML = slider.value;
    // Tooltip is ever so slightly offset but idk how to fix
    tooltip.style.left = percent + "%";
}

// Remember me listener
const rememberMeCheckbox = document.getElementById("remember-me");
rememberMeCheckbox.addEventListener('change', function() {
    if(!this.checked){
        // clear all cookies here
        clearAllCookies();
        localStorage.clear();
        console.log("Cleared cookies and localstorage.");
    } else {
        setCookie("remember","yes",DEFAULT_COOKIE_LENGTH);
        console.log("cookies are remembered");
    }
} )

// Privacy Screen Modal Stuff
let idleTimer;
function showPrivacyScreen() {
    document.getElementById("privacy-overlay").style.display = "block";
}
function activityHappened() {
    document.getElementById("privacy-overlay").style.display = "none";
    clearTimeout(idleTimer);
    // set to 10 seconds right now for testing
    idleTimer = setTimeout(showPrivacyScreen, 5000);
}
window.onLoad = activityHappened;
window.onmousemove = activityHappened;
window.onkeydown = activityHappened;
window.onclick = activityHappened;
window.onscroll = activityHappened;

// Get data function- loops through the form and appends each entry into a table.
//      It doesnt return anything, simply sets the review-data element to its result
function reviewData() {
    let formData = document.getElementById("main-form");
    let outputTable = "<table class='review-table'><tr><td><u>Name</u></td><td><u>Value</u></td></tr>";
    for( let element of formData ){
        switch(element.type) {
            case "button":
                continue;
            case "checkbox":
                if( !element.checked ) {
                    continue;
                }
                outputTable += "<tr><td>"+element.value+"</td>";
                outputTable += "<td>Yes</td></tr>";
                continue;
            case "radio":
                if( !element.checked ){
                    continue;
                }
                outputTable += "<tr><td>"+element.name+"</td>";
                outputTable += "<td>"+element.value+"</td></tr>";
                continue;
            case "password" :
                if( document.getElementById("sensitive-info").checked ){
                    outputTable += "<tr><td>"+element.name+"</td>";
                    outputTable += "<td>"+element.value+"</td></tr>";
                    continue;
                }
                outputTable += "<tr><td>"+element.name+"</td>";
                outputTable += "<td> ************ </td></tr>";
                continue;
            default :
                // User ID formatting
                if(element.id == "userid") {
                    outputTable += "<tr><td>"+element.name+"</td>";
                    outputTable += "<td>"+element.value.toLowerCase()+"</td></tr>";
                    continue;
                }
                outputTable += "<tr><td>"+element.name+"</td>";
                outputTable += "<td>"+element.value+"</td></tr>";
                continue;
        }
    }
    outputTable += "</table>";
    document.getElementById("review-data").innerHTML = outputTable;
    document.getElementById("review-data-section").classList.remove("hidden");
}

// Each form section validation below
function checkFirstName() {
    var element = document.getElementById("fname");
    var output = document.getElementById("name-error");
    if( element.value.length <=1 ){
        output.innerHTML = "First Name Too short.";
        plusError();
        return;
    }
    else {
        if( element.value.match(/^[A-Za-z'-]{2,30}$/)) {
            output.innerHTML = "";
        } else {
            output.innerHTML = "Invalid Characters in First Name.";
            plusError(); 
            return;
        }
    }
    if(document.getElementById("remember-me").checked){
        setCookie("fname",element.value,DEFAULT_COOKIE_LENGTH);
        console.log("Fname cookie set");
    } 
}

function checkMiddleInitial() {
    var element = document.getElementById("middlei");
    var output = document.getElementById("name-error");
    if( element.value.length == 0 || element.value.match(/^[A-Za-z]*$/) ) {
        output.innerHTML = "";
    } else {
        output.innerHTML = "Invalid Character in Middle Initial.";
        plusError();
    }
}

function checkLastName() {
    var element = document.getElementById("lastName");
    var output = document.getElementById("name-error");
    if( element.value.length <= 1 ) {
        output.innerHTML = "Last Name Too Short.";
        plusError();
    } else {
        if ( element.value.match(/^[A-Za-z'2-5-]{2,30}$/) ) {
            output.innerHTML = "";
        } else {
            output.innerHTML = "Invalid Characters in Last Name."
            plusError();
        }
    }
}

function checkDOB() {
    var element = document.getElementById("date-of-birth");
    var output = document.getElementById("dob-error");
    
    var dob = new Date(element.value);
    var today = new Date();
    var minDate = new Date();
    minDate.setFullYear(today.getFullYear()-120);

    if ( element.value == "" ) {
        output.innerHTML = "Date is Required.";
        plusError();
    } else {
        if (dob > today || dob < minDate ) {
            output.innerHTML = "Enter Valid Date of Birth."
            plusError();
        } else {
            output.innerHTML = "";
        }
    }
}

function checkAddress(number) {
    var element = document.getElementById("address"+number);
    var output = document.getElementById("error-address"+number);

    if(element.required && element.value == ""){
        output.innerHTML = "Address is Required.";
        plusError();
        return;
    }
    if(element.value.length == 1){
        output.innerHTML = "Address Too Short.";
        plusError();
        return;
    }
    if(element.value != "" && !element.value.match(/^[A-Za-z 0-9.-]{2,30}$/)){
        output.innerHTML = "Invalid Characters in Address."
        plusError();
        return;
    }

    output.innerHTML = "";
}

function checkCity() {
    var element = document.getElementById("city");
    var output = document.getElementById("error-location");

    if( element.required && element.value == "" ){ 
        output.innerHTML = "City is Required."
        plusError();
        return;
    }
    if( element.value.length < 2 ){
        output.innerHTML = "City is Too Short.";
        plusError();
        return;
    }
    if( !element.value.match(/^[A-Za-z-]{2,30}$/)) {
        output.innerHTML = "Invalid Characters in City.";
        plusError();
        return;
    }
    output.innerHTML = "";
}

function checkState() {
    let element = document.getElementById("state");
    let output = document.getElementById("error-location");

    if( element.value == "" ) {
        output.innerHTML = "State is Required.";
        plusError();
        return;
    }
    output.innerHTML = "";
}

function checkZIP() {
    let element = document.getElementById("zip");
    let output = document.getElementById("error-zip");

    if( element.value == "" ) {
        output.innerHTML = "Zip is Required.";
        plusError();
        return;
    }
    if( element.value.length < 5 ) {
        output.innerHTML = "Zip is Too Short.";
        plusError();
        return;
    }
    if( !element.value.match(/^[0-9-]{5,10}$/)) {
        output.innerHTML = "Invalid Characters in ZIP.";
        plusError();
        return;
    }
    output.innerHTML = "";
}

function checkSSN() {
    let element = document.getElementById("ssn");
    let output = document.getElementById("error-ssn");

    let formattedNumber = '';
    const digits = element.value.match(/\d/g)?.join('') || ''; //

    for(let i = 0; i < digits.length; i++){
        if(i == 3 || i == 5){
            formattedNumber += '-';
        }
        formattedNumber += digits[i];
    }
    element.value = formattedNumber;

    if( element.value == "" ) {
        output.innerHTML = "SSN is Required.";
        plusError();
        return;
    }
    if( element.value.length < 11 ){
        output.innerHTML = "SSN is Too Short.";
        plusError();
        return;
    }
    if( !element.value.match(/^[0-9]{3}-[0-9]{2}-[0-9]{4}$/)) {
        output.innerHTML = "Invalid Characters in SSN.";
        plusError();
        return;
    }
    output.innerHTML = "";
}

function checkPhoneNumber() {
    let element = document.getElementById("phone-number");
    let output = document.getElementById("error-phone-number");

    let formattedNumber = '';
    const digits = element.value.match(/\d/g)?.join('') || ''; //

    for(let i = 0; i < digits.length; i++){
        if(i == 3 || i == 6){
            formattedNumber += '-';
        }
        formattedNumber += digits[i];
    }
    element.value = formattedNumber;

    if( element.value == "" ) {
        output.innerHTML = "Phone Number is Required.";
        plusError();
        return;
    }
    if( element.value.length < 12 ) {
        output.innerHTML = "Phone Number Too Short.";
        plusError();
        return;
    }
    // This section catches copy-paste nuances wiht over maxlength values
    if( !element.value.match(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/) ) {
        output.innerHTML = "Invalid Characters in Phone Number.";
        plusError();
        return;
    }
    output.innerHTML = "";
}

function checkEmail() {
    let element = document.getElementById("email");
    let output = document.getElementById("error-email");

    if( element.value == "" ) {
        output.innerHTML = "Email is Required.";
        plusError();
        return;
    }
    if( element.value.length < 6 ) {
        output.innerHTML = "Email is Too Short.";
        plusError();
        return;
    }
    if( !element.value.match(/^(?=.{1,30}$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
        output.innerHTML = "Invalid Email Address."
        plusError();
        return;
    }
    output.innerHTML = "";
}

function checkUserID() {
    let element = document.getElementById("userid");
    let output = document.getElementById("error-userid");

    if( element.value == "" ){
        output.innerHTML = "User ID is Required.";
        plusError();
        return;
    }
    if( !isNaN(element.value.charAt(0)) ) {
        output.innerHTML = "First Character Invalid.";
        plusError();
        return;
    }
    if( element.value.length < 5 ){
        output.innerHTML = "User ID Too Short.";
        plusError();
        return;
    }
    if( !element.value.match(/^[A-Za-z0-9_-]{5,30}$/) ){
        output.innerHTML = "Invalid Characters in User ID.";
        plusError();
        return;
    }
    output.innerHTML = "";
}

function checkPassword(number) {
    let element = document.getElementById("password"+number);
    let output = document.getElementById("error-password"+number);

    let firstName = document.getElementById("fname");
    let lastName = document.getElementById("lastName");

    if( element.value == "" ){
        output.innerHTML = "Password is Required.";
        plusError();
        return;
    }
    if( element.value.length < 8 ) {
        output.innerHTML = "Password is Too Short.";
        plusError();
        return;
    }
    if( !element.value.match(/[A-Z]/)) {
        output.innerHTML = "Password Missing Uppercase Letter.";
        plusError();
        return;
    }
    if( !element.value.match(/[0-9]/)) {
        output.innerHTML = "Password Missing Number.";
        plusError();
        return;
    }
    if( !element.value.match(/[!@#$%^&*()\-_+=><.,`~]/)) {
        output.innerHTML = "Password Missing Special Character.";
        plusError();
        return;
    }
    if( element.value == document.getElementById("userid").value){
        output.innerHTML = "Password Cannot Equal User ID.";
        plusError();
        return;
    }
    if( firstName.value != "" ){
        if( element.value.includes(firstName.value)) {
            output.innerHTML = "Password Cannot Contain First Name.";
            plusError();
            return;
        }
    }
    if( lastName.value != "" ){
        if( element.value.includes(lastName.value)) {
            output.innerHTML = "Password Cannot Contain Last Name.";
            plusError();
            return;
        }
    }
    if( number == 2 && element.value != document.getElementById("password1").value ) {
        output.innerHTML = "Passwords must Match.";
        plusError();
        return;
    }
    output.innerHTML = "";
}

function checkGender() {
    let genderElements = document.getElementsByName("Gender");
    let isEntered = false;
    let output = document.getElementById("error-gender");
    for( checkbox of genderElements ) { 
        if( checkbox.checked ){
            isEntered = true;
        }
    }
    if ( isEntered ) {
        output.innerHTML = "";
    } else {
        output.innerHTML = "Please select a gender."
        plusError();
    }
}

function checkInsurance() {
    let insuranceElements = document.getElementsByName("Insured");
    let isEntered = false;
    let output = document.getElementById("error-insurance");
    for( checkbox of insuranceElements ) {
        if( checkbox.checked ) {
            isEntered = true;
        }
    }
    if ( isEntered ) { 
        output.innerHTML = "";
    } else {
        output.innerHTML = "Please select insurance status."
        plusError();
    }
}

function validateForm() {
    errorState = 0;
    checkFirstName();
    checkMiddleInitial();
    checkLastName();
    checkDOB();
    checkAddress(1);
    checkAddress(2);
    checkCity();
    checkState();
    checkZIP();
    checkSSN();
    checkPhoneNumber();
    checkEmail();
    checkUserID();
    checkPassword(1);
    checkPassword(2);
    checkGender();
    checkInsurance();
    
    if( errorState == 0 ) {
        document.getElementById("submit-button").disabled = false;
    } else {
        document.getElementById("submit-button").disabled = true;
    }
}

function plusError() {
    errorState++;
    document.getElementById("submit-button").disabled = true;
}

// Cookies all below - Some taken from W3, some AI modification, some personal modification

// Can use to overright cookies, just needs to have same name + path
function setCookie(name, value, expires) {
    // encodeURIComponent deals with spaces and stuff that would break the cookie
    let cookieString = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    // max-age works in seconds instead of ms for expires
    const maxAge = expires * 24 * 60 * 60;
    cookieString += ";max-age=" + maxAge;
    cookieString += ";path=/";
    cookieString += ";Secure"; // Apparently protects against packet sniffing. HTTPS?
    cookieString += ";SameSite=Lax"; // Apparently good security practice
    // Actually saving the cookie
    document.cookie = cookieString;
}

function getCookie(name) {
    const searchName = encodeURIComponent(name) + "=";
    const cookieArray = document.cookie.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim(); //apparently it commonly adds white space
        if(cookie.indexOf(searchName) === 0) {
            // since starting the substring at the length of the name, we only get value
            // also have to decode it since all my cookies are encoded
            return decodeURIComponent(cookie.substring(searchName.length));
        }
    }
    return null;
}

function deleteCookie(name) {
    // sets cookie expiration to past, instantly deletes
    document.cookie = encodeURIComponent(name) + "=; Path=/; max-age=-1; SameSite=:Lax; Secure";
}

function clearAllCookies() {
    const cookieArray = document.cookie.split(";");
    for( let i = 0; i < cookieArray.length; i++ ){
        const cookie = cookieArray[i];
        const equalPos = cookie.indexOf("=");

        let name = (equalPos > -1) ? cookie.substr(0, equalPos) : cookie;
        name = name.trim(); // remove white spaces

        // set cookies expirey to past to get rid of it
        document.cookie = encodeURIComponent(name) + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
    console.log("cleared all cookies");
}

// End of file script.js