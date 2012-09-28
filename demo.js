$(function(){
	//Initialize and set up VIE instance
	var myVIE = new VIE();
	myVIE.use(new myVIE.StanbolService, 'stanbol');
	myVIE.use(new myVIE.DBPediaService, 'dbpedia');
	//call SpeechWidget on a sample image click
	$('#sample_img').click(function(){
		var image = $(this);
		image.vieSpeechWidget({
			vie: myVIE,
			entityHandler: function(entities){
				annotateImage(entities,image);
			}
		});
	});
	
	//A possible entity handler function, that renders a dialog with resulted entities listed, so user can choose, which entity use for the annotation
	var annotateImage = function(entities,image){
		var resultsBox = $('<ul id="speechWidgetDialogResultsBox">');
		$(entities).each(function(){
			resultsBox.append('<li><input type="radio" name="entity">' + this.getSubjectUri() + '</li>');
		});
		
		//Render a list of resulted entities as a radiobox and append it to the new dialog window with OK and Cancel buttons
		var radiobox = $('<div>')
		.append(resultsBox)
		.dialog({
			title: 'Please choose the entity',
			buttons:[
				{
					text: "OK",
					click: function(){
						var dialog = this;
						var radioGroup = $('[name="entity"]');
						$(radioGroup)
						.each(function(){
							if(this.checked){
								var url = this.nextSibling.data;
								//annotate the image with the chosen entity
								image.attr('about',url);
								var a = $('<a href="' + url + '" target="_blank">');
								//wrap the image into the link to DBPedia article
								image.wrap(a);
								$(dialog).dialog('close');
							}
						});
					}
				},
				{
					text: "Cancel",
					click: function(){
						$(this).dialog('close');
					}
				}
			]
		});
		

	};
});