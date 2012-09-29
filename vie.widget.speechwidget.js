(function($, undefined) {
    $.widget('view.vieSpeechWidget', {
		 _create: function () {
			var self = this;
			var googleVoice = $('<input>');
			googleVoice[0].onwebkitspeechchange = function(){
				var val = event.target.value;
				var words = val.toLowerCase().split(/\s+/);
				//use the js-chartparser function on the input value (and transform the input value to lower case)
				var results = [];	
				var parseChart = parse(words, grammar, grammar.$root);
				var parseTrees;
				
				var toAnnotate = (parseChart.treesForRule('annotate')).length > 0;
				if(toAnnotate){
					parseTrees = parseChart.treesForRule('ent');
					if(parseTrees.length > 0){
						results.push(parseTrees.length + "");
						for (var i in parseTrees) {
							var tree = parseTrees[i];
							if (tree.data) {
								results.push(stringRepr(tree.data));
								results.push(treeString(tree));
							} else {
								results.push(treeString(tree));
							}
						}
					}
					else{
						results.push("1");
						results.push(val);
					}
				}
				else{
					results.push("nothing found");
				}
				
				/* if (parseTrees) { 
					results.push(parseTrees.length + "");
					for (var i in parseTrees) {
						var tree = parseTrees[i];
						if (tree.data) {
							results.push(stringRepr(tree.data));
							results.push(treeString(tree));
						} else {
							results.push(treeString(tree));
						}
					}
				} else {
					results.push("nothing found");
				} */
				
				//call the dialogue manager with the results of the js-chartparser and the original value of the input
				self._dialogueManager(results, val);
			};

			googleVoice.attr('x-webkit-speech','');
			
			var spokenOutput = $('<audio id="spokenOutput">');
			
			var dialog = $('<div id="speechWidgetDialog">')
			.append(googleVoice)
			.append(spokenOutput)
			.dialog({
				title: 'Start annotation'
			});
			
		 },
		 
		 _init: function(){
						
		 },
		 
		_dialogueManager: function(results, val) {
			var self = this;
			//if grammar rejects input
			if (parseInt(results[0]) == 0) {
					//utter the spoken output for unparseable input
					speechStatus = 'unparseable';
					self.speakOutput(val, speechStatus);
			}
			//if input is accepted
			if (parseInt(results[0]) >= 1) {
				self.getAnnotation(results, function(entities) {
					//if there is at least one annotation
					if (entities.length > 0) {
						self.result = entities;
						self.options.entityHandler(entities);
					} else {
						//if there is no annotation at all
						//utter the spoken output for this type of error
						self.speakOutput(val, 'noAnnotation');
					}
				});
			}
		},
		
		//this function manages the spoken Output
		speakOutput: function(customMessage, status) {
			if(this.options.speechOutput){
				//the url to the mary web interface
				var url = this.options.speechServer;

				//generate an output string for the MaryTTS
				var str = '';
				var messageArray = customMessage.split(/\s+/);
				for (var i = 0; i < messageArray.length; i++) {
					if (i == messageArray.length - 1) {
						str += messageArray[i];
					} else {
						str += messageArray[i] + "+";
					}
				};

				//generate variable for what should be said & written
				var speak = [];
				var write = [];
				
				//generate a random output
				var randomIndex = Math.floor(Math.random() * 3);
				if (status == 'unparseable') {
					write = ['I am sorry, I could not understand what "'+customMessage+'" is supposed to mean! Please rephrase your command!', 'I do not understand "'+customMessage+'"','Please rephrase what you mean by "'+customMessage+'"'];
					speak = ["I'm%20sorry%2C%20I%20could%20not%20understand%20what%20%22"+str+"%22%20is%20supposed%20to%20mean.%20Please%20rephrase%20your%20command.","I%20do%20not%20understand%20%22"+str+"%22!", "Please%20rephrase%20what%20you%20mean%20by%20%22"+str+"%22!"];
				}
				if (status == 'error') {
					write = ["Sorry, there was an unexpected error","An error occured","There was an error"];
					speak = ["Sorry%2C%20there%20was%20an%20unexpected%20error.","An%20error%20occured.","There%20was%20an%20error."];
				}
				if (status == 'alternativeInput') {
					write = ["Unfortunately, it seems like I do not understand you correctly. Please try the written input to tag this element!","My recognition is not very well - please use this written input instead!", "Why don't you try the written input to tag this element"];
					speak = ["Unfortunately%2C%20it%20seems%20like%20I%20do%20not%20understand%20you%20correctly.%20Please%20try%20the%20written%20input%20to%20tag%20this%20element!&amp;","My%20recognition%20is%20not%20very%20well%20-%20please%20use%20this%20written%20input%20instead!","Why%20don't%20you%20try%20the%20written%20input%20to%20tag%20this%20element"];
				}
				if (status == 'noAnnotation') {
					write = ['I could not find any annotation entry in my database for "'+customMessage+'"!','My database has no entry for "'+customMessage+'"', 'Unfortunately, "'+customMessage+'" is not part of my database'];
					speak = ["I%20could%20not%20find%20any%20annotation%20entry%20in%20my%20database%20for%20%22"+str+"%22!&amp;","My%20database%20has%20no%20entry%20for%20%22"+str+"%22!", "Unfortunately%2C%20%22"+str+"%22%20is%20not%20part%20of%20my%20database."];
				}

				//compose a string of the mary request and the spoken output
				var maryString = "process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=" + speak[randomIndex] + "&OUTPUT_TEXT=&effect_Volume_selected=&effect_Volume_parameters=amount%3A2.0%3B&effect_Volume_default=Default&effect_Volume_help=Help&effect_TractScaler_selected=&effect_TractScaler_parameters=amount%3A1.5%3B&effect_TractScaler_default=Default&effect_TractScaler_help=Help&effect_F0Scale_selected=&effect_F0Scale_parameters=f0Scale%3A2.0%3B&effect_F0Scale_default=Default&effect_F0Scale_help=Help&effect_F0Add_selected=&effect_F0Add_parameters=f0Add%3A50.0%3B&effect_F0Add_default=Default&effect_F0Add_help=Help&effect_Rate_selected=&effect_Rate_parameters=durScale%3A1.5%3B&effect_Rate_default=Default&effect_Rate_help=Help&effect_Robot_selected=&effect_Robot_parameters=amount%3A100.0%3B&effect_Robot_default=Default&effect_Robot_help=Help&effect_Whisper_selected=&effect_Whisper_parameters=amount%3A100.0%3B&effect_Whisper_default=Default&effect_Whisper_help=Help&effect_Stadium_selected=&effect_Stadium_parameters=amount%3A100.0&effect_Stadium_default=Default&effect_Stadium_help=Help&effect_Chorus_selected=&effect_Chorus_parameters=delay1%3A466%3Bamp1%3A0.54%3Bdelay2%3A600%3Bamp2%3A-0.10%3Bdelay3%3A250%3Bamp3%3A0.30&effect_Chorus_default=Default&effect_Chorus_help=Help&effect_FIRFilter_selected=&effect_FIRFilter_parameters=type%3A3%3Bfc1%3A500.0%3Bfc2%3A2000.0&effect_FIRFilter_default=Default&effect_FIRFilter_help=Help&effect_JetPilot_selected=&effect_JetPilot_parameters=&effect_JetPilot_default=Default&effect_JetPilot_help=Help&HELP_TEXT=&exampleTexts=I'm%20Spike.&VOICE_SELECTIONS=dfki-spike%20en_GB%20male%20unitselection%20general&AUDIO_OUT=WAVE_FILE&LOCALE=en_GB&VOICE=dfki-spike&AUDIO=WAVE_FILE";

				//load the audio element with the mary TTs web interface url and the mary request & play the audio file
				var spokenOutput = document.getElementById('spokenOutput');
				spokenOutput.load();
				spokenOutput.setAttribute('src', url + maryString);
				spokenOutput.play();
			}
		},
		
		getAnnotation: function(grammarResults, callback) {
			var vie = this.options.vie;
			//if the result is a reference to existing entity
			if(VIE.Util.isUri(grammarResults[1])){
				var entities = vie.entities.get(grammarResults[1]);
				entities = [entities];
				callback(entities);
				$('#speechWidgetDialog').dialog('close');
			}
			else{
				var elem = $('<div>' + grammarResults[1] + '</div>')
				vie.analyze({
					element: elem
				}).using("stanbol").execute().done(function(entities) {
						var URIs = [];
						$(entities).each(function(){
							URIs.push(this.getSubjectUri())
						});
						vie.load({entity:URIs}).using("dbpedia")
						.execute()
						.success(function(entities) {
								callback(entities);
								$('#speechWidgetDialog').dialog('close');
								})
						.fail(function(error) {
							//on error
						});
				});
			}
		},		
		
		options: {
			vie: undefined,
			entityHandler: function(e,ui){},
			speechOutput: false,
			speechServer: "http://mary.dfki.de:59125/",
			options: {}
		}
	});
})(jQuery);