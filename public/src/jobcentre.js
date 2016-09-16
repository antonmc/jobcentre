/*eslint-env browser */

// Global variables to be called by Ana
var userPolicy;
var policyTypes;
var policyProcedures;

function openTravel() {
    window.location = "travel.html";
}

function openTravelPolicies() {
    window.location = "watson.html";
}

function openHealth() {
    console.log('open health');
}

function makeAccount() {
    console.log('makeAccount');
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    var messagearea = document.getElementById('messagearea');
    messagearea.innerHTML = '';

    console.log('email:' + email);

    var xhr = new XMLHttpRequest();

    var uri = 'signup';

    xhr.open('POST', encodeURI(uri));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function (response) {

        var reply = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
            if (reply.outcome === 'success') {
                window.location = './login'
            } else {
                email = '';
                password = '';
                messagearea.innerHTML = 'Something went wrong - try again';
            }
        } else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(encodeURI('email=' + email + '&password=' + password));
}

function login() {
    console.log('makeAccount');
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    console.log('email:' + email);

    var xhr = new XMLHttpRequest();

    var uri = 'login';

    var messagearea = document.getElementById('messagearea');
    messagearea.innerHTML = '';

    xhr.open('POST', encodeURI(uri));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function (response) {
        if (xhr.status === 200) {

            console.log('response');
            console.log(xhr.responseText);

            var reply = JSON.parse(xhr.responseText);

            console.log(reply);

            if (reply.outcome === 'success') {
                window.location = './profile'
            } else {
                messagearea.innerHTML = 'Something went wrong - try again';
            }


        } else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(encodeURI('email=' + email + '&password=' + password));
}


function get(path, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callback(JSON.parse(xmlhttp.responseText));
        }
    }
    xmlhttp.open("GET", path, true);
    xmlhttp.send();
}


function makeHistoryRow(claim) {

    //    var date = moment(claim.date).format('YYYY-MM-DD');

    var row = document.createElement('div');
    row.className = 'claimrow';
    row.innerHTML = '<div class="marker">' +
        '<img class="claimimage" src="images/clock.svg">' +
        '</div>' +
        '<div class="claimdata">' + claim.firstname + '</div>' +
        '<div class="claimdata">' + claim.lastname + '</div>' +
        '<div class="centereddata">' + claim.day + '</div>' +
        '<div class="centereddata">' + claim.month + '</div>' +
        '<div class="financeclaimdata">' + claim.time + '</div>' +
        '<div class="financeclaimdata">' + claim.year + '</div>';

    return row;
}

function getClaims() {

    checkStatus();

    get('./visits', function (reply) {
        console.log(reply);

        var header = document.getElementById('owner');
        owner.innerHTML = reply.owner;

        var visits = document.getElementById('claimlist');

        reply.visits.reverse().forEach(function (visit) {
            var row = makeHistoryRow(visit);
            claimlist.appendChild(row);
        });
    })
}


function createBenefitRow(policy) {
    var row = document.createElement('div');
    row.className = 'benefitrow';
    row.innerHTML = '<div class="benefiticon">' +
        '<img class="benefitimage" src="images/health/' + policy.icon + '.svg">' +
        '</div>' +
        '<div class="benefitchannel">' +
        '<div class="benefitmarker"></div>' +
        '</div>' +
        '<div class="benefitTitle">' + policy.title + '</div>';
    row.onclick = function () {
        toggleDetails(policy.title);
    }

    return row;
}

function createBenefitEntity(type) {

    var benefit = document.createElement('div');
    benefit.className = 'benefit';

    benefit.innerHTML = '<div class="sideline">' + type + '</div>' +
        '<div class="benefitblock">' +
        '<div class="benefitcap">' +
        '<div class="benefiticon"></div>' +
        '<div class="benefitchanneltop"></div>' +
        '<div class="benefitTitle"></div>' +
        '</div>' +
        '<div id="' + type + '" class="benefitrows">' +
        '</div>' +

        '<div class="benefitcap">' +
        '<div class="benefiticon"></div>' +
        '<div class="benefitchannelbottom"></div>' +
        '<div class="benefitTitle"></div>' +
        '</div>' +
        '</div>';

    return benefit;
}

function createBenefitDetail(policy) {

    var detail = document.createElement('div');
    detail.className = 'benefitdetail';
    detail.id = policy.title;

    detail.innerHTML = ' <div class="benefiticon">' +
        '<div class="padding"></div>' +
        '</div>' +
        '<div class="benefitdetailchannel">' + '</div>' +
        '<div class="benefitfacts">' +
        '<div class="benefitfact">' +
        '<div class="factlabel">benefit</div>' +
        '<div class="factcheck">' + policy.description + '</div>' +
        '</div>' +
        '<div class="benefitfact">' +
        '<div class="factlabel">limit</div>' +
        '<div class="factcheck">$' + policy.claimLimit + '</div>' +
        '</div>' +
        '<div class="benefitfact">' +
        '<div class="factlabel">coverage</div>' +
        '<div class="factcheck">' + policy.percentCovered + '%</div>' +
        '</div>' +
        '<div class="benefitfact">' +
        '<div class="factlabel">term</div>' +
        '<div class="factcheck">' + policy.scope + '</div>' +
        '</div>' +
        '<div class="benefitfact">' +
        '<div class="factlabel">start</div>' +
        '<div class="factcheck">Jan 1 2016</div>' +
        '</div>' +
        '<div class="benefitfact">' +
        '<div class="factlabel">end</div>' +
        '<div class="factcheck">Dec 31 2017</div>' +
        '</div>' +
        '<div class="benefitfact">' +
        '<div class="factlabel">code</div>' +
        '<div class="factcheck">' + policy.code + '</div>' +
        '</div>' +
        '</div>'

    return detail;
}


function toggleDetails(id) {
    var details = document.getElementById(id);

    if (details.style.display !== 'flex') {
        details.style.display = 'flex';
    } else {
        details.style.display = 'none'
    }

}

function unique(value, index, self) {
    return self.indexOf(value) === index;
}


function getBenefits() {

    checkStatus();

    get('./healthBenefits', function (reply) {
        userPolicy = reply;

        var header = document.getElementById('owner');
        owner.innerHTML = reply.owner;

        var policies = reply.policies;
        var policyAreas = [];
        var policyKeys = [];
        var policyTitles = [];
        policyProcedures = [];
        var proc = [];

        var benefitset = document.getElementById('benefitset');

        policies.forEach(function (policy) {

            if (policyAreas[policy.type]) {
                policyAreas[policy.type].push(policy);
                proc.push(policy.title);
            } else {
                policyAreas[policy.type] = [];
                policyAreas[policy.type].push(policy);
                policyKeys.push(policy.type);

                var benefitEntity = createBenefitEntity(policy.type);
                benefitset.appendChild(benefitEntity);

                if (proc.length > 0) {
                    policyProcedures.push(proc);

                    proc = [];
                }

                proc.push(policy.title);
            }

            policyTitles.push(policy.title);

            var anchor = document.getElementById(policy.type);

            var benefitRow = createBenefitRow(policy);
            var benefitDetail = createBenefitDetail(policy);

            anchor.appendChild(benefitRow);
            anchor.appendChild(benefitDetail);

            policyTypes = policyKeys;
        });

        // Push the last array into the procedures array
        policyProcedures.push(proc);

        var uniquebenefits = policyTitles.filter(unique); // returns ['a', 1, 2, '1']

        var select = document.getElementById('benefittypes');

        uniquebenefits.forEach(function (benefit) {
            var option = document.createElement('option');
            option.value = benefit;
            option.innerHTML = benefit;

            select.appendChild(option);
        })

        var datepicker = document.getElementById('claimdate');

        var today = moment().format('YYYY-MM-DD');
        datepicker.value = today;
    })
}

function submitClaim(source) {
    var bot = false;
    console.log("Source is: ", source);

    if (source === watson) {
        bot = true;
    }

    var claimFile = {
        date: null,
        benefit: null,
        provider: null,
        amount: null
    };

    if (source === watson) {
        claimFile.date = context.claim_date;
        claimFile.benefit = context.claim_procedure;
        claimFile.provider = context.claim_provider;
        claimFile.amount = context.claim_amount;
    } else {
        var dateElement = document.getElementById('claimdate');
        var benefitElement = document.getElementById('benefittypes');
        var providerElement = document.getElementById('provider');
        var amountElement = document.getElementById('claimamount');

        claimFile.date = dateElement.value;
        claimFile.benefit = benefitElement.value;
        claimFile.provider = providerElement.value;
        claimFile.amount = amountElement.value;
    }

    var xhr = new XMLHttpRequest();

    var uri = '/submitClaim';

    var claimmessages = document.getElementById('claimmessages');

    xhr.open('POST', uri, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function (response) {
        if (xhr.status === 200 && xhr.responseText) {
            var reply = JSON.parse(xhr.responseText);
            console.log(bot);

            if (reply.outcome === 'success') {
                if (bot === true) {
                    console.log('success');
                    displayMessage("Your claim was successfully filed!", watson);
                    context.claim_step = '';
                } else {
                    claimmessages.innerHTML = 'Your claim was filed.';
                }
            } else {
                email = '';
                password = '';
                if (bot === true) {
                    displayMessage("Oh no! Something went wrong. Please try again.", watson);
                    context = '';
                } else {
                    claimmessages.innerHTML = 'Something went wrong - try again';
                }
            }
        } else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };

    console.log("Submitting claim: ", JSON.stringify(claimFile));
    xhr.send(JSON.stringify(claimFile));
}

function checkStatus() {

    get('./isLoggedIn', function (reply) {

        var login = document.getElementById('login');
        var logout = document.getElementById('logout');

        if (reply.outcome === 'success') {

            if (login) {
                login.style.display = 'none';
            }
            if (login) {
                logout.style.display = 'inherit';
            }
        } else {
            if (logout) {
                logout.style.display = 'none';
            }
            if (login) {
                login.style.display = 'inherit';
            }
        }
    });
}

// Enter is pressed
function newEvent(e, target) {
    if (e.which === 13 || e.keyCode === 13) {

        if (target === "login") {
            login();
        }
    }
}

checkStatus();