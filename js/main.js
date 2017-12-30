var baseUrl = 'http://ec2-18-221-181-136.us-east-2.compute.amazonaws.com:3000/admin/';
var token = '';
var code = '';
var user = '';

//admin login
$(".loginButton").click(function (e) { 
    e.preventDefault();
    window.location.href = './vendors.html';

    /*$(this)[0].innerHTML = '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>';
    $(this).attr('disabled', 'disabled');

    var email = $('.dealerId').val();
    var password = $('.dealerPassword').val();

    if(email == '' || password == ''){
    	Materialize.toast('Please enter valid login credentials!', 4000);
    	$(this)[0].innerHTML = 'ZUPP!';
    	$(this).attr('disabled', false);
    }
    else{
    	var data = {"email":email, "password":password};

	    $.ajax({
	    	url: baseUrl + 'login/v/',
	    	type: "POST",
	        contentType: "application/json",
	        crossDomain: true,
	        data: JSON.stringify(data),
	        success: function(result){
	        	if(result.status == 'success'){
	        		token = result.data;
	        		localStorage.setItem('token', token);
	        		window.location.href = './dashboard';
	        	}
	        },
	        error: function (jqXHR, textStatus, errorThrown) {
	        	if(jqXHR.status == 500){
	        		Materialize.toast('Please enter valid credentials to login!', 4000);
	        		$(this)[0].innerHTML = 'ZUPP!';
    				$(this).attr('disabled', false);
	        	}
	        }
	    });  
    } */
});

//format date
function formatNewDate(date){
	var currentTime = new Date(date);
	var date = currentTime.getDate();
	var month = currentTime.getMonth() + 1;
	var year = currentTime.getFullYear();

	var fullDate = date + '/' + month + '/' + year;
	return fullDate;
}

//get vehicle list
$.ajax({
	url: baseUrl + 'vehicles?page=1',
	type: "GET",
    contentType: "application/json",
    crossDomain: true,
    /*beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer "+ token);
    },*/
    success: function(result){
    	if(result.status == 'success'){
    		if(result.data.length == 0){
    			Materialize.toast('No vehicles found!', 4000);
    		}
    		else{
    			$('.tableBody').empty();

    			$.each(result.data, function(key, val){
    				if(val.vendorId == undefined)
    					var addVendorBtn = '<a id='+val.id+' class="btn waves-effect waves-light addVendorBtn modal-trigger">Assign Vendor</a>';
    				else
    					var addVendorBtn = '';

    				$('.tableBody').append('<tr><td>'+val.registrationNumber+'</td><td>'+formatNewDate(val.registrationExpiry)+'</td><td>'+val.vendorId+'</td><td>'+val.status+'</td><td>'+val.lastServiceDistanceReading+'</td><td>'+formatNewDate(val.insuranceExpiry)+'</td><td>'+formatNewDate(val.lastServiceDate)+'</td><td class='+val.id+'>Edit</td><td id='+val.id+'>Delete</td><td>'+addVendorBtn+'</td></tr>');
    			});
    		}
    	}
    },
    error: function (jqXHR, textStatus, errorThrown) {
    	console.log('error');
    }
});

//assign vendor button click
$('.tableBody').on('click', '.addVendorBtn', function(){
    var vehicleId = $(this).attr('id');
    localStorage.setItem('vehicleId', vehicleId);
    $('#assignVendorModal').modal('open');
});

//asign vendor to vehicle save
$('.assignVendorBtn').on('click', function(){
	var vehicleId = localStorage.getItem('vehicleId');
	var vendorId = $('.vendorSelect').val();

	var data = {"vehicleId": vehicleId, "vendorId": vendorId};

	$.ajax({
		url: baseUrl + 'assignVehicle',
		type: "PUT",
	    contentType: "application/json",
	    crossDomain: true,
	    data: JSON.stringify(data),
	    /*beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },*/
	    success: function(result){
	    	if(result.status == 'success'){
    			Materialize.toast('Vendor assigned successfully!', 4000);
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});

//get vendor list
$.ajax({
	url: baseUrl + 'vendor?page=1',
	type: "GET",
    contentType: "application/json",
    crossDomain: true,
    /*beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer "+ token);
    },*/
    success: function(result){
    	if(result.status == 'success'){
    		if(result.data.length == 0){
    			Materialize.toast('No vendors found!', 4000);
    		}
    		else{
    			$('.vendorListBody').empty();

    			$.each(result.data, function(key, val){
    				$('.vendorListBody').append('<tr><td>'+val.name+'</td><td>'+val.address+'</td><td>'+val.dealershipType+'</td><td>'+val.email+'</td><td>'+val.phoneNumber+'</td><td class='+val.id+'>Edit</td><td id='+val.id+'>Delete</td></tr>');
    				$('.vendorSelect').append('<option value='+val.id+'>'+val.name+'</option>')
    			});
    		}
    	}
    },
    error: function (jqXHR, textStatus, errorThrown) {
    	console.log('error');
    }
});

//get svc reports
$.ajax({
	url: baseUrl + 'report/svc',
	type: "GET",
    contentType: "application/json",
    crossDomain: true,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer "+ token);
    },
    success: function(result){
    	if(result.status == 'success'){
    		if(result.data.length == 0){
    			Materialize.toast('No plans found!', 4000);
    		}
    		else{
    			$('#rentalReport').empty();
    			$('#svcReport').append('<div class="collection"><a class="collection-item"><span class="badge revenueGenerated">Rs. '+result.data.revenueGenerated+'/-</span>Revenue Generated</a><a class="collection-item"><span class="badge svcClaims">'+result.data.svcClaims+'</span>SVC Claims</a><a class="collection-item"><span class="badge totalActiveSVC">'+result.data.totalActiveSVC+'</span>Total Active SVC</a><a class="collection-item"><span class="badge totalExpiredSVC">'+result.data.totalExpiredSVC+'</span>Total Expired SVC</a><a class="collection-item"><span class="badge totalSVC">'+result.data.totalSVC+'</span>Total SVC</a></div>')
    		}
    	}
    },
    error: function (jqXHR, textStatus, errorThrown) {
    	console.log('error');
    }
});

//get rental reports
$.ajax({
	url: baseUrl + 'report/booking',
	type: "GET",
    contentType: "application/json",
    crossDomain: true,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer "+ token);
    },
    success: function(result){
    	if(result.status == 'success'){
    		if(result.data.length == 0){
    			Materialize.toast('No plans found!', 4000);
    		}
    		else{
    			$('#rentalReport').append('<div class="collection"><a class="collection-item"><span class="badge totalBookings">Rs. '+result.data.totalBookings+'/-</span>Total Bookings</a><a class="collection-item"><span class="badge revenueGeneratedWithoutTax">Rs. '+result.data.revenueGeneratedWithoutTax+' /-</span>Revenue Generated without Tax</a><a class="collection-item"><span class="badge revenueGeneratedWithTax">Rs. '+result.data.revenueGeneratedWithTax+' /-</span>Revenue Generated with Tax</a></div>');
    		}
    	}
    },
    error: function (jqXHR, textStatus, errorThrown) {
    	console.log('error');
    }
});

//get svc plan list
/*$.ajax({
	url: baseUrl + 'plan?page=1',
	type: "GET",
    contentType: "application/json",
    crossDomain: true,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer "+ token);
    },
    success: function(result){
    	if(result.status == 'success'){
    		if(result.data.length == 0){
    			Materialize.toast('No plans found!', 4000);
    		}
    		else{
    			$('.planListBody').empty();

    			$.each(result.data, function(key, val){
    				$('.planListBody').append('<tr><td>'+val.name+'</td><td>'+val.address+'</td><td>'+val.dealershipType+'</td><td>'+val.email+'</td><td>'+val.phoneNumber+'</td><td class='+val.id+'>Edit</td><td id='+val.id+'>Delete</td></tr>');
    			});
    		}
    	}
    },
    error: function (jqXHR, textStatus, errorThrown) {
    	console.log('error');
    }
});*/

//on create svc plan click
$('.createPlanBtn').click(function(){
	location.href = 'createPlan.html';
});

//on save plan click
$('.savePlanBtn').click(function(e){
	e.preventDefault();

	var planName = $('#name').val();
	var cost = $('#cost').val();
	var validityDuration = $('#validityDuration').val();
	var noOfClaims = $('#noOfClaims').val();

	var data = {"cost":cost, "validityDuration":validityDuration, "noOfClaims":noOfClaims};

	$.ajax({
		url: baseUrl + 'plan',
		type: "POST",
	    contentType: "application/json",
	    crossDomain: true,
	    data: JSON.stringify(data),
	    /*beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },*/
	    success: function(result){
	    	if(result.status == 'success'){
    			Materialize.toast('SVC Plan created successfully!', 4000);
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});

//on create vendor click
$('.createClick').click(function(){
	location.href = 'createVendor.html';
});

//on save vendor click
$('.saveVendorBtn').click(function(e){
	e.preventDefault();

	var name = $('#vendorName').val();
	var email = $('#email').val();
	var countryCode = $('#countryCode').val();
	var mobileNumber = $('#mobileNumber').val();
	var address = $('#address').val();
	var dealershipType = $('#dealershipType').val();
	var phoneNumber = $('#phoneNumber').val();
	var contactName = $('#contactName').val();

	var contactPersons = {"phoneNumber":phoneNumber, "name":contactName};

	var data = {"name":name, "countryCode":countryCode, "phoneNumber":mobileNumber, "contactPersons":contactPersons, "address":address, "dealershipType":dealershipType, "email":email};

	$.ajax({
		url: baseUrl + 'vendor',
		type: "POST",
	    contentType: "application/json",
	    crossDomain: true,
	    data: JSON.stringify(data),
	    /*beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },*/
	    success: function(result){
	    	if(result.status == 'success'){
    			Materialize.toast('Vendor created successfully!', 4000);
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});

//on add vehicle click
$('.addVehicleBtn').click(function(){
	location.href = 'addVehicle.html';
});

//datepicker options
$('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15, // Creates a dropdown of 15 years to control year,
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: true, // Close upon selecting a date,
    format: 'mm/dd/yyyy'
});

//on vehicle save click
$('.saveVehicleBtn').click(function(e){
	e.preventDefault();

	var registrationNumber = $('#regNumber').val();
	var registrationExpiry = new Date($('#registrationExpiry').val());
	var insuranceNumber = $('#insuranceNumber').val();
	var insuranceExpiry = new Date($('#insuranceExpiry').val());
	var permitNumber = $('#permitNumber').val();
	var permitExpiry = new Date($('#permitExpiry').val());
	var emissionNumber = $('#emissionNumber').val();
	var emissionExpiry = new Date($('#emissionExpiry').val());
	var trackingDeviceIMEI = $('#trackingDeviceIMEI').val();
	var lastServiceDistanceReading = $('#lastServiceDistanceReading').val();
	var lastServiceDate = new Date($('#lastServiceDate').val());
	var currentDistanceReading = $('#currentDistanceReading').val();
	var model = $('#model').val();
	var brand = $('#brand').val();

	var data = {"registrationNumber":registrationNumber, "registrationExpiry":registrationExpiry, "insuranceNumber":insuranceNumber, "insuranceExpiry":insuranceExpiry, "permitExpiry":permitExpiry, "permitNumber":permitNumber, "emissionExpiry":emissionExpiry, "emissionNumber":emissionNumber, "trackingDeviceIMEI":trackingDeviceIMEI, "lastServiceDate":lastServiceDate, "lastServiceDistanceReading":lastServiceDistanceReading, "currentDistanceReading":currentDistanceReading, "model":model, "brand":brand};

	$.ajax({
		url: baseUrl + 'vehicle',
		type: "POST",
	    contentType: "application/json",
	    crossDomain: true,
	    data: JSON.stringify(data),
	    /*beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },*/
	    success: function(result){
	    	if(result.status == 'success'){
    			Materialize.toast('Vehicle added successfully!', 4000);
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});