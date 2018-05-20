key = AIzaSyBdSMIDmiIAtSMx6DurLOH7tPqpHTIdK_E
AIzaSyCkztJBGXVEEZPAtlOkFhUT1CrKSi1WJg4

// window.onload = function () { const iframe = document.querySelector('iframe'); iframe.title = "Google Maps"; }

window.addEventListener("offline",()=>{ 
    alert("You are offline now, your reviews will be synced when the connection is re-established") 
}); 
window.addEventListener("online",()=>{ 
    DBHelper.getDB((db)=>{ 
        var objectStore = db.transaction("reviews","readwrite").objectStore("reviews"); 
        var reviews = [];

        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                reviews.push(cursor.value);
                cursor.continue();
            }
            else {
                console.log("Read all reviews from database");
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function(){
                    console.log("review synced")
                    objectStore = db.transaction("reviews","readwrite").objectStore("reviews")
                    reviews.forEach(rev=>{
                        objectStore.delete(rev.restaurant_id)
                    })
                };

                xhr.open("POST","http://localhost:1337/reviews",true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                reviews.forEach((review)=>{
                    xhr.send(`restaurant_id=${encodeURIComponent(review.restaurant_id)}&name=${encodeURIComponent(review.name)}&rating=${encodeURIComponent(review.rating)}&comments=${encodeURIComponent(review.comments)}`);
                })          
            }
        }
    }) 
})