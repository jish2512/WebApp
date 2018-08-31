
/*
* Author: Lenny Granovsky 
* License: MIT license
* 
***************************************************************************
* Examples:
* //Any AJAX call adds correlation header to the request; no extra code
* $.get("<url>", null, function (sData, status, jqXHR) {...});
*
* //obtain current correlation Id
* var cid = $.correlator.getCorrelationId();
*    
* //renew correlation Id
* $.correlator.renewCorrelationId();
*
* //set custom correlation Id
* var cid = "a2b2b2ae-b6fb-4f06-9969-85e14965d422";
* $.correlator.setCorrelationId(cid);
***************************************************************************
*/
;
if (typeof jQuery === 'undefined') { throw new Error('AJAX correlation JavaScript plugin requires jQuery') }

(function ($) {
    'use strict';

    var component_name = "correlator";
    var storageItemName = "ajax.correlation.id";
    var hasSessionStorage = false;

    // detect sessionStorage support, see: http://dustindiaz.com/javascript-cache-provider
    try {
        hasSessionStorage = ('sessionStorage' in window) && window['sessionStorage'] !== null;
    } catch (ex) {
        // do nothing
    }

    var guid = {
        ///format: N - 32 digits: 00000000000000000000000000000000
        ///        D - 32 digits separated by hyphens: 00000000-0000-0000-0000-000000000000 (default)
        create: function (format) {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            var tmpGuid = (format == "N")
						? s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4()
						: s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            return tmpGuid;
        },
        empty: function (format) {
            if (format == "N") {
                return "00000000000000000000000000000000";
            } else {
                return "00000000-0000-0000-0000-000000000000";
            }
        }
    };

    function getFromStorage() {
        if (hasSessionStorage) {
            var tmp = window.sessionStorage.getItem(storageItemName);
            if (tmp != null && tmp != "null" && tmp.length > 0) {
                return tmp;
            }
        }
        return null;
    }

    function saveToStorage(val) {
        if (hasSessionStorage) {
            window.sessionStorage.setItem(storageItemName, val);
        }
    }

    var currentId = getFromStorage();
    if (currentId === null) {
        currentId = guid.create();
        saveToStorage(currentId);
    }

    var correlator = {
        getCorrelationId: function () {
            return currentId;
        },

        setCorrelationId: function (newId) {
            currentId = newId;
            saveToStorage(currentId);

            $.ajaxSetup({
                headers: { "X-CorrelationId": currentId }
            });
        },

        renewCorrelationId: function () {
            var tmp = guid.create();
            correlator.setCorrelationId(tmp);

            return currentId;
        }
    };

    $[component_name] = correlator;

    $.ajaxSetup({
        headers: { "X-CorrelationId": currentId }
    });

})(jQuery);
