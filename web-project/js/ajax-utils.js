(function (global) {

    let ajaxUtils = {};

    function getRequestObject() {
        if(global.XMLHttpRequest) {
            return (new XMLHttpRequest());
        }
        else {
            global.alert("XHR is not supported");
        }
    }

    ajaxUtils.sendGetRequest = function(requestUrl, responseHandler) {
        let request = getRequestObject();
        
        request.onreadystatechange = function () {
            handleResponse(request, responseHandler);
        };

        request.open('GET', requestUrl);
        // request.responseType = 'text';
        request.send();
    };

    function handleResponse(request, responseHandler) {
        if ((request.readyState == 4) && (request.status == 200)) {
            responseHandler(request);
        }

    }

    global.$ajaxUtils = ajaxUtils;

})(window);