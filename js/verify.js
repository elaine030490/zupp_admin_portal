//get params from url
function getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$('.savePassword').click(function(){
	var code = getParameterByName('code');
	var email = getParameterByName('u');

	var password = $('#password').val();
	var verifyPassword = $('#verifyPassword').val();

	if(password !== verifyPassword){
		Materialize.toast('Passwords do not match!', 4000);
		return false;
	}
	else{
		var data = {"code": code, "email":email, "password":password};

		$.ajax({
			url: 'http://api.zuppbikes.com:3000/admin/verify',
			type: "POST",
		    contentType: "application/json",
		    crossDomain: true,
		    data: JSON.stringify(data),
		    /*beforeSend: function (xhr) {
		      xhr.setRequestHeader("Authorization", "Bearer "+ token);
		    },*/
		    success: function(result){
		    	if(result.status == 'success'){
	    			Materialize.toast('Password created successfully!', 4000);
	    			setTimeout(function(){
	    				location.href = 'index.html';
	    			}, 2000);
		    	}
		    },
		    error: function (jqXHR, textStatus, errorThrown) {
		    	console.log('error');
		    }
		});
	}
});