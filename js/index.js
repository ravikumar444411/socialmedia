

var firebaseConfig = {
    apiKey: "AIzaSyAggorTGKR5Gd-vSCjePqyfFqPWs6YGD_s",
    authDomain: "storywory-f3401.firebaseapp.com",
    databaseURL: "https://storywory-f3401.firebaseio.com",
    projectId: "storywory-f3401",
    storageBucket: "storywory-f3401.appspot.com",
    messagingSenderId: "603600214124",
    appId: "1:603600214124:web:7092ecc209e9c5754b2049",
    measurementId: "G-ZRYMMR8XJV"
  };
firebase.initializeApp(firebaseConfig);


firebase.auth.Auth.Persistence.LOCAL;

$("#btn-login").click(function(event)
{
    var email =  $("#email").val();
    var password = $("#password").val();
console.log(email,password);

    if(email != "" && password != "")
    {
      //  var result = firebase.auth.signInWithEmailAndPassword(email, password);
        var result = firebase.auth().signInWithEmailAndPassword(email, password);
        console.log(result);
        
        result.catch(checkError);
    
    }
    else
    {
        window.alert("Form is incomplete. Please fill out all fields");
    }
    event.preventDefault();
});

$("#btn-signup").click(function(event)
{
    var email =  $("#email").val();
    var password = $("#password").val();
    var cPassword = $("#confirmPassword").val();
 
console.log(email);
console.log(password);
console.log(cPassword);

if(email != "" && password != "" && cPassword != "")
{
        if( password == cPassword)
    {
      //  var result = firebase.auth.signInWithEmailAndPassword(email, password);
        var result = firebase.auth().createUserWithEmailAndPassword(email, password);
        console.log(result);
        
        result.catch(checkError);
    
    }
    else
    {
        window.alert("Password do not match");
    }
   
  }
else
    {
        window.alert("Form is incomplete. Please fill out all fields");
    }
    event.preventDefault();
});


/*******Create a Story start****** */

var valiImagetypes = ["image/gif","image/jpeg","image/png","video/mp4"];
$("#selected-image").hide();

function previewImage(image_blog)
{
console.log(image_blog.files);
if(image_blog.files && image_blog.files[0])
{
var reader = new FileReader();
reader.onload = function(e)
{
$("#selected-image").attr('src',e.target.result);
$("#selected-image").fadeIn();
}
reader.readAsDataURL(image_blog.files[0]);
$("#selected-image").show();
}
}

// function to call image(input)
$("#main-image").change(function()
{
previewImage(this);
});

// 'save-blog' is a button
$("#save-blog").click(function()
{
$("#main-desc").removeClass("is-invalid");
$("#main-image").removeClass("is-invalid");

var desc = $("#main-desc").val();
var picture = $("#main-image").prop("files")[0];
console.log(picture);

if(!desc){
$("#main-desc").addClass("is-invalid");
return;
}
if(picture == null)
{
$("#main-image").addClass("is-invalid");
return;
}

// inArray() It is a jQuery function that returns the index 
// position of the value when it finds the
//  value otherwise -1
// console.log($.inArray());


if($.inArray(picture["type"], valiImagetypes)<0)
{
$("#main-image").addClass("is-invalid");
return;
}



// *******Upload & save to firebase database & storage

var databaseRef = firebase.database().ref().child("Blogs");
databaseRef.once("value").then(function(snapshot)
{
var name = picture["name"];
var dateStr = new Date().getTime();
var fileCompleteName = name + "_"+dateStr;
var storageRef = firebase.storage().ref().child("Blog Images");
var blogStorageRef = storageRef.child(fileCompleteName);

var uploadTask = blogStorageRef.put(picture);

uploadTask.on("state_changed",
function progress(snapshot)
{
var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
$("#upload-progress").html(Math.round(percentage) + "%");
$("#upload-progress").attr("style","width:"+percentage +"%");


},
function error(err)
{

},
function complete()
{
var user = firebase.auth().currentUser;
var userName;
firebase.database().ref('Users/' + user.uid).once('value').then(function(snapshot)
{
var fName = (snapshot.val() && snapshot.val().firstName);
var sName = (snapshot.val() && snapshot.val().SecondName);

userName = fName + " " + sName;


});
uploadTask.snapshot.ref.getDownloadURL().then(function(downloadUrl)
{
var time = new Date();

var options = 
{
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: "numeric"
};
var blogData = 
{
    "image": downloadUrl,
    "name": fileCompleteName,
    "type": picture["type"],
    "desc": desc,
    "uid": user.uid,
    "counter": 5000 - counter,
    "userName": userName,
    "time": time.toLocaleString('en-US',{hour: 'numeric',minute:'numeric', hour12: true}),
    "date": time.toLocaleDateString('en-US',options),
};
var newPostRef = databaseRef.push();
newPostRef.set(blogData,function(err)
{
    if(err)
    {
        $("#result").attr("class","alert alert-danger");
        $("#result").html(err.message);
    }
    else
    {
        $("#result").attr("class","alert alert-success");
        $("#result").attr("blog has been uploaded successfullly");

        window.open("","_self");
    }

    resetForm
});
});
}
);
});

// *******Upload & save to firebase database & storage
});

function resetForm()
{
$("#main-form")[0].reset();
$("#selected-image").fadeOut();
$("upload-progress").html("completed");
}


/*******Create a Story End****** */





$("#btn-update").click(function(event)
{
    var phone =  $("#phone").val();
    var address =  $("#address").val();
    var bio =  $("#bio").val();
    var firstName =  $("#firstName").val();
    var secondName =  $("#secondName").val();
    var country = $("#country").val();
    var gender = $("#gender").val();
   

    var rootRef = firebase.database().ref().child("Users");

    var userID = firebase.auth().currentUser.uid;
    var usersRef = rootRef.child(userID);

 



if(firstName != "" && secondName != "" && phone != "" && country != "" && bio != ""  && address != "" && gender != "")
{
       var userData =
       {
           "phone":phone,
           "address":address,
           "bio":bio,
           "firstName":firstName,
           "secondName":secondName,
           "country":country,
           "gender":gender,
       };

       console.log(userData);
        
       usersRef.set(userData,function(error)
       {
        if(error)
        {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(errorCode);
            console.log(errorMessage);

            window.alert("message: "+ errorMessage);  
        }
        else
        {
            window.alert("Update Successfully");
            window.location.href = "MainPage.html";
        }
       });
    
    
  
   
  }
else
    {
        window.alert("Form is incomplete. Please fill out all fields");
    }
    event.preventDefault();
});

$("#btn-resetPassword").click(function()
{
   var auth = firebase.auth();
   var email = $("#email").val();

   if(email !="")
   {
       auth.sendPasswordResetEmail(email).then(function()
       {
        window.alert("Email Send Sussefully, Go and Verify");
       })
       .catch(checkError);
   }
   else
   {
       window.alert("Please write your Email");
   }
});


/****Delete Post Start*** */
function deleteblogRecord(key)
{
    
    var deleteRef = firebase.database().ref().child("Blogs").child(key);

    return deleteRef.remove()
    .then(function(){
        window.alert("Removed Successfully");
    })
    .catch(function()
    {
        window.alert("Error Occured");

    })
}

/****Delete Post End *** */

$("#btn-logout").click(function()
{
    firebase.auth().signOut();
});

$("#test-btn").click(function(event)
{
 
    event.preventDefault();
    // var commetObj = firebase.database().ref().child("comment_section").child("-M9vs7H2ts1cHhVT09Oh");   //retrieve data from database with specific user ID
       
    //     commetObj.on("value",function(blogs)
    //     {
    //                 blogs.forEach(function(singleBlog)
    //             {
    //                         var userID = singleBlog.val().userid;
    //                         firebase.database().ref().child("Users").orderByKey().equalTo(userID).on("value",function(dbojb)
    //                         {
    //                             var ojbt = dbojb.val()
    //                             //  image += `${ ojbt[userID].image}`
    //                             console.log(userID)
    //                            console.log(ojbt[userID].image);
    //                        //    console.log(singleBlog.val().comment)

    //                         }) 
    //             })
    //     });


    $("#comment_box").html("<b>Hello world!</b>");
    console.log($("#comment_box").val())

     
});

function switchView(view)
{
   
    $.get({
        url : view,
        cache : false,
    })
    .then(function(data){
        $("#container").html(data);
       
    });
}



  const checkError =  (error) =>  {
    var errorCode = error.code;
    var errorMessage = error.message;

    console.log(errorCode);
    console.log(errorMessage);

    window.alert("message: "+ errorMessage);
}



$("#btn-comment").click(function(event)
{
    event.preventDefault();
    var comment =  $("#comment").val();
    console.log('comment');

});

/****go to profile start *** */
function goToProfile(userID){

    if(userID == '')
    window.location = 'main.html';
    else
    window.location = 'Profile_page.html?somval=' + userID;
    
}
/****go to profile End *** */

/****go to profile start *** */
function goToFollow(userID){

window.location = 'Follower.html?somval=' + userID;

}
/****go to profile End *** */

/****comment on post start *** */

function postComment(key)
{
    event.preventDefault();
    var comment =  $("#comment").val();
    var new_comment_key = firebase.database().ref().child('comment_section').push().key;
    var userid = firebase.auth().currentUser.uid;

    var updates = {};
  // updates['/comment_section/'+ new_comment_key] =  new_comment_key;
   updates['/comment_section/'+ key +'/' + new_comment_key + '/comment/' ] = comment;
   updates['/comment_section/'+ key + '/' + new_comment_key + '/userid/' ] = userid;
   firebase.database().ref().update(updates);
}

/****comment on post End *** */

function likeHandle(Blogkey)
{
    event.preventDefault();
    console.log(Blogkey)
    //      var userid = firebase.auth().currentUser.uid;
    // console.log(userid)
    // var likeObj = firebase.database().ref().child("like_section").child(Blogkey);    //retrieve data from database with specific user ID
    
    // likeObj.once("value",function(likes)
    //  {
    //  //   console.log(likes.key);
    //  var targetID ='';
    //     likes.forEach(function(like) {
    //         if(like.key == userid)
    //         {
    //             likeObj.child(userid).remove();
              
    //             targetID = like.key
    //         }
    //     })
    //     if(targetID != userid)
    //       {
    //         var updates = {};
    //        updates['/like_section/'+ Blogkey + '/' + userid] = 'red';
    //         firebase.database().ref().update(updates);
         
    //       }  

    //     console.log(targetID,userid)
     
    // });
}












/* ************** retrieve Comment start*********  */

function fetchComment(){
  
    var commetObj = firebase.database().ref().child("comment_section").child("-M9vs7H2ts1cHhVT09Oh");   //retrieve data from database with specific user ID
       
    commetObj.on("value",function(blogs)
    {
                blogs.forEach(function(singleBlog)
            {
                        var userID = singleBlog.val().userid;
                        firebase.database().ref().child("Users").orderByKey().equalTo(userID).on("value",function(dbojb)
                        {
                            var ojbt = dbojb.val()
                        
                           $( "#comment_box" ).append( `<div class="media">
                                
                                <img id="photo1" src=${ojbt[userID].image} class="mr-3" width="70px" style="width:50px; height:50px; border-radius: 50% " >
                                <div class="media-body">
                                <h5 class="mt-0">${ojbt[userID].firstName + ' '+ ojbt[userID].secondName}</h5>
                            
                            <p id="comment">${singleBlog.val().comment}</p>
                            
                            
                                </div>
                            </div>` );
                        }) 
            })
    });

$("#photo1").width("70px").height("70px").css({"border-radius": "50%"});
$("#photo2").width("70px").height("70px").css({"border-radius": "50%"});

 

}

/* ************** retrieve Comment End*********  */




function handleComment(post_val)
{
    event.preventDefault();
   // console.log(Blogkey)
    var Blogkey = post_val.split(",")[0]
    var post_id = post_val.split(",")[1]
    console.log(Blogkey)
    console.log(post_id)
   

    var commetObj = firebase.database().ref().child("comment_section").child(Blogkey);   //retrieve data from database with specific user ID
       
    commetObj.on("value",function(blogs)
    {
                blogs.forEach(function(singleBlog)
            {
                        var userID = singleBlog.val().userid;
                        firebase.database().ref().child("Users").orderByKey().equalTo(userID).on("value",function(dbojb)
                        {
                            var ojbt = dbojb.val()
                            //  image += `${ ojbt[userID].image}`
                            console.log(singleBlog.val().comment)
                           console.log(ojbt[userID].image);


                           $('.post_id'+post_id).append( `<div class="media">
                                <img id="photo1" src=${ojbt[userID].image} class="mr-3" width="70px" style="width:50px; height:50px; border-radius: 50% " >
                                <div class="media-body">
                                <h5 class="mt-0">${ojbt[userID].firstName + ' '+ ojbt[userID].secondName}</h5>
                            <p id="comment">${singleBlog.val().comment}</p> </div>
                             </div>` );
               

                        }) 
    })
    });

$("#photo1").width("70px").height("70px").css({"border-radius": "50%"});
$("#photo2").width("70px").height("70px").css({"border-radius": "50%"});

  
}


function shareHandle(varia){
    $.get({
        url : 'shareButton.html',
        cache : false,
    })
    .then(function(data){
        $("#shareB").html(data);
       
    });

}

/**********Left side Story section start***************/ 
    function showAllStory(){
        var counter = 1 ;
        var class_id = 'post_id';

      firebase.database().ref('Blogs/').on('value', function(snapshot) {
        var blogsHtml ='';
      
            snapshot.forEach(function(singleBlog)
            {
                
            blogsHtml += `<div class="card mb-3 ">
                <div class="card-header" id="headerArea">
                    
                    <div class="row">
                  <div class="col-sm-1 "> <img  src=${singleBlog.val().profileImg} style="width:40px; height:40px; border-radius: 50% "/></div>
                <div class="col-sm h4 ml-2 text-parimary" ` + " onclick=goToProfile('"+singleBlog.val().uid+"')> "
      +`         ${singleBlog.val().postBy}  </div> <div class="col-sm-1"> 
                    
                    <i class="fas fa-chevron-down"  id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" href="#">Share</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">Share to </a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item "  ` + " onclick=deleteblogRecord('"+singleBlog.key+"')>Remove</a>"
             +`       </div> 
                    </div>
                    </div>
                    </div>
                
                
                ${frame(singleBlog.val().type, singleBlog.val().image)}

                            <div class="row">
                                <div class="col-sm">
                                    <a href=${singleBlog.val().image} download><i class="fas fa-download text-primary h3 mt-1"></i></a>
                                 </div>
                                <div class="col-sm">
                                Date: ${singleBlog.val().date} , time:  ${singleBlog.val().time}
                                </div>
                                <div class="col-sm">
                                One of three columns
                                </div>
                            </div>
                            <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <p class="card-text"> ${singleBlog.val().desc}</p>
                            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                            </div>

                          


                            <div class="row">
                           
       <i class="fas fa-heart h2 col-1 LikeID${counter}  ${checkLike([singleBlog.key,counter])}  "  id="likebutton"  `  + " onclick=likeHandle('"+singleBlog.key+"')></i>"

        +`   
                    <i class="fas fa-comment-alt h2 text-primary col-1  "   `  + " onclick=handleComment('"+ [singleBlog.key,counter]+"')></i>"
        +`  <i class="far fa-share-square h2 text-success col-1"   `  + " onclick=shareHandle('"+ [singleBlog.key,counter]+"')></i>"


        +`    <div id="shareB"></div>
        </div>
         <div class="form-group  row">
    
                    <input type="text" class="form-control col-lg-9 col-sm-8 col-8  ml-3 mr-1" id="comment" placeholder="Comment here .....">
                
                    <button type="submit" class='btn btn-primary col-lg-2 col-sm-2 col-2 mr-3 ' `  + " onclick=postComment('"+singleBlog.key+"')> <i class='fas fa-search'></i></button></div> </div>"
               +` <div id="comment_box" class="${class_id+counter}"> </div>`   
          
               counter = counter +1 ;
            });
            $("#container").html(blogsHtml);
 
});


// $('#shareBlock').cShare({
//     description: 'jQuery plugin - C Share buttons',
//     showButtons: [
//       'fb',
//       'gPlus',
//       'line',
//       'twitter'
//     ]
//   });
  



 function checkLike(post_val){   
     
  //   console.log(post_val)
  
    // console.log(Blogkey)
    // console.log(post_id)

//     var result = 'before';
//     console.log(post_key)
    var userid = firebase.auth().currentUser.uid;
    var likeObj = firebase.database().ref().child("like_section").child(post_val[0]);    //retrieve data from database with specific user ID
    
 likeObj.once("value").then(function(likes)
     {
     //    console.log(likes.key,likes.val())
   
        likes.forEach(function(like) {
         //   console.log(like.key,like.val())
            if(like.key == userid)
                 $('.LikeID'+post_val[1]).addClass('text-danger');

           // 
        })
       
        
        
    })

}



console.log(checkLike('-M8idwxrODRpBqZ3GH3t').catch(val => Promise.resolve(val)))
console.log(Promise.resolve(checkLike('-M8idwxrODRpBqZ3GH3t')))
       
//         //return 'text-danger';
//         console.log(result)
//         $( "#likebutton" ).addClass('text-danger')
       
//     }


  
function frame(type, url)
{
if(type == 'image/jpeg')
   return  ` <img src=${url} class="card-img-top" alt="..."/>`;
else if(type == 'video/mp4')
  return   `<video class="card-img-top"  controls ><source src=${url}  type="video/mp4"></video> `
}
/**********Left side Story section end***************/ 

}
    

/* ************** retrieve Comment End*********  */


function showMyBlogs(){

    /**********Left side Story section start***************/ 
    var user = firebase.auth().currentUser;
    firebase.database().ref('Blogs/').orderByChild("uid").equalTo(user.uid).on('value', function(snapshot) {
      var blogsHtml ='';
          snapshot.forEach(function(singleBlog)
          {
           //   console.log(singleBlog.val())
          blogsHtml += `<div class="card mb-3 ">
              <div class="card-header" id="headerArea">
                  
                  <div class="row">
                <div class="col-sm-1 "> <img  src=${singleBlog.val().profileImg} style="width:40px; height:40px; border-radius: 50% "/></div>
              <div class="col-sm h4 ml-2 text-parimary" ` + " onclick=goToProfile('"+singleBlog.val().uid+"')> "
    +`         ${singleBlog.val().postBy}  </div> <div class="col-sm-1"> 
                  
                  <i class="fas fa-chevron-down"  id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <a class="dropdown-item" href="#">Share</a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="#">Share to </a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item"  ` + " onclick=deleteblogRecord('"+singleBlog.key+"')>Remove</a>"
           +`       </div> 
                  </div>
                  </div>
                  </div>
              
              
              ${frame(singleBlog.val().type, singleBlog.val().image)}

                          <div class="row">
                              <div class="col-sm">
                                  <a href=${singleBlog.val().image} download><i class="fas fa-download text-primary h3 mt-1"></i></a>
                               </div>
                              <div class="col-sm">
                              Date: ${singleBlog.val().date} , time:  ${singleBlog.val().time}
                              </div>
                              <div class="col-sm">
                              One of three columns
                              </div>
                          </div>
                          <div class="card-body">
                          <h5 class="card-title">Card title</h5>
                          <p class="card-text"> ${singleBlog.val().desc}</p>
                          <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                          </div>
                          <div class="row">
                         
     <i class="fas fa-heart h2 col-1  ${checkLike(singleBlog.key)} "  id="likebutton"  `  + " onclick=likeHandle('"+singleBlog.key+"')></i>"

      +`   <i class="fas fa-comment-alt h2 text-primary col-1"></i>
      <i class="far fa-share-square h2 text-success col-1"    ></i>

      </div>
       <div class="form-group  row">
  
                  <input type="text" class="form-control col-lg-9 col-sm-8 col-8  ml-3 mr-1" id="comment" placeholder="Comment here .....">
              
                  <button type="submit" class='btn btn-primary col-lg-2 col-sm-2 col-2 mr-3 ' `  + " onclick=postComment('"+singleBlog.key+"')> <i class='fas fa-search'></i></button></div> </div>"
                  });
          
          $("#container").html(blogsHtml);

});







// function checkLike(Blogkey){

//   console.log(Blogkey);
//   var userid = firebase.auth().currentUser.uid;
//   var likeObj = firebase.database().ref().child("like_section").child(Blogkey);    //retrieve data from database with specific user ID
  
//   likeObj.once("value",function(likes)
//    {
//        console.log(likes.key,likes.val())
//  //  var targetID ='';
//       likes.forEach(function(like) {
//           console.log(like.key,like.val())
          
//            //   $("#likebutton").css("color", like.val());
//               $("#likebutton").addClass("text-danger");
//            //   console.log($("#likebutton")[0])
         
//       })
//   })

// }
function frame(type, url)
{
if(type == 'image/jpeg')
 return  ` <img src=${url} class="card-img-top" alt="..."/>`;
else if(type == 'video/mp4')
return   `<video class="card-img-top"  controls ><source src=${url}  type="video/mp4"></video> `
}
/**********Left side Story section end***************/ 

}


// /* Search engin part Start*/

// const searchInput = document.getElementById('search');

// function setList(group)
//  {
//         clearList();
//         console.log(group.val());

//         group.forEach(function(singleGroup)
//                 {
//                 //  console.log(singleGroup.val());
//                     const item = document.createElement('div');
//                     const image = document.createElement('img');
//         //             item.onclick = hellothis ;                       this is call without parameter
//                     item.addEventListener('click',function ()
//                     {
//                         hellothis(singleGroup.key);
//                     }); 
//             //    item.classList.add('list-group-item');
//                 item.classList.add('alert');
//             item.classList.add('alert-info');
//                 item.classList.add('h5');
//                 image.classList.add('rounded-circle');
                
//                 const text = document.createTextNode(" " + singleGroup.val().firstName);
//                 image.width = "40";
//                 image.height = "40";
//                 image.src = singleGroup.val().profileImg;
//                 item.appendChild(image);
//                 item.appendChild(text);
//                 list.appendChild(item);
//                 console.log(list)

//                 });
//                 if (group.length === 0)
//                     { setNoResults()}
//     }
// function clearList() {
//     while(list.firstChild)
//     {
//         list.removeChild(list.firstChild);
//     }   
// }
// function setNoResults() {
//     const item = document.createElement('li');
//             item.classList.add('list-group-item');
//             const text = document.createTextNode('No result found');
//             item.appendChild(text);
//             list.appendChild(item);   
// }
//     searchInput.addEventListener('input',(event)=>{
//     let value = event.target.value;
//     if (value && value.trim().length > 0) 
//         {
//             value = value.trim().toLowerCase();
//             dbBlogs = firebase.database().ref().child("Users").orderByChild("firstName").startAt(value).endAt(value +"\uf8ff");   //retrieve data from database with specific user ID
//             dbBlogs.on("value",function(blogs)
//             {  setList(blogs);
//             });
//         }
//     else{
//         clearList();
//         }
//     });


// /* Search engin part End */




