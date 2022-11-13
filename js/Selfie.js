"use strict";
/* declare const Quagga: any;
console.log("b");
Quagga.decodeSingle({
  decoder: {
      readers: ["ean_reader"] // List of active readers
  },
  locate: true, // try to locate the barcode in the image
  src: './img/ean.png' // or 'data:image/jpg;base64,' + data
}, function(result:any){
  if(result.codeResult) {
      console.log("result", result.codeResult.code);
  } else {
      console.log("not detected");
  }
}); */
const barcode = document.getElementById("barcode_title");
const img_input = document.getElementById("img_input");
const div_img = document.getElementById("display_img");
const service = new WebSocket("ws://localhost:1963/DerrezLavergne/WebSocket");
service.onmessage = (event) => {
    console.log("Message from Java: " + event.data);
    window.alert(event.data);
};
service.onopen = (event) => {
    console.log("service.onopen...");
    //const response = window.confirm(service.url + " just opened... Say 'Hi!'?");
    if (1) {
        //service.send(JSON.stringify({ Response: "Hi!" }));
        if (img_input != null && div_img != null && barcode != null) {
            img_input.addEventListener("input", event => {
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                    const uploaded_image = reader.result;
                    div_img.innerHTML = `<img width="240" src="${uploaded_image}"/>`;
                    Quagga.decodeSingle({
                        numOfWorkers: 8,
                        decoder: {
                            readers: ["ean_reader"]
                        },
                        locate: true,
                        src: reader.result,
                        locator: {
                            patchSize: "medium",
                            halfSample: true
                        }
                    }, (result) => {
                        if (result.codeResult) {
                            barcode.innerHTML = result.codeResult.code;
                            service.send(JSON.stringify(result.codeResult.code));
                        }
                        else {
                            barcode.innerHTML = "not detected";
                        }
                    });
                });
                if (img_input.files != null)
                    reader.readAsDataURL(img_input.files[0]);
            });
        }
    }
};
service.onclose = (event) => {
    console.log("service.onclose... " + event.code);
    window.alert("Bye! See you later...");
    // '1011': the server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.
};
service.onerror = (event) => {
    window.alert("service.onerror...");
};
/* const service = new WebSocket("ws://localhost:1963/DerrezLavergne/WebSocket");
service.onmessage = (event: MessageEvent) => {
    console.log("Message from Java: " + event.data);
};
service.onopen = (event: Event) => {
    console.log("service.onopen...");
    const response = window.confirm(service.url + " just opened... Say 'Hi!'?");
    if (response){
      service.send(JSON.stringify({Response: "Hi!"}));
      Quagga.decodeSingle({
        decoder: {
            readers: ["ean_reader"] // List of active readers
        },
        locate: true, // try to locate the barcode in the image
        src: './img/ean.png' // or 'data:image/jpg;base64,' + data
      }, function(result:any){
        if(result.codeResult) {
          service.send(JSON.stringify(result.codeResult.code));
            console.log("result", result.codeResult.code);
        } else {
            console.log("not detected");
        }
      });
    }
        service.send(JSON.stringify({Response: "Hi!"}));
};
service.onclose = (event: CloseEvent) => {
    console.log("service.onclose... " + event.code);
    window.alert("Bye! See you later...");
// '1011': the server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.
};
service.onerror = (event: Event) => {
    window.alert("service.onerror...");
}; */
