function Guitar()
{
	this.guitarNotes = ["A","A#","B","B#","C","C#","D","D#","E","E#","F","F#","G","G#"];
	this.startFrom = ["E","B","G","D","A"];
	this.nextNote = [6, 0, 10, 4, 12];
	this.notes = Array(5).fill(0);
	this.pressedKeys = [];
}


// This function is used to store the keys pressed by user while recording
Guitar.prototype.startRecording = function()
{
	$("#guitar").bind("click",{self:this},this.pushKeys); // Binding an event handler to store the keys pressed in a list while recording
};


//Function to push the keys pressed into a list while recording
Guitar.prototype.pushKeys = function(event)
{
	var pressedKey = event.target.id;
	(event.data.self.pressedKeys).push(pressedKey);	
}


// This function is used to stop the ongoing recording
Guitar.prototype.stopRecording = function()
{
	$("#guitar").unbind("click",this.pushKeys);				// Removing event handler which pushes the keys while recording
};


// This recursive function is used to play the stored recording
Guitar.prototype.playRecording = function(j)
{
	var recordedNotes = this.pressedKeys;
	j = j || 0;
	var iterationHandler = setInterval(iterateRecordings,600);

	function iterateRecordings()
	{
		Guitar.playNote(mapKeyToAudio(recordedNotes[j++])); 		// mapping key to audio and passing to Guitar function for playing	
		if(j == recordedNotes.length) 				// If end of the stored notes is reached, stop iterating
		{
			clearInterval(iterationHandler);
		}
	}
};


Guitar.playNote = function(soundfile)
{
	var sound = new Audio(soundfile);   // making audio object
	sound.play(); 					// playing the note
};


// To map the key pressed to audio file and then to play
Guitar.mapAndPlayNote = function(e)
{
	var key = e.target.id;
	key = mapKeyToAudio(key);
	Guitar.playNote(key);
}



//This function is used to add the frets at the end of each string
Guitar.prototype.addFretsToString = function()
{
	var self = this;
	self.notes.forEach(addSuccessiveNotes);

	function addSuccessiveNotes(e,i)
	{
		var currNote = self.guitarNotes[(self.nextNote[i])];  // Computing the next fret for current string
		var col = $('<td></td>');
		col.text(currNote);
		col.attr({ id: currNote });						
		col.addClass('ripple-effect');					// creating a DOM element and adding essential attributes
		self.nextNote[i] +=1;
		self.nextNote[i] %=14;							// Updating next fret pointer to point to next key
	     $("#guitar tr:eq("+i+")").append(col);				// Attaching new fret to the current row (string) 
	}
};




// To update the key currently being pressed in a paragraph
function updateInfo(e)
{
	$("#info").html("You clicked "+e.target.id);
}



// Mapper function which maps the key pressed to corresponding audio file
function mapKeyToAudio(key)
{
	if(key == undefined)
	{
		alert("Please play notes after recording");
		location.reload();
	}
	else if(key.length == 2)
	{
		key = 'notes\\'+key[0]+'sharp.ogg';
	}
	else
	{
		key = 'notes\\'+key+'.ogg';
	}
	return key;
}


var guitarObj = new Guitar();


$(document).ready(function() {

	$('td').addClass('ripple-effect');

	$("#playRecord").hide();
	$("#stopRecord").hide();


	$("#record").click(function(){
		guitarObj.pressedKeys = [];
    		guitarObj.startRecording();

    		$("#record").hide();
    		$("#playRecord").hide();
		$("#stopRecord").show();	
	});


	$("#stopRecord").click(function(){
    		guitarObj.stopRecording();

    		$("#stopRecord").hide();
		$("#playRecord").show();
	});


	$("#playRecord").click(function(){
    		guitarObj.playRecording();

    		$("#record").show();
	});


	$("#addFret").click(function(){
   		guitarObj.addFretsToString(); 		
	});

	$("#guitar").bind("click",updateInfo);
	$("#guitar").bind("click",Guitar.mapAndPlayNote);
});	