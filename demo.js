$(function(){
	//Initialize and set up VIE instance
	var myVIE = new VIE();
	myVIE.use(new myVIE.StanbolService, 'stanbol');
	
	//call SpeechWidget on a sample image click
	$('#sample_img').click(function(){
		var image = $(this);
		image.vieSpeechWidget({
			vie: myVIE,
			entityHandler: annotateImage(e, image)
		});
	});
	var annotateImage = function(event, image){
		var url = "http://dbpedia.org/resource/Paul_McCartney";
		var a = $('<a href="' + url + '" target="_blank">');
		image.wrap(a);
	};
});