import { Observable } from 'rx';

export class FxpHttpService {
    constructor(private $http: angular.IHttpService) {
    }
    get(url: string, headers?: any): Observable<any> {
        var self = this;
        return Observable.fromPromise(self.$http.get(url, { headers: headers })).map(response => response);
    }
    put(url: string, data: any, headers?: any): Observable<any> {
        var self = this;
        return Observable.fromPromise(self.$http.put(url, data, { headers: headers })).map(response => response);
    }
    patch(url: string, data: any, headers?: any): Observable<any> {
        var self = this;
        return Observable.fromPromise(self.$http.patch(url, data, { headers: headers })).map(response => response);
    }
    post(url: string, data: any, headers?: any): Observable<any> {
        var self = this;
        return Observable.fromPromise(self.$http.post(url, data, { headers: headers })).map(response => response);
    }
    jsonp(url: string, data: any, headers?: any): Observable<any> {
        var self = this;
        return Observable.fromPromise(self.$http.jsonp(url, { headers: headers })).map(response => response);
    }
    delete(url: string, headers?: any): Observable<any> {
        var self = this;
        return Observable.fromPromise(self.$http.delete(url, { headers: headers })).map(response => response);
    }
    head(url: string, headers?: any): Observable<any> {
        var self = this;
        return Observable.fromPromise(self.$http.head(url, { headers: headers })).map(response => response);
    }
}