const gtagObj = {};
const fbUrl = "https://dateideaslogging.firebaseio.com/events.json";

function gtag(){
  const args = arguments;
  window.dataLayer.push(args);

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
        link: link,
        user_id: gtagObj.user_id || '',
        tstamp: (new Date()).toISOString()
      }
    }));
  }

  const cmd = args[0];
  if(cmd==="set"){ setData(args[1]); }
  if(cmd==="event"){
    if(args[1]==="page_view"){
      sendReq(gtagObj.page_path);
    }else{
      const obj = args[2] || {};
      let data = '';

      Object.keys(obj).forEach(function(key){
        data += `${key}=${obj[key]}`;
      });

      sendReq(`/evt/${args[1]}?${data}`);
    }
  }
}
