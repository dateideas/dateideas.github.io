const gtagObj = {};
const fbUrl = "https://firestore.googleapis.com/v1beta1/projects/dateideaslogging/databases/(default)/documents/logs";

function gtag(){
  const args = arguments;
  dataLayer.push(args);

  function setData(data){
    Object.keys(data).forEach((key) => {
      gtagObj[key] = data[key];
    });
  }

  function sendReq(link){
    if(!link){ return null; }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", fbUrl);
    xhr.send(JSON.stringify({
      fields:{
        link: {
          stringValue: link
        },
        user_id: {
          stringValue: gtagObj.user_id || ''
        },
        tstamp: {
          timestampValue: (new Date()).toISOString()
        }
      }
    }));
  }

  const cmd = args[0];
  if(cmd==="set"){ setData(args[1]); }
  if(cmd==="event"){
    if(args[1]==="page_view"){
      sendReq(gtagObj.page_path);
    }else{
      sendReq(`/evt/${args[2]}`);
    }
  }
}

