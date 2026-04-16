/*
    Name: Alexander Pedersen
    File: script.js
    Date Created: 3/16/2026
    Description: JavaScript file for Homework 2. Mainly
        focuses on data validation for form inputs.
*/

// Variables

let errorState = 0;

// Module for displaying date 
document.addEventListener("DOMContentLoaded",function() {
    // Contents copied from html file
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    document.getElementById("today-date").innerText = formattedDate;
});

// Module for displaying current slider value
function updateSlider() {
    const slider = document.getElementById("pain");
    const tooltip = document.getElementById("pain-tooltip");

    let percent = (slider.value - slider.min) / (slider.max - slider.min) * 100;

    tooltip.innerHTML = slider.value;
    // Tooltip is ever so slightly offset but idk how to fix
    tooltip.style.left = percent + "%";
}

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
    }
    else {
        if( element.value.match(/^[A-Za-z'-]{2,30}$/)) {
            output.innerHTML = "";
        } else {
            output.innerHTML = "Invalid Characters in First Name.";
            plusError();
        }
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