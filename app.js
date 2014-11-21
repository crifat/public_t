$(document).ready(function(){



	var my_latittude, my_longitude, lat, lon;
	var JSON_toilet = [];

	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(success);
	} else {
	  error('Geo Location is not supported');
	}

	function success(position) {
	     my_latittude = position.coords.latitude;
	     my_longitude = position.coords.longitude;

	     var latLngA = new google.maps.LatLng(my_latittude, my_longitude);
         var latLngB = new google.maps.LatLng(23.859025, 90.4014802);
         var distance = google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);

         console.log(distance/1000);

         $.ajax({
			url: "http://127.0.0.1:3000/toilets.json",
			type: "GET",
			success: function(toilets){

				$.each(toilets, function(i, toilet){
					var latLngA = new google.maps.LatLng(my_latittude, my_longitude);
			        var latLngB = new google.maps.LatLng(toilet.latitude, toilet.longitude);
					var distance_from_me = google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);
					JSON_toilet.push({
						id: toilet.id,
						longitude: toilet.longitude,
						latitude: toilet.latitude,
						address: toilet.address,
						name: toilet.name,
						distance: distance_from_me
					});
				});

				console.log(JSON_toilet);

				function sort_json(prop, asc) {
				    JSON_toilet = JSON_toilet.sort(function(a, b) {
				        if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
				        else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
				    });
				    
				}

				sort_json('distance', true);

				$.each(JSON_toilet, function(i, toilet){
					$('#list').append("<div class='panel panel-info' id='" + toilet.latitude + " " +toilet.longitude + "' >" + "<div class='panel-heading'>" + toilet.name + "</div>" + "<div class='panel-body'>" + toilet.address + "</div>" + "</div>");
				});

			}
		});
	}

	
	$(document).on('click', '.panel' , function(){
		var id = $(this).attr('id');
		var tok_id = [];
		tok_id = id.split(" ");
		lat = tok_id[0];
		lon = tok_id[1];
		alert(lat + lon);


	// 	function initialize() {
	// 	  var myLatlng = new google.maps.LatLng(lat,lon);
	// 	  var mapOptions = {
	// 	    zoom: 4,
	// 	    center: myLatlng
	// 	  }
	// 	  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	// 	  var marker = new google.maps.Marker({
	// 	      position: myLatlng,
	// 	      map: map,
	// 	      title: 'Hello World!'
	// 	  });
	// 	}

	// 	google.maps.event.addDomListener(window, 'load', initialize);
	imgPaht = "http://maps.google.com/maps/api/staticmap?center=" + lat + "," + lon + "&zoom=13&markers=" + lat + "," + lon + "&size=300x400&sensor=false&key=ABQIAAAA6-Rq-t8XwsqXeXws3DleLBSI_7XewNJfovQwsmZjGMbTG7rp6BQaj3bwm-gy7nGQPyWKPTd3zPtcVA";
	$('<img src="'+ imgPaht +'">').load(function() {
		$('#map').html("");
	  $(this).width(400).height(400).appendTo('#map');
	});

	 });


	


	

});