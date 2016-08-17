
var fs=require('fs');
var natural=require('natural');
	tokenizer = new natural.WordTokenizer();
var obj;
var N;
var result={};
var weight;
var stopwords=['a', 'an', 'the','so','on', 'of', 'and', 'is', 'was', 'are', 'were', 'in', 'into', "isn't", "wasn't", 'that'];
function stem(wordList){
	array=[];
	for(var i=0;i<wordList.length;i++){
		array.push(natural.PorterStemmer.stem(wordList[i]));
	}
	return array;
}
function removeStopwords(message){
	//console.log(message); 
	var returnArray=[];
	for(var i=0;i<message.length;i++){
		if(stopwords.indexOf(message[i]) == -1){
			returnArray.push(message[i]);
		}
	}
	return returnArray;
}

function trainModel(alice, bot){
	
	// everything to lower case
	var aliceMessage = alice.toLowerCase();
	aliceMessage = tokenizer.tokenize(aliceMessage);
	
	//Remove stop words such as 'a', 'an' , 'the'
	removedStopwords = removeStopwords(aliceMessage);
	//console.log(aliceMessage);
	
	//stem the words
	//console.log(natural.PorterStemmer.stem(aliceMessage));
	stemmedMessage = stem(removedStopwords);
	//console.log(stemmedMessage);
	
	//N = Number of tokens
	N = stemmedMessage.length;
	weight = 1.0 / N;
	//result['my'] = [];
	
	for (var i=0;i<stemmedMessage.length;i++){
		
		//console.log(stemmedMessage[i]);
		
		if ( result.hasOwnProperty(stemmedMessage[i])){
				result[stemmedMessage[i]].push({'response':bot,'weight':weight});
		}
		else {
			result[stemmedMessage[i]] = [];
			result[stemmedMessage[i]].push({'response':bot,'weight':weight});
		}
		
		//console.log(result[stemmedMessage[i]][0].response);
	}	
	
}

var process = function(word){ 

fs.readFile('input.json', 'utf8', function (err, data) {
  if (err) {
	return console.error(err);
	}
	obj = JSON.parse(data);
	for(var i=0;i<Object.keys(obj.messages).length;i++){
		console.log(i);
		//trainModel(obj.messages[i].Alice,obj.messages[i].Bot);
	}
	console.log(word);
	
	
});
}
module.exports=process;