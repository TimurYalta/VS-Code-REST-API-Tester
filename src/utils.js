const parseResponse = (response) => {
    const strings = [];
    strings.push(`HTTP/1.1 ${response.status} ${response.statusText}`);
    strings.push(`\nHeaders:\n`);
    response.headers.forEach((element,key) => {
        const formattedKey = key.replace(/\b[a-z]/g, (v) => {return v.toUpperCase();});
        strings.push(formattedKey+": "+element);
    });
    strings.push("\n-----------------------------");
    strings.push(`\nBody:\n`);

    if(response.headers.get('content-type').includes("html")){
        return response.text()
                .then((res)=>{
                    strings.push(res); 
                    return new Promise((resolve,reject)=>{
                        resolve(strings.join("\n\n"));
                    });
                });
    }
    else{
        return response.json()
                .then((res)=>{

                    strings.push(JSON.stringify(res,null,2)); 
                    return new Promise((resolve,reject)=>{
                        resolve(strings.join("\n\n"));
                    });
                });
    }
}
module.exports = {
    parseResponse
}