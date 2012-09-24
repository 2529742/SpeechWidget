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
	var annotateImage = function(entities,image){
		var resultsBox = $('<ul id="speechWidgetDialogResultsBox">');
		$(entities).each(function(){
			resultsBox.append('<li><input type="radio" name="entity">' + this.getSubjectUri() + '</li>');
		});

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
								var a = $('<a href="' + url + '" target="_blank">');
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