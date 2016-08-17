
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
				result[stemmedMessage[i]].push({'response':bot,'weight':weight,});
		}
		else {
			result[stemmedMessage[i]] = [];
			result[stemmedMessage[i]].push({'response':bot,'weight':weight});
		}
		
		//console.log(result[stemmedMessage[i]][0].response);
	}	
	
}

//var process = function(word){ 
var count=0;
fs.readFile('input.json', 'utf8', function (err, data) {
  if (err) {
	return console.error(err);
	}
	obj = JSON.parse(data);
	for(var i=0;i<Object.keys(obj.messages).length;i++){
		//console.log(i);
		trainModel(obj.messages[i].Alice,obj.messages[i].Bot);
	}
	
	var words = "name is true";
	wordlist = tokenizer.tokenize(words);
	//console.log(word);
	stopWords = removeStopwords(wordlist);
	stemWords = stem(stopWords);
	
	for(var i=0;i<stemWords.length;i++){
		//console.log(stemWords[i]);
		if (result.hasOwnProperty(stemWords[i])){
			if (cfd.hasOwnProperty(stemWords[i])){
				console.log("cfd has the value");
			}
			else{
				cfd[stemWords[i]] = [];
				//cfd[stemWords[i]].push({'value':0});
				//console.log(cfd);
				var value=0;
				console.log(result[stemWords[i]].length);
				for(var j=0;j<result[stemWords[i]].length;j++){
					value = value + result[stemWords[i]][j].weight;
				}
				console.log(value);
			}
		}
	}
	
	
	
	
	
});
//}
//module.exports=process;