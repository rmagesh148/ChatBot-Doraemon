
var fs=require('fs');
var natural=require('natural');
	tokenizer = new natural.WordTokenizer();
var obj;
var N;

var cfd={};
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
	
	//tokenized using tokenzier
	aliceMessage = tokenizer.tokenize(aliceMessage);
	
	//removed stopwords=['a', 'an', 'the','so','on', 'of', 'and', 'is', 'was', 'are', 'were', 'in', 'into', "isn't", "wasn't", 'that']; 
	removedStopwords = removeStopwords(aliceMessage);
	
	//stemmed message using Porter Stemmer Algorithm 
	stemmedMessage = stem(removedStopwords);
	
	N = stemmedMessage.length;
	
	weight = 1.0 / N;
	
	for (var i=0;i<stemmedMessage.length;i++){
		
		if ( result.hasOwnProperty(stemmedMessage[i])){
				result[stemmedMessage[i]].push({'response':bot,'weight':weight,});
		}
		else {
			result[stemmedMessage[i]] = [];
			result[stemmedMessage[i]].push({'response':bot,'weight':weight});
		}
	}	
}
function returnTheResponse(responseObj){
	resultArray={};
	var temp=0;
	for(var i=0;i<responseObj.length;i++){
		var response = responseObj[i].response;
		var counter = (resultArray[response] || 0) + responseObj[i].newFdValue;
		resultArray[response] = counter;
	}
	var ranked = []

  for(var key in resultArray) {
    if(resultArray.hasOwnProperty(key)) {
	
      ranked.push({response:key, cfd:resultArray[key]}); 
    }
  }
    return ranked.sort(function(a, b) { return b.cfd - a.cfd; });
}

var process = function(word, callback){ 
/*
*	Function takes in the message from the user and trains the model.
*	@param - word - message from the user
*	@param function - callback - returns the best response based on the model
*/

var count=0;
fs.readFile('input.json', 'utf8', function (err, data) {
  if (err) {
	return console.error(err);
	}
	obj = JSON.parse(data);
	for(var i=0;i<Object.keys(obj.messages).length;i++){
		trainModel(obj.messages[i].Alice,obj.messages[i].Bot);
	}
	
	word = word.toLowerCase();
	wordlist = tokenizer.tokenize(word);
	stopWords = removeStopwords(wordlist);
	stemWords = stem(stopWords);
	var newFd={
				message:[]
			};
	
	for(var i=0;i<stemWords.length;i++){
		if (result.hasOwnProperty(stemWords[i])){
			if (cfd.hasOwnProperty(stemWords[i])){
				cfd[stemWords[i]].value = cfd[stemWords[i]].value + result[stemWords[i]].weight;
			}
			else{
				cfd[stemWords[i]] = [];
				var value=0;
				for(var j=0;j<result[stemWords[i]].length;j++){
					value = value + result[stemWords[i]][j].weight;
				}
				cfd[stemWords[i]].push({'value':value});
			}
			
			for(var j=0;j<result[stemWords[i]].length;j++){
				var newFdValue = 0;
				newFdValue = (result[stemWords[i]][j].weight) / (cfd[stemWords[i]][0].value); 
				newFd.message.push({'response':result[stemWords[i]][j].response,'newFdValue':newFdValue});
			}
		}
		else{
			count = count + 1;
		}
	}
	//console.log(count);
	if (count != stemWords.length){
			sorted = returnTheResponse(newFd.message);
			bestResponse = sorted[0].response;
	}
	else{
		bestResponse = 'This is boring. Can we talk something else? :P ';
	}
	
	callback(bestResponse);
});
}
module.exports=process;