var baseUrl = 'http://api.zuppbikes.com:3000/admin/';
var token = '';
var code = '';
var user = '';

//admin login
$(".loginButton").click(function (e) { 
    e.preventDefault();

    $(this)[0].innerHTML = '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>';
    $(this).attr('disabled', 'disabled');

    var email = $('.adminId').val();
    var password = $('.adminPassword').val();

    if(email == '' || password == ''){
    	Materialize.toast('Please enter valid login credentials!', 4000);
    	$(this)[0].innerHTML = 'ZUPP!';
    	$(this).attr('disabled', false);
    }
    else{
    	var data = {"email":email, "password":password};

	    $.ajax({
	    	url: baseUrl + 'login',
	    	type: "POST",
	        contentType: "application/json",
	        crossDomain: true,
	        data: JSON.stringify(data),
	        success: function(result){
	        	if(result.status == 'success'){
	        		token = result.data;
	        		localStorage.setItem('token', token);
	        		window.location.href = './vendors';
	        	}
	        },
	        error: function (jqXHR, textStatus, errorThrown) {
	        	if(jqXHR.status == 500){
	        		Materialize.toast('Please enter valid credentials to login!', 4000);
	        		$('.loginButton')[0].innerHTML = 'ZUPP!';
    				$('.loginButton').attr('disabled', false);
	        	}
	        }
	    });  
    } 
});

//logout
$('.logoutBtn').click(function(){
	localStorage.setItem('token', '');
	location.href = 'index';
});

//format date
function formatNewDate(date){
	if(date !== undefined){
		var currentTime = new Date(date);
		var date = currentTime.getDate();
		var month = currentTime.getMonth() + 1;
		var year = currentTime.getFullYear();

		var fullDate = date + '/' + month + '/' + year;
		return fullDate;
	}
	else{
		return '';
	}
}

token = localStorage.getItem('token');

var currentPath = window.location.pathname.split('/')[2];

//get vehicle list
if(currentPath == 'vehicles'){
	$.ajax({
		url: baseUrl + 'vehicles?page=1',
		type: "GET",
	    contentType: "application/json",
	    crossDomain: true,
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result.status == 'success'){
	    		if(result.data.length == 0){
	    			if(currentPath == 'vehicles')
	    				Materialize.toast('No vehicles found!', 4000);
	    		}
	    		else{
	    			$('.tableBody').empty();

	    			$.each(result.data, function(key, val){
	    				if(val.vendorId == undefined)
	    					var addVendorBtn = '<a id='+val.id+' class="btn waves-effect waves-light addVendorBtn">Assign Vendor</a>';
	    				else
	    					var addVendorBtn = '<a id='+val.id+' class="btn waves-effect waves-light addVendorBtn modal-trigger">Change Vendor</a>';
	    				var editBtn = '<a id='+val.id+' class="btn btn-flat editBtn">Edit</a>';
	    				var delBtn = '<a id='+val.id+' class="btn btn-flat deleteBtn">Delete</a>';
	    				var changeStatus = '<a id='+val.id+' class="btn waves-effect changeStatusBtn">Change Status</a>';

		        		$('.dashboardMainContent').append('<div class="garageCard"><img src='+val.image+' alt="Bike"><div class="cardText"><div class="gridRow1"><div class="brandName">'+val.brand+' '+val.model+'</div><div class="regNo">'+val.registrationNumber+'</div></div><div class="gridRow2"><label class="cardLabel">Insurance Valid Till</label><div class="insuranceDate">'+formatNewDate(val.insuranceExpiry)+'</div></div><div class="gridRow4"><label class="cardLabel">Last Serviced On</label><div class="serviceDate">'+formatNewDate(val.lastServiceDate)+'</div></div><div class="gridRow5"><label class="cardLabel">Vendor</label><div class="currentStatus">'+val.vendorId+'</div></div><div class="gridRow5"><label class="cardLabel">Status</label><div class="currentStatus">'+val.status+'</div></div></div><div>'+changeStatus+''+addVendorBtn+'</div><div class="cardBtns">'+editBtn+''+delBtn+'</div></div>');
	    			});
	    		}
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
}

//on vehicle reg no click
$('.tableBody').on('click', '.vehicleSelect', function(){
	var vehicleId = $(this).attr('id');
	localStorage.setItem('vehicleId', vehicleId);
	location.href = 'vehicleDetails';
});

//assign vendor button click
$('.dashboardMainContent').on('click', '.addVendorBtn', function(){
	var vehicleId = $(this).attr('id');
    localStorage.setItem('vehicleId', vehicleId);
    $('#assignVendorModal').modal('open');
});

//on vehicle delete click
$('.tableBody').on('click', '.deleteBtn', function(){
	var vendorId = $(this).attr('id');

	$.ajax({
		url: baseUrl + 'vehicle/'+vendorId,
		type: "DELETE",
	    contentType: "application/json",
	    crossDomain: true,
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result.status == 'success'){
	    		Materialize.toast('Vehicle deactivated!', 4000);
	    		location.reload(); 	
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});

//on vehicle edit click
$('.tableBody').on('click', '.editBtn', function(){
	var vehicleId = $(this).attr('id');
	localStorage.setItem('vehicleId', vehicleId);
	location.href = 'editVehicle';
});

//on vehicle card edit click
$('.dashboardMainContent').on('click', '.editBtn', function(){
	var vehicleId = $(this).attr('id');
	localStorage.setItem('vehicleId', vehicleId);
	location.href = 'editVehicle';
});

//on vehicle card delete click
$('.dashboardMainContent').on('click', '.deleteBtn', function(){
	if(confirm('Are you sure you want to delete this vehicle?')){
		var vendorId = $(this).attr('id');

		$.ajax({
			url: baseUrl + 'vehicle/'+vendorId,
			type: "DELETE",
		    contentType: "application/json",
		    crossDomain: true,
		    beforeSend: function (xhr) {
		      xhr.setRequestHeader("Authorization", "Bearer "+ token);
		    },
		    success: function(result){
		    	if(result.status == 'success'){
		    		Materialize.toast('Vehicle deactivated!', 4000);
		    		location.reload(); 	
		    	}
		    },
		    error: function (jqXHR, textStatus, errorThrown) {
		    	console.log('error');
		    }
		});
	};
});

//on vehicle change status click
$('.dashboardMainContent').on('click', '.changeStatusBtn', function(){
	var vehicleId = $(this).attr('id');
	localStorage.setItem('vehicleId', vehicleId);
	$('#changeStatusModal').modal('open');
});

//change status button click
$('.saveStatusBtn').click(function(){
	var status = $('.statusSelect').val();
	var vehicleId = localStorage.getItem('vehicleId');

	var data = {"vehicleId":vehicleId, "status":status};

	$.ajax({
		url: baseUrl + 'vehicles/s/',
		type: "PUT",
	    contentType: "application/json",
	    crossDomain: true,
	    data: JSON.stringify(data),
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result.status == 'success'){
    			Materialize.toast('Status changed successfully!', 4000);
    			location.reload();
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});

if(currentPath == 'editVehicle'){
	//get details of selected vehicle
	var vehicleId = localStorage.getItem('vehicleId');
	//localStorage.setItem('vehicleId', '');
	if(vehicleId == ''){
	}
	else if(vehicleId !== '' || vehicleId !== null){
		$.ajax({
			url: baseUrl + 'vehicle/'+vehicleId,
			type: "GET",
		    contentType: "application/json",
		    crossDomain: true,
		    beforeSend: function (xhr) {
		      xhr.setRequestHeader("Authorization", "Bearer "+ token);
		    },
		    success: function(result){
		    	var currentLocation = window.location.pathname.split('/')[1];
		    	
		    	if(currentLocation == 'vehicleDetails'){
		    		if(result.status == 'success'){
			    		$('#image').append('<img src='+result.data.image+'>');
			    		$('#status').append('<h5 class="vehicleValue">'+result.data.status+'</h5>');
		    			$('#brand').append('<h5 class="vehicleValue">'+result.data.brand+'</h5>');
						$('#model').append('<h5 class="vehicleValue">'+result.data.model+'</h5>');
						$('#regNumber').append('<h5 class="vehicleValue">'+result.data.registrationNumber+'</h5>');
						$('#regExpiry').append('<h5 class="vehicleValue">'+formatNewDate(result.data.registrationExpiry)+'</h5>');
						$('#currentDist').append('<h5 class="vehicleValue">'+result.data.currentDist+'</h5>');
						$('#lastServiceDist').append('<h5 class="vehicleValue">'+result.data.lastServiceDistanceReading+'</h5>');
						$('#lastServiceDate').append('<h5 class="vehicleValue">'+formatNewDate(result.data.lastServiceDate)+'</h5>');
						$('#emissionNumber').append('<h5 class="vehicleValue">'+result.data.emissionNumber+'</h5>');
						$('#emissionExpiryDate').append('<h5 class="vehicleValue">'+formatNewDate(result.data.emissionExpiry)+'</h5>');
						$('#insuranceNumber').append('<h5 class="vehicleValue">'+result.data.insuranceNumber+'</h5>');
						$('#insuranceExpiryDate').append('<h5 class="vehicleValue">'+formatNewDate(result.data.insuranceExpiry)+'</h5>');
						$('#trackingNumber').append('<h5 class="vehicleValue">'+result.data.trackingDeviceIMEI+'</h5>');
						$('#permitNumber').append('<h5 class="vehicleValue">'+result.data.permitNumber+'</h5>');
						$('#permitExpiryDate').append('<h5 class="vehicleValue">'+formatNewDate(result.data.permitExpiry)+'</h5>');
			    	}
		    	}
		    	else if(currentLocation == 'editVehicle'){
		    		if(result.status == 'success'){
		    			$('#brand').val(result.data.brand);
		    			$('#model').val(result.data.model);
						$('#regNumber').val(result.data.registrationNumber);
						$('#registrationExpiry').val(formatNewDate(result.data.registrationExpiry));
						$('#currentDistanceReading').val(result.data.currentDistanceReading);
						$('#lastServiceDistanceReading').val(result.data.lastServiceDistanceReading);
						$('#lastServiceDate').val(formatNewDate(result.data.lastServiceDate));
						$('#emissionNumber').val(result.data.emissionNumber);
						$('#emissionExpiry').val(formatNewDate(result.data.emissionExpiry));
						$('#insuranceNumber').val(result.data.insuranceNumber);
						$('#insuranceExpiry').val(formatNewDate(result.data.insuranceExpiry));
						$('#trackingDeviceIMEI').val(result.data.trackingDeviceIMEI);
						$('#permitNumber').val(result.data.permitNumber);
						$('#permitExpiry').val(formatNewDate(result.data.permitExpiry));
		    		}
		    	}
		    },
		    error: function (jqXHR, textStatus, errorThrown) {
		    	console.log('error');
		    }
		});
	}
}

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
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result.status == 'success'){
    			Materialize.toast('Vendor assigned successfully!', 4000);
    			location.reload();
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});

//get vendor list
if(currentPath == 'vendors'){
	$.ajax({
		url: baseUrl + 'vendor?page=1',
		type: "GET",
	    contentType: "application/json",
	    crossDomain: true,
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result.status == 'success'){
	    		if(result.data.length == 0){
	    			if(currentPath == 'vendors')
	    				Materialize.toast('No vendors found!', 4000);
	    		}
	    		else{
	    			$('.vendorListBody').empty();

	    			$.each(result.data, function(key, val){
	    				var editBtn = '<a id='+val.id+' class="btn btn-flat editBtn vendorEdit">Edit</a>';
	    				var delBtn = '<a id='+val.id+' class="btn btn-flat deleteBtn vendorDelete">Delete</a>';
	    				$('.vendorListBody').append('<tr><td class="vendorClick" id='+val.id+'>'+val.token+'</td><td>'+val.name+'</td><td>'+val.dealershipType+'</td><td>'+val.address+'</td><td>'+val.email+'</td><td>'+val.phoneNumber+'</td><td class='+val.id+'>'+editBtn+'</td><td id='+val.id+'>'+delBtn+'</td></tr>');
	    				$('.vendorSelect').append('<option value='+val.id+'>'+val.name+'</option>');
	    			});
	    		}
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
}

//on vendor token click
$('.vendorListBody').on('click', '.vendorClick', function(){
	var vendorId = $(this).attr('id');
	localStorage.setItem('vendorId', vendorId);
	location.href = 'vendorDetails';
});

//on vendor edit click
$('.vendorListBody').on('click', '.editBtn', function(){
	var vendorId = $(this).attr('id');
	localStorage.setItem('vendorId', vendorId);
	location.href = 'editVendor';
});

//on vendor delete click
$('.vendorListBody').on('click', '.deleteBtn', function(){
	var vendorId = $(this).attr('id');

	$.ajax({
		url: baseUrl + 'vendor/'+vendorId,
		type: "DELETE",
	    contentType: "application/json",
	    crossDomain: true,
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result.status == 'success'){
	    		Materialize.toast('Vendor deactivated!', 4000);
	    		location.reload(); 	
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});

//edit vendor from vendor details page
$('.goToEditVendor').click(function(e){
	e.preventDefault();

	var vendorId = localStorage.getItem('vendorId');
	location.href = 'editVendor';
});


//delete vendor from vendor details page
$('.deleteVendorBtn').click(function(){
	var vendorId = localStorage.getItem('vendorId');
	
	if(confirm('Are you sure you want to delete this vendor?')){
		$.ajax({
			url: baseUrl + 'vendor/'+vendorId,
			type: "DELETE",
		    contentType: "application/json",
		    crossDomain: true,
		    beforeSend: function (xhr) {
		      xhr.setRequestHeader("Authorization", "Bearer "+ token);
		    },
		    success: function(result){
		    	if(result.status == 'success'){
		    		Materialize.toast('Vendor deactivated!', 4000);
		    		location.href = 'vendors'; 	
		    	}
		    },
		    error: function (jqXHR, textStatus, errorThrown) {
		    	console.log('error');
		    }
		});
	}
});

if(currentPath == 'editVendor'){
	//get vehicles of single vendor
	var vendorId = localStorage.getItem('vendorId');
	//localStorage.setItem('vendorId', '');
	if(vendorId == ''){
	}
	else if(vendorId !== '' || vendorId !== null){
		//get details of selected vendor
		$.ajax({
			url: baseUrl + 'vendor/'+vendorId,
			type: "GET",
		    contentType: "application/json",
		    crossDomain: true,
		    beforeSend: function (xhr) {
		      xhr.setRequestHeader("Authorization", "Bearer "+ token);
		    },
		    success: function(result){
		    	if(result.status == 'success'){
		    		var currentLocation = window.location.pathname.split('/')[2];
		    		if(currentLocation == 'vendorDetails'){
		    			$('#name').append('<h5 class="vendorValue">'+result.data.name+'</h5>');
						$('#email').append('<h5 class="vendorValue">'+result.data.email+'</h5>');
						$('#phone').append('<h5 class="vendorValue">'+result.data.phoneNumber+'</h5>');
						$('#address').append('<h5 class="vendorValue">'+result.data.address+'</h5>');
						$('#dealer').append('<h5 class="vendorValue">'+result.data.dealershipType+'</h5>');

						$.each(result.data.contactPersons, function(key, val){
							$('.contactPersonDiv').append('<div class="input-field"><p class="vehicleTitle">Name</p><div id="contactName"><h5 class="vendorValue">'+val.name+'</h5></div></div><div class="input-field"><p class="vehicleTitle">Phone Number</p><div id="contactPhone"><h5 class="vendorValue">'+val.phoneNumber+'</h5></div></div>')
						});
						//get vehicles of selected vendor
						$.ajax({
							url: baseUrl + 'vehicles/v/'+vendorId,
							type: "GET",
						    contentType: "application/json",
						    crossDomain: true,
						    beforeSend: function (xhr) {
						      xhr.setRequestHeader("Authorization", "Bearer "+ token);
						    },
						    success: function(result){
						    	if(result.status == 'success'){
						    		if(result.data.length == 0){
						    			Materialize.toast('No vehicles found!', 4000);
						    		}
						    		else{
						    			$.each(result.data, function(key, val){
						    				$('.vehicles').append('<li class="singleVehicle">'+val.brand+'  '+val.model+' - '+val.registrationNumber+'</li>');
						    			});
						    		}
						    	}
						    },
						    error: function (jqXHR, textStatus, errorThrown) {
						    	console.log('error');
						    }
						});
		    		}
		    		else if(currentLocation == 'editVendor'){
		    			$('#vendorName').val(result.data.name);
						$('#email').val(result.data.email);
						$('#countryCode').val(result.data.countryCode);
						$('#mobileNumber').val(result.data.phoneNumber);
						$('#address').val(result.data.address);
						$('#dealershipType').val(result.data.dealershipType);
						$('#contactName').val(result.data.contactPersons[0].name);
						$('#phoneNumber').val(result.data.contactPersons[0].phoneNumber);					
		    		}
		    	}
		    },
		    error: function (jqXHR, textStatus, errorThrown) {
		    	console.log('error');
		    }
		});
	}
}

//get svc reports
if(currentPath == 'reports'){
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
	    			Materialize.toast('No report found!', 4000);
	    		}
	    		else{
	    			$('.revenueGenerated')[0].innerHTML = result.data.revenueGenerated  + '/-';
	        		$('.svcClaims')[0].innerHTML = result.data.svcClaims;
					$('.totalActiveSVC')[0].innerHTML = result.data.totalActiveSVC;        		
					$('.totalExpiredSVC')[0].innerHTML = result.data.totalExpiredSVC;
					$('.totalSVC')[0].innerHTML = result.data.totalSVC;
					$('.Premium')[0].innerHTML = result.data.Premium;
					$('.Standard')[0].innerHTML = result.data.Standard;
	    		}
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
}

//get svc plan list
if(currentPath == 'svcPlans'){
	$.ajax({
		url: baseUrl + 'plan',
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
	    				var delBtn = '<a id='+val.id+' class="btn btn-flat planDelBtn deleteBtn">Delete</a>';
	    				var editBtn = '<a id='+val.id+' class="btn btn-flat planEditBtn editBtn">Edit</a>';
	    				$('.planListBody').append('<tr><td>'+val.name+'</td><td>'+val.cost+'</td><td>'+val.validityDuration+'</td><td>'+val.coverage+'</td><td>'+val.noOfClaims+'</td><td>'+editBtn+'</td><td>'+delBtn+'</td></tr>');
	    			});
	    		}
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
}

//on delete plan
$('.planListBody').on('click', '.deleteBtn', function(){
	var planId = $(this).attr('id');

	if(confirm('Are you sure you want to delete this plan permanently?')){
		console.log('here');
		$.ajax({
			url: baseUrl + 'plan/'+planId,
			type: "DELETE",
		    contentType: "application/json",
		    crossDomain: true,
		    beforeSend: function (xhr) {
		      xhr.setRequestHeader("Authorization", "Bearer "+ token);
		    },
		    success: function(result){
		    	if(result.status == 'success'){
	    			Materialize.toast('SVC Plan deleted successfully!', 4000);
	    			setTimeout(function(){
	    				location.reload();
	    			}, 2000);
		    	}
		    },
		    error: function (jqXHR, textStatus, errorThrown) {
		    	console.log('error');
		    }
		});
	}
	else{
		return false;
	}
});

//on edit plan
$('.planListBody').on('click', '.editBtn', function(){
	var planId = $(this).attr('id');
	localStorage.setItem('planId', planId);
	location.href = 'editPlan';
});

//get selected plan details
if(currentPath == 'editPlan'){
	var planId = localStorage.getItem('planId');

	$.ajax({
		url: baseUrl + 'plan/'+planId,
		type: "GET",
	    contentType: "application/json",
	    crossDomain: true,
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result.status == 'success'){
				$('#name').val(result.data.name);    			
				$('#cost').val(result.data.cost);
				$('#duration').val(result.data.validityDuration);
				$('#claims').val(result.data.noOfClaims);    			
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
}

//on save edit plan
$('.editPlanBtn').click(function(e){
	e.preventDefault();

	var planId = localStorage.getItem('planId');
	var planName = $('#name').val();
	var cost = $('#cost').val();
	var validityDuration = $('#duration').val();
	var noOfClaims = $('#claims').val();
	var coverage = $('#coverage').val();

	var data = {"cost":cost, "validityDuration":validityDuration, "noOfClaims":noOfClaims, "planId":planId, "name":planName, "coverage":coverage};

	$.ajax({
		url: baseUrl + 'plan',
		type: "PUT",
	    contentType: "application/json",
	    crossDomain: true,
	    data: JSON.stringify(data),
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result.status == 'success'){
    			Materialize.toast('SVC Plan edited successfully!', 4000);
    			setTimeout(function(){
    				location.href = 'svcPlans';
    			}, 2000);
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});

//on create claim click
$('.createClaimBtn').click(function(){
	$('#getPhoneModal').modal('open');
});

//on phone number save click
$('.savePhoneBtn').click(function(){

	var phoneNumber = $('.phoneNumber').val();
	var data = {"phoneNumber": phoneNumber};

	$.ajax({
		url: baseUrl + 'claim/o/',
		type: "POST",
	    contentType: "application/json",
	    crossDomain: true,
	    data: JSON.stringify(data),
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result){
	    		location.href = 'createClaim';
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});

//on check svc
$('.checkSvcBtn').click(function(e){
	e.preventDefault();

	var svcNumber = $('#svcNumber').val();

	$.ajax({
		url: baseUrl + 'svc/s/?searchString='+svcNumber,
		type: "GET",
	    contentType: "application/json",
	    crossDomain: true,
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result.status == 'success'){
    			if(result.data.status == 'active'){
    				var data = {"phoneNumber": result.data.customerPhoneNumber};

    				$.ajax({
						url: baseUrl + 'claim/o/',
						type: "POST",
					    contentType: "application/json",
					    crossDomain: true,
					    data: JSON.stringify(data),
					    beforeSend: function (xhr) {
					      xhr.setRequestHeader("Authorization", "Bearer "+ token);
					    },
					    success: function(result){
					    	if(result){
					    		$('.claimDetails').show();
					    		$('.checkSvcDiv').hide();
					    	}
					    },
					    error: function (jqXHR, textStatus, errorThrown) {
					    	console.log('error');
					    }
					});
    			}
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});

});

//save claim
$('.saveClaimBtn').click(function(e){
	e.preventDefault();

	var otp = $('#otp').val();
	var claim = $('#claim').val();
	var location = $('#location').val();
	var days = $('#days').val();
	var deliveryPerson = $('#deliveryPerson').val();

	var data = {"otp":otp, "typeOfClaim":claim, "location":location, "days":days, "deliveryPerson":deliveryPerson };

	$.ajax({
		url: baseUrl + 'claim',
		type: "POST",
	    contentType: "application/json",
	    crossDomain: true,
	    data: JSON.stringify(data),
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result.status == 'success'){
    			Materialize.toast('Claim created successfully!', 4000);
	    		setTimeout(function(){
    				location.href = 'svcPlans';
    			}, 2000);
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});

//on create svc plan click
$('.createPlanBtn').click(function(){
	location.href = 'createPlan';
});

//on save plan click
$('.savePlanBtn').click(function(e){
	e.preventDefault();

	var planName = $('#name').val();
	var cost = $('#cost').val();
	var validityDuration = $('#duration').val();
	var noOfClaims = $('#claims').val();
	var coverage = $('#coverage').val();

	var data = {"cost":cost, "validityDuration":validityDuration, "noOfClaims":noOfClaims, "name":planName, "coverage":coverage};

	$.ajax({
		url: baseUrl + 'plan',
		type: "POST",
	    contentType: "application/json",
	    crossDomain: true,
	    data: JSON.stringify(data),
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result.status == 'success'){
    			Materialize.toast('SVC Plan created successfully!', 4000);
    			setTimeout(function(){
    				location.href = 'svcPlans';
    			}, 2000);
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});

//get claims list
if(currentPath == 'svcClaims'){
	$.ajax({
		url: baseUrl + 'claim?searchString=svc',
		type: "GET",
	    contentType: "application/json",
	    crossDomain: true,
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result.status == 'success'){
	    		$.each(result.data, function(key, val){
	    			if(val.status == 'completed'){
						var endClaimBtn = "<a id="+val.id+" class='btn waves-effect endClaimBtn'>Get Report</a>";
	    			}
	    			else
	    				var endClaimBtn = "<a id="+val.id+" class='btn waves-effect endClaimBtn'>End Claim</a>";

	    			$('.claimListBody').append('<tr><td>'+val.vehicleId.registrationNumber+'</td><td>'+val.svcToken+'</td><td>'+formatNewDate(val.expectedTimeOfReturn)+'</td><td>'+formatNewDate(val.actualTimeOfReturn)+'</td><td>'+val.location+'</td><td>'+endClaimBtn+'</td></tr>');
	    		});
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
}

//on claim search
$('.goButton').click(function(){
	var searchString = $('.searchValue').val();

	$.ajax({
		url: baseUrl + 'claim?searchString='+searchString,
		type: "GET",
	    contentType: "application/json",
	    crossDomain: true,
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result.status == 'success'){
	    		$.each(result.data, function(key, val){
	    			if(val.status == 'completed'){
	    				var endClaimBtn = "<a id="+val.id+" class='btn endClaimBtn'>Get Report</a>";
	    			}
	    			else
	    				var endClaimBtn = "<a id="+val.id+" class='btn endClaimBtn'>End Claim</a>";

	    			$('.claimListBody').append('<tr><td>'+val.vehicleId.registrationNumber+'</td><td>'+val.svcToken+'</td><td>'+formatNewDate(val.expectedTimeOfReturn)+'</td><td>'+formatNewDate(val.actualTimeOfReturn)+'</td><td>'+val.location+'</td><td>'+endClaimBtn+'</td></tr>');
	    		});
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});

//on end claim
$('.claimListBody').on('click', '.endClaimBtn', function(){
	var claimId = $(this).attr('id');

	$.ajax({
		url: baseUrl + 'claim/e/'+claimId,
		type: "POST",
	    contentType: "application/json",
	    crossDomain: true,
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result){
	    		Materialize.toast('Claim ended successfully!', 4000);
	    		setTimeout(function(){
    				location.reload();
    			}, 2000);
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});

//on create vendor click
$('.createClick').click(function(){
	location.href = 'createVendor';
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
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result.status == 'success'){
    			Materialize.toast('Vendor created successfully!', 4000);
    			setTimeout(function(){
    				location.href = 'vendors';
    			}, 2000);
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});

//on edit vendor save click
$('.editVendorBtn').click(function(e){
	e.preventDefault();

	var vendorId = localStorage.getItem('vendorId');

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
		url: baseUrl + 'vendor/'+vendorId,
		type: "PUT",
	    contentType: "application/json",
	    crossDomain: true,
	    data: JSON.stringify(data),
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result.status == 'success'){
    			Materialize.toast('Vendor edited successfully!', 4000);
    			setTimeout(function(){
    				location.href = 'vendors';
    			}, 2000);
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});

//on add vehicle click
$('.addVehicleBtn').click(function(){
	location.href = 'addVehicle';
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
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result.status == 'success'){
    			Materialize.toast('Vehicle added successfully!', 4000);
    			setTimeout(function(){
    				location.href = 'vehicles';
    			}, 2000);
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});

//on vehicle edit save
$('.editVehicleBtn').click(function(e){
	e.preventDefault();

	var vehicleId = localStorage.getItem('vehicleId');

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
		url: baseUrl + 'vehicle/'+vehicleId,
		type: "PUT",
	    contentType: "application/json",
	    crossDomain: true,
	    data: JSON.stringify(data),
	    beforeSend: function (xhr) {
	      xhr.setRequestHeader("Authorization", "Bearer "+ token);
	    },
	    success: function(result){
	    	if(result.status == 'success'){
    			Materialize.toast('Vehicle edited successfully!', 4000);
    			setTimeout(function(){
    				location.href = 'vehicles';
    			}, 2000);
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	console.log('error');
	    }
	});
});