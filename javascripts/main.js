$( window ).ready(function(){

    var listuser = new Firebase('https://leng.firebaseio.com/users');
    var pushRef;
    var me;
    var uname;
    var auth = new FirebaseSimpleLogin(listuser, function(error, user) {
        if (error) {
            alert("An error occurred while attempting login.");
            uname = "unknwon"
        } else if (user) {        
//            var name = user.displayName;        
//            newuser(name);
            uname = user.displayName;
        } else {
// No connected                        
            uname = prompt("Your name");
        }
    });

    listuser.on('child_added', getusers);
    listuser.on('child_removed',byeuser);

    $( "a.user" ).live( "click", function() {

        var destId = $( this ).attr("id");        
        var destName = $( this ).html();
        
        
        sendText(destId,destName);
 
    });

    function startConnection(){
        conn = peer.connect();
        //Receive connection from dest
        peer.on('connection',function(conn){
            conn.on('data',function(data){                
                alert(data);
            });
        });    
    }    

    function sendText(to,name){
        conn = peer.connect(to);
        conn.on('open',function(){
            console.log("sending message");
            conn.send("Hey " + name + " !!" );
            console.log("sent!");
        });
    }

    function byeuser(e){
        var id = e.val().id;
        console.log("Bye: " + id);
        $("#" + id).remove();
    }


    $( window ).unload(function(){
        pushRef.remove();
    });

    $( "ul li a.user" ).click(function() {
        
    });

    function getusers (e) {
        var user = e.val();
        adduser(user.id,user.name);
    }
    

    function login(){
        auth.login('facebook');
    }
    

    function getname(){
        
    }

    function newuser(id){
        pushRef = listuser.push();
        pushRef.set({
            name : uname,
            id : id
        });   
        
    }

    function adduser(id,name){
        if(id!=me){
            $('#users').append(
                $('<li>').append(
                    $('<a>')
                        .attr('class',"user")
                        .attr('id',id)
                        .attr('href',"#")
                        .append(""+name)));}        
    }

    var peer = new Peer({key: '11fmnald3g7j5rk9'});

    peer.on('open', function(id) {
        me = id;
        newuser(id);        
    });

    startConnection();

});
