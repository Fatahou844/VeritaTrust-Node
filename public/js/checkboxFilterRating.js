
function getUrlQueries(){
	return window.location.search.split("&")
}

function getRatingsFromUrlQueries(urlQueries){ // input => ['quer',...,'rating=5,2']
	// output => ['rating=5,2']
	const ratingQuery = urlQueries.filter(q => q.startsWith('rating'));
	
	const ratings = (ratingQuery?.[0] // output => 'rating=5,2' 
		.split("=")             // output => ['rating','5,2']
		?.[1]?.split(","));         // output => ['5','2']
	return ratings;
}


function getIdsFromUrlQueries(ratings){ // input=> ['5','2','m']
	const ratingsIds = {
		5:"excellent",
		4:"Bien",
		3:"moyen",
		2:"bas",
		1:"mauvais"
	};
	const ids = ratings
		?.map(rating=> ratingsIds?.[rating]) // output => ['excellent','bas', undefined]
		.filter(i=> i);                     // output => ['excellent','bas',]
	return ids;
}

function checkSelectedRatingsById(ratingsIds) // input => ['excellent','bas',]
{
	ratingsIds?.forEach(id=>{
			document.getElementById(id).checked = true;
		}
	);
}

function checkRatings(){
	const urlQueries =	getUrlQueries();
	const ratings = getRatingsFromUrlQueries(urlQueries);
	const ids = getIdsFromUrlQueries(ratings);
	checkSelectedRatingsById(ids);
}

const checkbox_mauvais = document.getElementById('mauvais');
const checkbox_bas = document.getElementById('bas');
const checkbox_moyen = document.getElementById('moyen');
const checkbox_bien = document.getElementById('bien');
const checkbox_excellent = document.getElementById('excellent');

/*

checkbox_mauvais.addEventListener('onclick', (event) => {

  if(event.currentTarget.checked) {
    //I am checked
    console.log("i m checked")
    ((window.location.href.search("&rating=")) >= 0? window.location.assign(window.location.href+",1") : window.location.assign(window.location.href+"&rating=1"));
    } 
    
    else 
     ((window.location.href.search("&rating=")) >= 0? window.location.assign(window.location.href.replace(',1', '')) : window.location.assign(window.location.href.replace('&rating=1', '')));
    

})


checkbox_bas.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    checkRatings();
  } else {
    
  }
})

checkbox_moyen.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    checkRatings();
  } else {
    
  }
}) 

checkbox_bien.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    checkRatings();
  } else {
    
  }
})


checkbox_excellent.addEventListener('onclick', (event) => {
  if (event.currentTarget.checked) {
    window.location.replace ((window.location.href.search("&rating=")) >= 0? window.location.assign(window.location.href+",1") : window.location.assign(window.location.href+"&rating=1"));
  } else {
      
      window.location.replace ((window.location.href.search("&rating=")) >= 0? window.location.assign(window.location.href-",1") : window.location.assign(window.location.href-"&rating=1"));
  }
})


*/
function update_vbadchbox(){
    if(document.getElementById('mauvais').checked == true)
    {
    	(window.location.href.search("&rating=")) >= 0? window.location.assign(window.location.href+",1") : window.location.assign(window.location.href+"&rating=1")
    }
    else
    {
        (window.location.href.search("&rating=1")) >= 0? window.location.assign(window.location.href.replace('1,', '')) : window.location.assign(window.location.href.replace(',1', ''));
    }
}

function update_badchbox(){
    if(document.getElementById('bas').checked == true)
    {
    	(window.location.href.search("&rating=")) >= 0? window.location.assign(window.location.href+",2") : window.location.assign(window.location.href+"&rating=2")
    }
    else
    {
        (window.location.href.search("&rating=2")) >= 0? window.location.assign(window.location.href.replace('2,', '')) : window.location.assign(window.location.href.replace(',2', ''));
    }
}

function update_averagechbox(){
    if(document.getElementById('moyen').checked == true)
    {
    	(window.location.href.search("&rating=")) >= 0? window.location.assign(window.location.href+",3") : window.location.assign(window.location.href+"&rating=3")
    }
    else
    {
        (window.location.href.search("&rating=3")) >= 0? window.location.assign(window.location.href.replace('3,', '')) : window.location.assign(window.location.href.replace(',3', ''));
    }
}

function update_goodchbox(){
    if(document.getElementById('Bien').checked == true)
    {
    	(window.location.href.search("&rating=")) >= 0? window.location.assign(window.location.href+",4") : window.location.assign(window.location.href+"&rating=4")
    }
    else
    {
        (window.location.href.search("&rating=4")) >= 0? window.location.assign(window.location.href.replace('4,', '')) : window.location.assign(window.location.href.replace(',4', ''));
    }
}

function update_excellentchbox(){
    if(document.getElementById('excellent').checked == true)
    {
    	(window.location.href.search("&rating=")) >= 0? window.location.assign(window.location.href+",5") : window.location.assign(window.location.href+"&rating=5")
    }
    else
    {
        (window.location.href.search("&rating=5")) >= 0? window.location.assign(window.location.href.replace('5,', '')) : window.location.assign(window.location.href.replace(',5', ''));
    }
}

window.addEventListener('load', (event) => {
    
    checkRatings();
  
});
