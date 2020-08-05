caches.open('v1')
    .then(function (cache) {
        //cache.put('url-1', {x: 5});
        console.log('cache', cache);
    });

self.addEventListener('install', (event) => {
    console.log(event);
    console.log(event);
    console.log(event);
    console.log(event);
});

self.addEventListener('fetch', () => {
    console.log('fetch', arguments);
});


let stack = [];
let busy = false;


let tryOne = function () {
    let data;
    if (busy) return;
    data = stack.shift();
    if (!data) return;

    busy = true;

    start = Date.now();

    fetch(data.path)
        .then(function (response) {
            return response.blob();
        })
        .then(function (blob) {

            return createImageBitmap(blob);
        })
        .then(function (imageBitmap) {
            //console.log((Date.now() - start) / 1000);
            postMessage([imageBitmap, data.path, data.url]);
            busy = false;
            tryOne();
        });
};

onmessage = function (message) {
    let data;
    data = {
        path: message.data[0],
        meta: message.data[1],
        url: message.data[2]
    };

    stack.push(data);

    tryOne();
};



