const view = require('./view.js');
const parseResponse = (response, opt) => {
    const strings = [];
    strings.push(`${opt.options.method?opt.options.method:"GET"} ${opt.url}`);
    strings.push(`${JSON.stringify(opt.options, null, 2)}`);
    strings.push(`*************************`)
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
                    return new Promise((resolve)=>{
                        resolve(strings.join("\n\n"));
                    });
                });
    }
    else{
        return response.json()
                .then((res)=>{

                    strings.push(JSON.stringify(res,null,2)); 
                    return new Promise((resolve)=>{
                        resolve(strings.join("\n\n"));
                    });
                });
    }
}

var fs = require('fs');

function getIncludingElIndexes(arr,del){
    const res=[];
    for(let i =0;i< arr.length;i++){
        if(arr[i].includes(del)){
            res.push(i);
        }
    }
    return res;
}

function getFirstIncludingElIndex(arr, del){
    for(let i =0;i< arr.length;i++){
        if(arr[i].includes(del)){
            return i;
        }
    }
    return -1;
}

function readLines(file){
    let res = fs.readFileSync(file).toString().split("\n");
    res = res.map((el)=>{return el.replace(/\r?\n|\r/,"")});
    res = res.filter((el)=>{return el});
    const endLines = getIncludingElIndexes(res,"#");
    let reqs=[];
    reqs.push(res.slice(0,endLines[0]));

    for(let i = 1;i<endLines.length;i++){
        reqs.push(res.slice(endLines[i-1],endLines[i]))
    }
    reqs= reqs.map((e)=>{
        return e.filter((el)=>{
            return !el.includes("#")
        });
    });
    return  reqs;
}

function requestParser(file){
    try{
        const reqs = readLines(file);
        const objs=[]
        for(let req of reqs){
            let object={options:{}}
            const main = req[0].trim().split(" ");
            object.URI = main[1];
            object.options.method = main[0];
            const headerStart = getFirstIncludingElIndex(req, "HEADERS");
            
            const bodyStart =  getFirstIncludingElIndex(req, "BODY");
            if(headerStart!=-1){
                let endIndex = bodyStart !=-1 ? bodyStart : req.length;
                let headerString = req.slice(headerStart+1, endIndex).join("");
                if(headerString){
                    object.options.header= JSON.parse(headerString);
                }
            }
            if(bodyStart!=-1){
                const bodyStrings = req.slice(bodyStart+1);
                bodyStrings[0]=bodyStrings[0].replace(new RegExp('"'), "");
                bodyStrings[bodyStrings.length-1] = bodyStrings[bodyStrings.length-1].replace(new RegExp('"'+'$'), ""); 
                object.options.body = bodyStrings.join("");
            }
            objs.push(object);
        }
        return objs;
    }
    catch(e){
        view.renderError("Check file validity!");
    }    
}

const getReqSnippet=()=>{
    let arr=[
        "<Method> https://<Your url comes here>",
        "",
        "HEADERS",
        "{",
        "<HeaderName>: <HeaderValue>",
        "}",
        "",
        "BODY",
        "\"<Body>\"",
        "",
        "###//Please notice to save this file with *.req extension"
    ];
    return arr.join('\n');
}

module.exports = {
    parseResponse,
    requestParser,
    getReqSnippet
}