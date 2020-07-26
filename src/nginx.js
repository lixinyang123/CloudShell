var fs = require("fs");
var child_process = require("child_process");
var common = require("./common");

var config,location;
var configPath = "/etc/nginx/sites-enabled/default";

function generator(containers){

    var configStr = undefined;

    if(containers.length==0){
        configStr = config.replace("@location","");
    }
    else{
        var proxyStr = "";
        containers.forEach(container => {

            if(common.inDocker()){
                //docker
                proxyStr += location.replace("@path", container.id).replace("@link", container.id + ":7681");
            }
            else{
                //native
                proxyStr += location.replace("@path", container.id).replace("@link", "localhost:" + container.port);
            }
            
        });
        configStr = config.replace("@location",proxyStr);
    }

    return configStr;
}

function apply(newConfig,callback){

    var config = fs.readFileSync(configPath).toString();

    //保存配置文件
    fs.writeFileSync(configPath,newConfig);

    //重启nginx
    child_process.exec("nginx -s reload",(error,stdout,stderr)=>{
        if(error || stderr){
            //重启nginx失败，还原配置文件
            fs.writeFileSync(configPath,config);
            callback(false);
        }
        else{
            callback(true);
        }
    });
}

function init(){

    config = fs.readFileSync("./assets/default.conf").toString();
    location = fs.readFileSync("./assets/location.conf").toString();

    //启动nginx
    child_process.exec("service nginx start");

    module.exports = {
        generator,apply
    }
}

init();