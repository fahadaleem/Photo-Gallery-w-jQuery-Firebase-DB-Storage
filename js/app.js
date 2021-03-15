$("#select-file").on("change", e=>{
    const file = e.target.files[0];
    const fileUrl=  firebase.storage().ref("images").child(file.name).put(file);
    fileUrl.on("state_changed", (snapshot)=>{
        //progress
        const progressPercentage = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
        $("#progress").css({width: `${progressPercentage}%`, display:"block"});

        if(progressPercentage===100)
        {
        $("#progress").css({display: `none`});
        }
    },
    (error)=>{
        // error
        console.log(error)
    },
    ()=>{
        // complete
        const url =  firebase.storage().ref("images").child(file.name).getDownloadURL().then(url=>{
            const key = firebase.database().ref("images").push().key;
        firebase.database().ref("images").child(key).child("img_url").set(url);
        console.log("data saved!")
        });

    }

) });


const retriveData = ()=>{

    
    $(".row").html("");
    firebase.database().ref("images").on("child_added", snap=>{
        const section = $(".row");
        section.prepend(`<div class="col-lg-4 my-2">
        <a href="${snap.val().img_url}" target="_blank">
            <img src="${snap.val().img_url}" alt="" class="img-fluid">
        </a>
    </div>`);
    section.show();
    })
}

const init = ()=>{
    retriveData();
}


init();