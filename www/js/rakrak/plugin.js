function showMsg(x_msg){
    document.getElementById("waitMsg").innerHTML = x_msg;
    document.getElementById("waitDiv").style.display = "";
}
function hideMsg(){
    document.getElementById("waitMsg").innerHTML = "";
    document.getElementById("waitDiv").style.display = "none";
}
function showFavorite(){
    document.getElementById("favoriteDiv").style.display = "";
}

function clearValues(){
    document.getElementById("name").value = "";
    document.getElementById("roman").value = "";
    document.getElementById("tel").value = "";
    document.getElementById("empid").value = "";

    document.getElementById("image").src = "";

    document.getElementById("favoriteDiv").style.display = "none";
    document.getElementById("favorite").src = "";
    hideMsg();
}

function afterUpload(r){
    try{
      var json = JSON.parse( r.response );
      var p_input = document.getElementById("name"); //名前
      p_input.value=json.result.name;

      p_input = document.getElementById("roman"); //ローマ字
      p_input.value=json.result.romanName;

      p_input = document.getElementById("tel"); //電話
      p_input.value=json.result.phoneNumber;

      p_input = document.getElementById("empid"); //社員番号
      p_input.value=json.result.syainId;

    }catch(e){
      alert('afterUpload error\n'+ e);
    }
    hideMsg();
}

function afterError(error){
  alert("uploadエラーが発生しました: Code = " + error.code);
  //alert("upload error source " + error.source);
  //alert("upload error target " + error.target);

  hideMsg();
}

function doCamera(){
        clearValues(); // 画面クリア

        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URL,
            sourceType: 1,     // 0:Photo Library, 1=Camera, 2=Saved Album
            encodingType: 0     // 0=JPG 1=PNG
        };

        // カメラを起動
        navigator.camera.getPicture(
            function(fileURL) { // camera success
                try{
                    //alert(fileURL);

                    var p_img = document.getElementById("image");
                    //p_img.attr('src', "data:image/jpeg;base64,"+imgData);
                    p_img.src = fileURL;

                    showMsg('名刺を解析します。<br>数秒お待ちください');

                    var p_filename = fileURL.substr(fileURL.lastIndexOf('/')+1);
                    var p_ft = new FileTransfer();
                    var p_uploadOpts = new FileUploadOptions();
                    p_uploadOpts.fileKey = "uploadImage";
                    p_uploadOpts.fileName= p_filename;
                    p_uploadOpts.mimeType="image/jpeg";
                    //alert('uploadImage=' + p_filename);

                    p_ft.upload(fileURL, encodeURI("http://192.168.128.99:9999/api/upload"), afterUpload, afterError, p_uploadOpts);
                }catch(e){
                    alert(e);
                }

            },
            function() { // camera failed
                alert('Camera error', 'Error');
            },
            options
        );
}

function doFavorite(){
    showMsg('趣味を検索します。<br>数秒お待ちください。');

    var p_url = "http://192.168.128.99:8081/people-around/"
    var p_name = document.getElementById("name").value;
    p_name = p_name.replace("　", "");
    p_name = p_name.replace(".", "");
    p_name = p_name.replace(" ", "");
    //alert("氏名=" + p_name);
    
    p_url += encodeURI(p_name);
    p_url += "?similar=true";
    //alert("URL=" + p_url);

    var p_img = document.getElementById("favorite");
    p_img.addEventListener('load', function(){
          hideMsg();
          showFavorite();
      },
      false
    );
    p_img.src = p_url;

    if(false){
      downloader.init({folder: "bstry"});
      downloader.get(p_url);

      document.addEventListener('DOWNLOADER_downloadSuccess', function(event) {
          try{
              const data = event.data;
              alert(data[0].name);
              alert(data[0].fullPath);
              alert(data[0].nativeURL);

              var p_img = document.getElementById("favorite");
              p_img.src = fileURL;

              document.getElementById("favoriteDiv").style.display = "";

          }catch(e){
              alert(e);
          }
      });
    }
}

function resizeFavorite(x_diff){
  try{
      var p_obj = document.getElementById("favorite");
      var p_width = p_obj.width;
      p_width = parseInt(p_width) + x_diff;
      p_obj.width = p_width;
  }catch(e){
    alert(e);
  }
}

function upFavorite(){
  resizeFavorite(100);
}
function downFavorite(){
  resizeFavorite(-100);
}

// connect to button
var p_obj = document.getElementById('cameraBtn');
p_obj.addEventListener('click', doCamera, false);

// favorite
p_obj = document.getElementById('favoriteBtn');
p_obj.addEventListener('click', doFavorite, false);

p_obj = document.getElementById('favoriteDown');
p_obj.addEventListener('click', downFavorite, false);

p_obj = document.getElementById('favoriteUp');
p_obj.addEventListener('click', upFavorite, false);


