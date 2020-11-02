const Eureka = require('eureka-js-client').Eureka;
const eurekaHost = ("161.35.252.165" || '127.0.0.1');
const eurekaPort = 8761;
const hostName = ('services.watasoft.com' || 'localhost')
const ipAddr = '167.172.3.68';

export var registerWithEureka = function (appName, PORT:number) {
    const client = new Eureka({
        instance: {
            app: appName,
            hostName: hostName,
            ipAddr: ipAddr,
            port: {
                '$': PORT,
                '@enabled': 'true',
            },
            vipAddress: appName,
            dataCenterInfo: {
                '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                name: 'MyOwn',
            },
        },
        //retry 10 time for 3 minute 20 seconds.
        eureka: {
            host: eurekaHost,
            port: eurekaPort,
            servicePath: '/eureka/apps/',
            maxRetries: 10,
            requestRetryDelay: 2000,
        },
    })

    client.start(error => {
        console.log(error || "user service registered")
    });



    function exitHandler(options, exitCode) {
        if (options.cleanup) { }
        if (exitCode || exitCode === 0) console.log(exitCode);
        if (options.exit) {
            client.stop();
        }
    }

    client.on('deregistered', () => {
        process.exit();
        console.log('after deregistered');
    })

    client.on('started', () => {
        console.log("eureka host  " + eurekaHost);
    })

    process.on('SIGINT', exitHandler.bind(null, { exit: true }));
};