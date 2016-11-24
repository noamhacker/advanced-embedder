function initialize()
{
	//variables to be used in the embed code
	var getDataFlag = false; // false= preview, true = get code
	var url;
	var urlValid = true;
	var embedString = "";
	var youtubeID;
	var playlistID = "";
	var isPlaylist = false;
	var startTime = "";
	var endTime = "";
	var vidWidth = "";
	var vidHeight = "";
	var proportional = true;
	var autoplay = 0;
	var partOfPlaylist = false;
	var listType = "";
	var loopVar = "";
	var captions = 0;
	var languageID = "";
	var applyToInterface = false;
	var playerControls = "";
	var audioOnly = "";
	var showinfo = "";
	var keyboardControls = "";
	var annotations = "";
	var privacy = false;
	var suggested = "";
	var fullscreen = "";
	var logo = "";
}

// the getCurrentTabUrl function is borrowed from google's chrome extension tutorial
// https://developer.chrome.com/extensions/getstarted
// I can use it by my understanding of the license:
/*
Copyright (c) 2014 The Chromium Authors. All rights reserved.
Use of this source code is governed by a BSD-style license that can be
found in the LICENSE file.
*/
/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 **/
function getCurrentTabUrl(callback) 
{
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

}


function getYoutubeID(url)
{
	// using some regex code by user mantish on this stack overflow question
	// http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
	// this extracts the youtube video ID from multiple url formats:
	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match && match[2].length == 11) 
	{
	  youtubeID = match[2];

		// now check if playlist and get playlist ID
		// thank you coiso: 
		// http://stackoverflow.com/questions/16868181/how-to-retrieve-a-youtube-playlist-id-using-regex-and-js
		var reg = new RegExp("[&?]list=([a-z0-9_]+)","i");
	    var match = reg.exec(url);
	    if (match&&match[1].length>0){
	        playlistID = match[1];
	        isPlaylist = true;
	    }else{
	        isPlaylist = false;
			document.getElementById("partOfPlaylist").disabled = true;
	    }
	} 
	else 
	{
		document.body.innerHTML = "";
		var div = document.createElement("div");
		div.style.width = "426px";
		div.style.background = "yellow";
		div.style.padding = "10px 4px 10px";
		div.innerHTML = "Invalid URL. \nPlease open extension on a youtube video page.";

		document.body.appendChild(div);

	  	throw new Error("Execution terminated.");
	}   
}


function getDataPreview()
{
	getDataFlag = false;
	getData();
}
function getDataGetCode()
{
	getDataFlag = true;
	getData();
}

function proportionHandler()
{
	var text_box = document.getElementById('vHeight');
	var width_temp = document.getElementById('vWidth').value;
	var height_temp = Math.round(width_temp*9/16);
	//renderStatus("change");
	if(Proportional.checked)
	{
		text_box.setAttribute('readonly', 'readonly');
		document.getElementById("vHeight").value = height_temp;
	}
	else
	{
		text_box.removeAttribute('readonly');
	}
}
function proportionTheHeight()
{
	if(Proportional.checked)
	{
		var text_box = document.getElementById('vHeight');
		var width_temp = document.getElementById('vWidth').value;
		var height_temp = Math.round(width_temp*9/16);
		document.getElementById("vHeight").value = height_temp;
	}
	else
	{
	}
}


function getData()
{	
	startTime = 3600*Number(document.getElementById("startTimeH").value) +
				60*Number(document.getElementById("startTimeM").value) +
				Number(document.getElementById("startTimeS").value);
	endTime = 3600*Number(document.getElementById("endTimeH").value) +
				60*Number(document.getElementById("endTimeM").value) +
				Number(document.getElementById("endTimeS").value);
	vidWidth = document.getElementById("vWidth").value;
	vidHeight = document.getElementById("vHeight").value;

	var ee = document.getElementById("playerControls");
	playerControls = ee.options[ee.selectedIndex].value;
	if(playerControls == -1)
	{
		audioOnly = '<div style="position:relative;height:30px;overflow:hidden;">' +
	  				'<div style="position:absolute;top:-270px;left:-5px">';
	  	//vidWidth = 300;
	  	vidHeight = 300;
		playerControls = 0;
	}
	else
		audioOnly = "";

	if (document.getElementById('autoplay').checked == true)
		autoplay = 1;
	else
		autoplay = 0;

	if (document.getElementById('partOfPlaylist').checked == true)
	{
		partOfPlaylist = true;
		listType = "&listType=playlist&list=" + playlistID;
	}
	else
	{
		partOfPlaylist = false;
		listType = "";
	}
	
	if (document.getElementById('loop').checked == true && partOfPlaylist == false)
		loopVar = "1&playlist=" + youtubeID;
	else if (document.getElementById('loop').checked == true && partOfPlaylist == true)
		loopVar = "1";
	else
		loopVar = "";

	if (document.getElementById('captions').checked == true)
		captions = 1;
	else
		captions = 0;
	var e = document.getElementById("lang");
	languageID = e.options[e.selectedIndex].value;

	if (document.getElementById('titleAndActions').checked == false)
		showinfo = 0;
	else
		showinfo = 1;

	if (document.getElementById('keyboard').checked == true)
		keyboardControls = 0;
	else
		keyboardControls = 1;

	var eee = document.getElementById("annotations");
	annotations = eee.options[eee.selectedIndex].value;

	privacy = document.getElementById('privacy').checked;

	if (document.getElementById('related').checked == true)
		suggested = 1;
	else
		suggested = 0;

	if (document.getElementById('fullscreen').checked == true)
		fullscreen = 1;
	else
		fullscreen = 0;

	if (document.getElementById('youtubeLogo').checked == true)
		logo = 0;
	else
		logo = 1;

	//document.getElementById("display").innerHTML = startTime; //getDataFlag; //languageID;

	makeEmbedString();
	if (getDataFlag == false) //preview was clicked
	{
		document.getElementById('startTimeH').select(); //to get rid of the ugly border on the button
		document.getElementById("embedStringHere").innerHTML = embedString;
	}
	else //generate was clicked
	{
		//copy to clipboard... figure this out in another version
		document.getElementById('embedTextBox').value = embedString;
		document.getElementById('instr').removeAttribute('hidden');
		document.getElementById('embedTextBox').removeAttribute('hidden');
		document.getElementById('embedTextBox').select();
	}
}


function makeEmbedString()
{

	embedString = "";
	embedString +=
	  audioOnly + //for the no visuals option
	    '<iframe width="' + vidWidth + '" height="' + vidHeight + '" ' +
	      'src="https://www.youtube';
	      if (privacy == true)
	      	embedString += '-nocookie';
	      embedString += '.com/embed/' +
	      youtubeID +
	      '?' + listType;
	      if(suggested != 1) //default is 1
	      	embedString += '&rel=' + suggested;
	      if (startTime > 0)
	      	embedString += '&start=' + startTime;
	      if (endTime > 0)
		  	embedString += '&end=' + endTime;
		  if (autoplay != 0)
	      	embedString += '&autoplay=' + autoplay;
	      if (loopVar != 0)
	      	embedString += '&loop=' + loopVar;
	      if (playerControls != 2)
	      	embedString += '&autohide=' + playerControls;
	      if (captions != 0)
	      	embedString += '&cc_load_policy=' + captions;
	      if (languageID != "")
	      	embedString += '&hl=' + languageID;
	      if (showinfo != 1)
	      	embedString += '&showinfo=' + showinfo;
	      if (keyboardControls != 0)
	      	embedString += '&disablekb=' + keyboardControls;
	      if (annotations != 0)
	      	embedString += '&iv_load_policy=' + annotations;
	      if (logo == 1)
	      	embedString += '&modestbranding=' + logo;
	      embedString +=
	      '"' + 
	      ' frameborder="0"';
	      if (fullscreen == 1)
	      	embedString += ' allowfullscreen';
	      embedString +=
	      '>' +
	    '</iframe>';

}


function renderStatus(statusText) 
{
	document.getElementById('status').style.backgroundColor = '#E5E5E5';
  	document.getElementById('status').textContent = statusText;
}
function renderError(errorText) 
{
	document.getElementById('status').style.backgroundColor = 'yellow';
  	document.getElementById('status').textContent = errorText;
}
function renderHelp(helpText) 
{
	document.getElementById('status').style.backgroundColor = '#BFEFFF';
  	document.getElementById('status').textContent = helpText;
}

function loopHelp()
{
	var loopHelpText = 'Loop is not compatible with custom start times and \nend times.' +
						' Loops through entire playlist if applicable.';
	renderHelp(loopHelpText);
}
function ccHelp()
{
	var ccHelpText = 'Closed captions language depends on availability.' + 
					'\nTurning on closed captions sets them to be on by' + 
					'\ndefault, they can only be turned back off manually.';
	renderHelp(ccHelpText);
}
function privacyHelp()
{
	var privacyHelpText = '\"Enabling this option means that YouTube won\'t\n' +
						  'store information about visitors on your web page\n' +
						  'unless they play the video.\"';
	renderHelp(privacyHelpText);
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
  	
  	initialize();

  	getYoutubeID(url);
    renderStatus('Valid video open.\nEnter desired parameters \(leave blank for default\):');
	
    document.querySelector('#Proportional').addEventListener('change', proportionHandler);
    document.querySelector('#vWidth').addEventListener('change', proportionTheHeight);
	

	var generateButton = document.querySelectorAll('button'); //getDataPreview and getDataCode will decide which action to do with the embed string; show preview or show code
	generateButton[0].addEventListener('click', getDataPreview); // preview button
	generateButton[1].addEventListener('click', getDataGetCode); // get code button

	var helper = document.querySelectorAll('h');
	helper[0].addEventListener('click', loopHelp);
	helper[1].addEventListener('click', ccHelp);
	helper[2].addEventListener('click', privacyHelp);


  });

});



